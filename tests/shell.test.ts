import { describe, expect, it } from "vitest"
import { cardFilterSearchSchema } from "../src/lib/search-params.ts"
import {
  filterCards,
  getAdjacentCards,
  getCardsForChapter,
  getChapterTags,
  getNextUnseenCard,
  getOrderedCards,
  getProgressCounts,
  getRelatedCardsInfo,
} from "../src/lib/selectors.ts"
import type { HandbookBundle } from "../src/lib/types.ts"
import { splitInlineCode, stripInlineCode } from "../src/lib/text.ts"
import { formatHotkeyLabel } from "../src/lib/keyboard.ts"

const mockBundle: HandbookBundle = {
  handbook: {
    id: "python",
    name: "Python",
    tagline: "Test",
    icon: "python",
    accent: "#4a90e2",
    accent2: "#ffd43b",
    version: 1,
    chapterCount: 2,
    cardCount: 3,
    chapters: [
      {
        slug: "basics",
        dirName: "01-basics",
        order: 1,
        title: "Basics",
        emoji: "🧱",
        description: "Basics chapter",
        cardCount: 2,
      },
      {
        slug: "functions",
        dirName: "02-functions",
        order: 2,
        title: "Functions",
        emoji: "⚡",
        description: "Functions chapter",
        cardCount: 1,
      },
    ],
  },
  cards: [
    {
      id: "python.functions.args",
      handbook: "python",
      chapter: "functions",
      order: 1,
      type: "concept",
      title: "Args and kwargs",
      difficulty: "easy",
      tags: ["functions", "syntax"],
      mostAsked: false,
      readTime: 2,
      related: ["python.basics.mutability"],
      revision: [],
      sections: { body: "<p>Body</p>" },
      meta: {},
      searchText: "args kwargs",
    },
    {
      id: "python.basics.equals",
      handbook: "python",
      chapter: "basics",
      order: 2,
      type: "predict",
      title: "is vs ==",
      difficulty: "medium",
      tags: ["memory", "operators"],
      mostAsked: true,
      readTime: 2,
      related: [],
      revision: [],
      sections: { code: "", output: "" },
      meta: {},
      searchText: "is vs equals",
    },
    {
      id: "python.basics.mutability",
      handbook: "python",
      chapter: "basics",
      order: 1,
      type: "question",
      title: "Mutable vs immutable",
      difficulty: "hard",
      tags: ["memory", "data-types"],
      mostAsked: true,
      readTime: 3,
      related: ["python.basics.equals"],
      revision: ["Strings are immutable"],
      sections: { answer: "<p>Yes</p>" },
      meta: {},
      searchText: "mutable immutable",
    },
  ],
}

describe("cardFilterSearchSchema", () => {
  it("validates query params and normalizes mostAsked=1", () => {
    const parsed = cardFilterSearchSchema.parse({
      difficulty: "hard",
      tag: "memory",
      status: "revisit",
      mostAsked: 1,
      sort: "alpha",
    })
    expect(parsed).toEqual({
      difficulty: "hard",
      tag: "memory",
      status: "revisit",
      mostAsked: true,
      sort: "alpha",
    })
  })

  it("drops invalid filter values cleanly via catch", () => {
    const parsed = cardFilterSearchSchema.parse({
      difficulty: "impossible",
      status: "bogus",
      mostAsked: "0",
      sort: "random",
    })
    expect(parsed).toEqual({
      difficulty: undefined,
      tag: undefined,
      status: undefined,
      mostAsked: undefined,
      sort: undefined,
    })
  })
})

describe("handbook selectors", () => {
  it("orders chapters and cards deterministically and resolves prev/next", () => {
    const basicsCards = getCardsForChapter(mockBundle, "basics")
    expect(basicsCards.map((c) => c.id)).toEqual([
      "python.basics.mutability",
      "python.basics.equals",
    ])

    const ordered = getOrderedCards(mockBundle)
    expect(ordered.map((c) => c.id)).toEqual([
      "python.basics.mutability",
      "python.basics.equals",
      "python.functions.args",
    ])

    expect(getAdjacentCards(mockBundle, "python.basics.equals")).toMatchObject({
      prev: { id: "python.basics.mutability" },
      next: { id: "python.functions.args" },
    })
  })

  it("computes progress counts, related card titles, and combined filters", () => {
    const statusMap = {
      "python.basics.mutability": "known" as const,
      "python.basics.equals": "revisit" as const,
    }

    expect(getProgressCounts(mockBundle.cards, statusMap)).toEqual({
      total: 3,
      known: 1,
      revisit: 1,
      untouched: 1,
      percent: 33,
    })

    expect(getRelatedCardsInfo(mockBundle.cards[2], mockBundle.cards)).toEqual([
      { id: "python.basics.equals", title: "is vs ==" },
    ])

    const filtered = filterCards(
      getOrderedCards(mockBundle),
      { tag: "memory", mostAsked: true, status: "revisit" },
      statusMap
    )
    expect(filtered.map((c) => c.id)).toEqual(["python.basics.equals"])

    const multiTagFiltered = filterCards(
      getOrderedCards(mockBundle),
      { tag: "operators,syntax" },
      statusMap
    )
    expect(multiTagFiltered.map((c) => c.id)).toEqual([
      "python.basics.equals",
      "python.functions.args",
    ])
  })

  it("finds next unseen card skipping known cards and extracts sorted chapter tags", () => {
    expect(getChapterTags(mockBundle.cards)).toEqual([
      "data-types",
      "functions",
      "memory",
      "operators",
      "syntax",
    ])

    const statusSkipMiddle = {
      "python.basics.equals": "known" as const,
    }
    expect(
      getNextUnseenCard(
        mockBundle,
        "python.basics.mutability",
        statusSkipMiddle
      )?.id
    ).toBe("python.functions.args")

    const statusAllOthersKnown = {
      "python.basics.equals": "known" as const,
      "python.functions.args": "known" as const,
    }
    expect(
      getNextUnseenCard(
        mockBundle,
        "python.basics.mutability",
        statusAllOthersKnown
      )
    ).toBeNull()
  })
})

describe("inline code title formatting", () => {
  it("strips markdown backticks cleanly for plain text labels", () => {
    expect(stripInlineCode("`is` vs `==` on lists")).toBe("is vs == on lists")
    expect(stripInlineCode("No code here")).toBe("No code here")
  })

  it("splits markdown inline code spans without losing surrounding text", () => {
    expect(splitInlineCode("`*args` and `**kwargs`")).toEqual([
      { text: "*args", isCode: true },
      { text: " and ", isCode: false },
      { text: "**kwargs", isCode: true },
    ])
  })
})

describe("keyboard shortcut labels", () => {
  it("renders readable labels for Space, ArrowLeft, ArrowRight, and Mod+K", () => {
    expect(formatHotkeyLabel("Space", () => " ")).toBe("Space")
    expect(formatHotkeyLabel("ArrowLeft", () => "Left")).toBe("←")
    expect(formatHotkeyLabel("ArrowRight", () => "Right")).toBe("→")
    expect(formatHotkeyLabel("Mod+K", () => "Ctrl+K")).toBe("Ctrl+K")
  })
})
