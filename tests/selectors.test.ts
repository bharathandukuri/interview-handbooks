import { describe, expect, it } from "vitest"
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
import type { Card, CardStatus, HandbookBundle } from "../src/lib/types.ts"

function makeCard(
  overrides: Partial<Card> & Pick<Card, "id" | "chapter" | "order" | "title">
): Card {
  return {
    handbook: "test",
    type: "question",
    difficulty: "medium",
    tags: [],
    mostAsked: false,
    readTime: 2,
    related: [],
    revision: [],
    sections: { answer: "<p>Answer</p>" },
    meta: {},
    searchText: overrides.title.toLowerCase(),
    ...overrides,
  }
}

const bundle: HandbookBundle = {
  handbook: {
    id: "test",
    name: "Test Handbook",
    tagline: "Selector test fixture",
    icon: "python",
    accent: "#4a90e2",
    accent2: "#ffd43b",
    version: 1,
    chapterCount: 2,
    cardCount: 4,
    chapters: [
      {
        slug: "alpha",
        dirName: "01-alpha",
        order: 1,
        title: "Alpha",
        emoji: "🅰️",
        description: "First chapter",
        cardCount: 2,
      },
      {
        slug: "beta",
        dirName: "02-beta",
        order: 2,
        title: "Beta",
        emoji: "🅱️",
        description: "Second chapter",
        cardCount: 2,
      },
    ],
  },
  cards: [
    makeCard({
      id: "test.beta.zebra",
      chapter: "beta",
      order: 2,
      title: "Zebra async await",
      difficulty: "hard",
      tags: ["async", "concurrency"],
      mostAsked: true,
      related: ["test.alpha.basics", "test.missing.custom-slug-name"],
    }),
    makeCard({
      id: "test.alpha.second",
      chapter: "alpha",
      order: 2,
      title: "Alpha decorators",
      difficulty: "medium",
      tags: ["functions", "syntax"],
      mostAsked: false,
    }),
    makeCard({
      id: "test.alpha.basics",
      chapter: "alpha",
      order: 1,
      title: "Basics memory model",
      difficulty: "easy",
      tags: ["memory", "syntax"],
      mostAsked: true,
    }),
    makeCard({
      id: "test.beta.first",
      chapter: "beta",
      order: 1,
      title: "Beta iterators",
      difficulty: "medium",
      tags: ["iteration"],
      mostAsked: false,
    }),
  ],
}

describe("selectors unit suite", () => {
  it("sorts cards within a chapter and globally across chapters", () => {
    expect(getCardsForChapter(bundle, "alpha").map((c) => c.id)).toEqual([
      "test.alpha.basics",
      "test.alpha.second",
    ])
    expect(getCardsForChapter(bundle, "nonexistent")).toEqual([])

    expect(getOrderedCards(bundle).map((c) => c.id)).toEqual([
      "test.alpha.basics",
      "test.alpha.second",
      "test.beta.first",
      "test.beta.zebra",
    ])

    const bundleWithOrphan: HandbookBundle = {
      ...bundle,
      cards: [
        ...bundle.cards,
        makeCard({
          id: "test.orphan.item",
          chapter: "orphan",
          order: 1,
          title: "Orphan card",
        }),
      ],
    }
    const orderedOrphan = getOrderedCards(bundleWithOrphan)
    expect(orderedOrphan.at(-1)?.id).toBe("test.orphan.item")
  })

  it("computes progress counts for empty, partial, and complete card sets", () => {
    expect(getProgressCounts([], {})).toEqual({
      total: 0,
      known: 0,
      revisit: 0,
      untouched: 0,
      percent: 0,
    })

    const statusMap: Record<string, CardStatus> = {
      "test.alpha.basics": "known",
      "test.alpha.second": "revisit",
      "test.other.card": "known",
    }
    expect(getProgressCounts(bundle.cards, statusMap)).toEqual({
      total: 4,
      known: 1,
      revisit: 1,
      untouched: 2,
      percent: 25,
    })

    const allKnown: Record<string, CardStatus> = {
      "test.alpha.basics": "known",
      "test.alpha.second": "known",
      "test.beta.first": "known",
      "test.beta.zebra": "known",
    }
    expect(getProgressCounts(bundle.cards, allKnown)).toEqual({
      total: 4,
      known: 4,
      revisit: 0,
      untouched: 0,
      percent: 100,
    })
  })

  it("resolves adjacent cards and handles missing card IDs", () => {
    const first = getAdjacentCards(bundle, "test.alpha.basics")
    expect(first.prev).toBeNull()
    expect(first.next?.id).toBe("test.alpha.second")
    expect(first.index).toBe(0)
    expect(first.total).toBe(4)

    const last = getAdjacentCards(bundle, "test.beta.zebra")
    expect(last.prev?.id).toBe("test.beta.first")
    expect(last.next).toBeNull()
    expect(last.index).toBe(3)

    const missing = getAdjacentCards(bundle, "test.alpha.unknown")
    expect(missing).toEqual({ prev: null, next: null, index: -1, total: 4 })
  })

  it("finds next unseen card with wrap-around and returns null when all cards are known", () => {
    const partial: Record<string, CardStatus> = {
      "test.beta.zebra": "known",
      "test.alpha.basics": "known",
    }
    expect(getNextUnseenCard(bundle, "test.beta.first", partial)?.id).toBe(
      "test.alpha.second"
    )

    const allKnown: Record<string, CardStatus> = {
      "test.alpha.basics": "known",
      "test.alpha.second": "known",
      "test.beta.first": "known",
      "test.beta.zebra": "known",
    }
    expect(getNextUnseenCard(bundle, "test.alpha.basics", allKnown)).toBeNull()

    const singleCardBundle: HandbookBundle = {
      ...bundle,
      cards: [bundle.cards[0]],
    }
    expect(
      getNextUnseenCard(singleCardBundle, "test.beta.zebra", {})
    ).toBeNull()
  })

  it("resolves related card titles and humanizes missing targets", () => {
    const zebra = bundle.cards[0]
    expect(getRelatedCardsInfo(zebra, bundle.cards)).toEqual([
      { id: "test.alpha.basics", title: "Basics memory model" },
      { id: "test.missing.custom-slug-name", title: "custom slug name" },
    ])
  })

  it("extracts sorted unique chapter tags", () => {
    expect(getChapterTags(bundle.cards)).toEqual([
      "async",
      "concurrency",
      "functions",
      "iteration",
      "memory",
      "syntax",
    ])
  })

  it("filters by difficulty, multi-tag, mostAsked, status, and sort mode", () => {
    const ordered = getOrderedCards(bundle)
    const statusMap: Record<string, CardStatus> = {
      "test.alpha.basics": "known",
      "test.beta.first": "revisit",
    }

    expect(
      filterCards(ordered, { status: "untouched" }, statusMap).map((c) => c.id)
    ).toEqual(["test.alpha.second", "test.beta.zebra"])

    expect(
      filterCards(ordered, { status: "known" }, statusMap).map((c) => c.id)
    ).toEqual(["test.alpha.basics"])

    expect(
      filterCards(ordered, { status: "all", mostAsked: true }, statusMap).map(
        (c) => c.id
      )
    ).toEqual(["test.alpha.basics", "test.beta.zebra"])

    expect(
      filterCards(ordered, { tag: " async , iteration " }, statusMap).map(
        (c) => c.id
      )
    ).toEqual(["test.beta.first", "test.beta.zebra"])

    expect(
      filterCards(ordered, { sort: "difficulty" }, statusMap).map(
        (c) => c.difficulty
      )
    ).toEqual(["easy", "medium", "medium", "hard"])

    expect(
      filterCards(ordered, { sort: "alpha" }, statusMap).map((c) => c.id)
    ).toEqual([
      "test.alpha.second",
      "test.alpha.basics",
      "test.beta.first",
      "test.beta.zebra",
    ])
  })
})
