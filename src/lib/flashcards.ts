import type { CardFilterSearch } from "./search-params.ts"
import { filterCards, getOrderedCards } from "./selectors.ts"
import type { Card, CardStatus, HandbookBundle } from "./types.ts"

export interface FlashcardSessionState {
  queue: string[]
  initialTotal: number
  cursor: number
  flipped: boolean
  reviewedCount: number
  gotItIds: string[]
  againIds: string[]
  skippedIds: string[]
  complete: boolean
}

export function buildFlashcardDeck(
  bundle: HandbookBundle,
  filters: CardFilterSearch,
  statusMap: Record<string, CardStatus>,
  includeKnown = false
): Card[] {
  const ordered = getOrderedCards(bundle).filter(
    (card) => card.type === "question" || card.type === "predict"
  )
  const filtered = filterCards(ordered, filters, statusMap)
  if (includeKnown || filters.status === "known") {
    return filtered
  }
  return filtered.filter((card) => statusMap[card.id] !== "known")
}

export function createFlashcardSession(cards: Card[]): FlashcardSessionState {
  return {
    queue: cards.map((c) => c.id),
    initialTotal: cards.length,
    cursor: 0,
    flipped: false,
    reviewedCount: 0,
    gotItIds: [],
    againIds: [],
    skippedIds: [],
    complete: false,
  }
}

export function flipFlashcard(
  session: FlashcardSessionState,
  nextFlipped?: boolean
): FlashcardSessionState {
  if (session.complete || session.queue.length === 0) return session
  return {
    ...session,
    flipped: nextFlipped ?? !session.flipped,
  }
}

export function moveFlashcardCursor(
  session: FlashcardSessionState,
  delta: -1 | 1
): FlashcardSessionState {
  if (session.complete || session.queue.length === 0) return session
  const nextCursor = Math.max(
    0,
    Math.min(session.queue.length - 1, session.cursor + delta)
  )
  if (nextCursor === session.cursor && !session.flipped) return session
  return {
    ...session,
    cursor: nextCursor,
    flipped: false,
  }
}

export function applyGotIt(session: FlashcardSessionState): {
  session: FlashcardSessionState
  cardId: string | null
} {
  if (session.complete || session.cursor >= session.queue.length) {
    return { session, cardId: null }
  }
  const cardId = session.queue[session.cursor]
  const nextCursor = session.cursor + 1
  const complete = nextCursor >= session.queue.length

  return {
    cardId,
    session: {
      ...session,
      cursor: nextCursor,
      flipped: false,
      reviewedCount: session.reviewedCount + 1,
      gotItIds: session.gotItIds.includes(cardId)
        ? session.gotItIds
        : [...session.gotItIds, cardId],
      againIds: session.againIds.filter((id) => id !== cardId),
      skippedIds: session.skippedIds.filter((id) => id !== cardId),
      complete,
    },
  }
}

export function applyAgain(
  session: FlashcardSessionState,
  delay = 3
): {
  session: FlashcardSessionState
  cardId: string | null
} {
  if (session.complete || session.cursor >= session.queue.length) {
    return { session, cardId: null }
  }
  const cardId = session.queue[session.cursor]
  const remaining = session.queue.slice(session.cursor + 1)
  const nextQueue = [...session.queue]

  if (!remaining.includes(cardId)) {
    const insertAt = Math.min(nextQueue.length, session.cursor + 1 + delay)
    nextQueue.splice(insertAt, 0, cardId)
  }

  const nextCursor = session.cursor + 1
  const complete = nextCursor >= nextQueue.length

  return {
    cardId,
    session: {
      ...session,
      queue: nextQueue,
      cursor: nextCursor,
      flipped: false,
      reviewedCount: session.reviewedCount + 1,
      againIds: session.againIds.includes(cardId)
        ? session.againIds
        : [...session.againIds, cardId],
      gotItIds: session.gotItIds.filter((id) => id !== cardId),
      skippedIds: session.skippedIds.filter((id) => id !== cardId),
      complete,
    },
  }
}

export function applySkip(session: FlashcardSessionState): {
  session: FlashcardSessionState
  cardId: string | null
} {
  if (session.complete || session.cursor >= session.queue.length) {
    return { session, cardId: null }
  }
  const cardId = session.queue[session.cursor]
  const nextCursor = session.cursor + 1
  const complete = nextCursor >= session.queue.length

  return {
    cardId,
    session: {
      ...session,
      cursor: nextCursor,
      flipped: false,
      reviewedCount: session.reviewedCount + 1,
      skippedIds: session.skippedIds.includes(cardId)
        ? session.skippedIds
        : [...session.skippedIds, cardId],
      complete,
    },
  }
}

export function getSessionProgressPercent(
  session: FlashcardSessionState
): number {
  if (session.queue.length === 0) return 0
  if (session.complete) return 100
  return Math.round((session.cursor / session.queue.length) * 100)
}
