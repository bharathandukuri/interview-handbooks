import { describe, expect, it } from "vitest"
import {
  applyAgain,
  applyGotIt,
  applySkip,
  buildFlashcardDeck,
  createFlashcardSession,
  flipFlashcard,
  getSessionProgressPercent,
  moveFlashcardCursor,
} from "../src/lib/flashcards.ts"
import type { Card, CardStatus, HandbookBundle } from "../src/lib/types.ts"

function makeCard(
  overrides: Partial<Card> & Pick<Card, "id" | "type" | "order" | "title">
): Card {
  return {
    handbook: "python",
    chapter: "basics",
    difficulty: "easy",
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
    id: "python",
    name: "Python",
    tagline: "Test",
    icon: "python",
    accent: "#4a90e2",
    accent2: "#ffd43b",
    version: 1,
    chapterCount: 1,
    cardCount: 5,
    chapters: [
      {
        slug: "basics",
        dirName: "01-basics",
        order: 1,
        title: "Basics",
        emoji: "🧱",
        description: "Basics",
        cardCount: 5,
      },
    ],
  },
  cards: [
    makeCard({
      id: "c1",
      type: "question",
      order: 1,
      title: "Q1",
      mostAsked: true,
    }),
    makeCard({ id: "c2", type: "concept", order: 2, title: "Concept" }),
    makeCard({ id: "c3", type: "predict", order: 3, title: "P1" }),
    makeCard({ id: "c4", type: "pitfall", order: 4, title: "Pitfall" }),
    makeCard({
      id: "c5",
      type: "question",
      order: 5,
      title: "Q2",
      difficulty: "hard",
    }),
  ],
}

describe("flashcards deck and session state machine", () => {
  it("builds due deck from question + predict cards excluding known cards by default", () => {
    const statusMap: Record<string, CardStatus> = { c1: "known", c3: "revisit" }

    expect(
      buildFlashcardDeck(bundle, {}, statusMap, false).map((c) => c.id)
    ).toEqual(["c3", "c5"])

    expect(
      buildFlashcardDeck(bundle, {}, statusMap, true).map((c) => c.id)
    ).toEqual(["c1", "c3", "c5"])

    expect(
      buildFlashcardDeck(bundle, { status: "known" }, statusMap, false).map(
        (c) => c.id
      )
    ).toEqual(["c1"])

    expect(
      buildFlashcardDeck(bundle, { difficulty: "hard" }, {}, false).map(
        (c) => c.id
      )
    ).toEqual(["c5"])
  })

  it("handles flip, Again re-queue, Got it resolution, Skip, and arrow navigation", () => {
    const deck = buildFlashcardDeck(bundle, {}, {}, true)
    let session = createFlashcardSession(deck)
    expect(session.queue).toEqual(["c1", "c3", "c5"])
    expect(getSessionProgressPercent(session)).toBe(0)

    // Space -> Flip -> Again (1) re-queues c1 after remaining cards
    session = flipFlashcard(session)
    expect(session.flipped).toBe(true)

    const againRes = applyAgain(session, 3)
    session = againRes.session
    expect(againRes.cardId).toBe("c1")
    expect(session.queue).toEqual(["c1", "c3", "c5", "c1"])
    expect(session.cursor).toBe(1)
    expect(session.flipped).toBe(false)
    expect(session.againIds).toEqual(["c1"])

    // Arrow navigation backward/forward resets flipped state
    session = flipFlashcard(session)
    session = moveFlashcardCursor(session, -1)
    expect(session.cursor).toBe(0)
    expect(session.flipped).toBe(false)
    session = moveFlashcardCursor(session, 1)
    expect(session.cursor).toBe(1)

    // Skip c3
    const skipRes = applySkip(session)
    session = skipRes.session
    expect(skipRes.cardId).toBe("c3")
    expect(session.cursor).toBe(2)
    expect(session.skippedIds).toEqual(["c3"])

    // Got it on c5 -> moves to re-queued c1
    const got1 = applyGotIt(session)
    session = got1.session
    expect(got1.cardId).toBe("c5")
    expect(session.cursor).toBe(3)
    expect(session.complete).toBe(false)

    // Got it on re-queued c1 -> removes c1 from againIds and finishes session
    const got2 = applyGotIt(session)
    session = got2.session
    expect(got2.cardId).toBe("c1")
    expect(session.complete).toBe(true)
    expect(session.gotItIds).toEqual(["c5", "c1"])
    expect(session.againIds).toEqual([])
    expect(session.skippedIds).toEqual(["c3"])
    expect(getSessionProgressPercent(session)).toBe(100)
  })
})
