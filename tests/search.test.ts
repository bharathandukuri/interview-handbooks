import path from "node:path"
import { performance } from "node:perf_hooks"
import { describe, expect, it } from "vitest"
import { loadAllHandbooks } from "../plugins/handbook-content.ts"
import {
  createSearchIndex,
  getMatchRanges,
  getSearchSnippet,
  highlightSubstring,
  mergeMatchIntervals,
  searchChapters,
  searchEntries,
} from "../src/lib/search.ts"
import type { SearchEntry } from "../src/lib/types.ts"

const sampleEntries: SearchEntry[] = [
  {
    id: "python.basics.mutability",
    title: "Mutable vs immutable: why does it matter?",
    tags: ["data-types", "memory"],
    searchText:
      "An immutable object cannot change in place while lists append elements directly.",
    chapter: "basics",
    chapterTitle: "Python Basics",
    type: "question",
    difficulty: "easy",
    mostAsked: true,
  },
  {
    id: "python.basics.is-vs-equals",
    title: "`is` vs `==` on lists and aliases",
    tags: ["equality", "identity", "memory"],
    searchText:
      "== calls __eq__ whereas is compares object identity id() references.",
    chapter: "basics",
    chapterTitle: "Python Basics",
    type: "predict",
    difficulty: "easy",
    mostAsked: false,
  },
  {
    id: "python.functions.args-kwargs",
    title: "`*args` and `**kwargs`: unpacking vs packing",
    tags: ["functions", "syntax"],
    searchText:
      "Use *args for positional tuples and **kwargs for keyword dicts. Immutable parameters stay safe.",
    chapter: "functions",
    chapterTitle: "Functions & Closures",
    type: "concept",
    difficulty: "easy",
    mostAsked: false,
  },
]

describe("search helpers and Fuse index", () => {
  it("merges overlapping highlight intervals and splits ranges accurately", () => {
    expect(
      mergeMatchIntervals(
        [
          [2, 4],
          [3, 6],
          [7, 8],
          [12, 99],
        ],
        15
      )
    ).toEqual([
      [2, 8],
      [12, 14],
    ])

    expect(getMatchRanges("Python Basics", [[0, 5]])).toEqual([
      { text: "Python", highlighted: true },
      { text: " Basics", highlighted: false },
    ])

    expect(highlightSubstring("Functions & Closures", "clo")).toEqual([
      { text: "Functions & ", highlighted: false },
      { text: "Clo", highlighted: true },
      { text: "sures", highlighted: false },
    ])
  })

  it("weights title matches above body matches and strips backticks cleanly", () => {
    const { fuse } = createSearchIndex(sampleEntries)

    const immutableResults = searchEntries(fuse, sampleEntries, "immutable")
    expect(immutableResults[0]?.item.id).toBe("python.basics.mutability")
    expect(immutableResults[0]?.titleSegments.some((s) => s.highlighted)).toBe(
      true
    )

    const inlineCodeResults = searchEntries(fuse, sampleEntries, "is vs")
    expect(inlineCodeResults[0]?.item.id).toBe("python.basics.is-vs-equals")
    expect(
      inlineCodeResults[0]?.titleSegments.map((s) => s.text).join("")
    ).toBe("is vs == on lists and aliases")
    expect(inlineCodeResults[0]?.titleSegments.some((s) => s.highlighted)).toBe(
      true
    )
  })

  it("matches by tag and body searchText and builds highlighted snippets", () => {
    const { fuse } = createSearchIndex(sampleEntries)

    const tagResults = searchEntries(fuse, sampleEntries, "equality")
    expect(tagResults[0]?.item.id).toBe("python.basics.is-vs-equals")
    expect(tagResults[0]?.matchedTags[0]?.tag).toBe("equality")
    expect(
      tagResults[0]?.matchedTags[0]?.segments.some((s) => s.highlighted)
    ).toBe(true)

    const bodyResults = searchEntries(fuse, sampleEntries, "identity")
    expect(bodyResults[0]?.item.id).toBe("python.basics.is-vs-equals")
    expect(bodyResults[0]?.bodySnippet).not.toBeNull()
    expect(bodyResults[0]?.bodySnippet?.some((s) => s.highlighted)).toBe(true)

    const snippet = getSearchSnippet(
      "Prefix words before the important target keyword in a very long paragraph so ellipsis appears nicely at both ends of the snippet.",
      [[34, 47]],
      48
    )
    expect(snippet).not.toBeNull()
    expect(snippet?.some((s) => s.highlighted)).toBe(true)
  })

  it("filters chapters by title or description and indexes real content files", async () => {
    const chapters = [
      { title: "Python Basics", description: "Mutability and references" },
      { title: "Functions & Closures", description: "Scope and decorators" },
    ]
    const matched = searchChapters(chapters, "decorators")
    expect(matched).toHaveLength(1)
    expect(matched[0]?.chapter.title).toBe("Functions & Closures")

    const data = await loadAllHandbooks(path.resolve(process.cwd(), "content"))
    const pyEntries = data.search.python ?? []
    expect(pyEntries.length).toBeGreaterThanOrEqual(3)

    const { fuse } = createSearchIndex(pyEntries)
    const first = pyEntries[0]
    const found = searchEntries(fuse, pyEntries, first?.title ?? "")
    expect(found.some((f) => f.item.id === first?.id)).toBe(true)
  })

  it("searches 500 entries well under 100ms", () => {
    const bulk: SearchEntry[] = Array.from({ length: 500 }, (_, i) => ({
      id: `hb.ch.card-${i}`,
      title: `Card ${i} about ${i % 2 === 0 ? "closures" : "concurrency"}`,
      tags: ["python", i % 5 === 0 ? "generators" : "typing"],
      searchText: `Detailed body explanation #${i} covering event loops, memory layout, and hash tables.`,
      chapter: "ch",
      chapterTitle: "Core Concepts",
      type: "question",
      difficulty: "medium",
      mostAsked: i % 10 === 0,
    }))

    const { fuse } = createSearchIndex(bulk)
    const start = performance.now()
    const results = searchEntries(fuse, bulk, "generators")
    const elapsedMs = performance.now() - start

    expect(results.length).toBeGreaterThan(0)
    expect(elapsedMs).toBeLessThan(100)
  })
})
