import type { CardFilterSearch } from "./search-params.ts"
import type {
  Card,
  CardStatus,
  Difficulty,
  HandbookBundle,
  RelatedCardInfo,
} from "./types.ts"

export interface ProgressCounts {
  total: number
  known: number
  revisit: number
  untouched: number
  percent: number
}

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
}

export function getCardsForChapter(
  bundle: HandbookBundle,
  chapterSlug: string
): Card[] {
  return bundle.cards
    .filter((card) => card.chapter === chapterSlug)
    .sort((a, b) => a.order - b.order)
}

export function getOrderedCards(bundle: HandbookBundle): Card[] {
  const chapterOrder = new Map(
    bundle.handbook.chapters.map((ch, idx) => [ch.slug, idx])
  )
  return [...bundle.cards].sort((a, b) => {
    const ca = chapterOrder.get(a.chapter) ?? Number.MAX_SAFE_INTEGER
    const cb = chapterOrder.get(b.chapter) ?? Number.MAX_SAFE_INTEGER
    if (ca !== cb) return ca - cb
    return a.order - b.order
  })
}

export function getProgressCounts(
  cards: Card[],
  statusMap: Record<string, CardStatus>
): ProgressCounts {
  let known = 0
  let revisit = 0
  for (const card of cards) {
    const s = statusMap[card.id]
    if (s === "known") known += 1
    else if (s === "revisit") revisit += 1
  }
  const total = cards.length
  const untouched = Math.max(0, total - known - revisit)
  const percent = total > 0 ? Math.round((known / total) * 100) : 0
  return { total, known, revisit, untouched, percent }
}

export function getRelatedCardsInfo(
  card: Card,
  allCards: Card[]
): RelatedCardInfo[] {
  const byId = new Map(allCards.map((c) => [c.id, c]))
  return card.related.map((id) => ({
    id,
    title: byId.get(id)?.title ?? id.split(".").pop()?.replace(/-/g, " ") ?? id,
  }))
}

export function getAdjacentCards(
  bundle: HandbookBundle,
  cardId: string
): { prev: Card | null; next: Card | null; index: number; total: number } {
  const ordered = getOrderedCards(bundle)
  const idx = ordered.findIndex((c) => c.id === cardId)
  if (idx === -1) {
    return { prev: null, next: null, index: -1, total: ordered.length }
  }
  return {
    prev: idx > 0 ? ordered[idx - 1] : null,
    next: idx < ordered.length - 1 ? ordered[idx + 1] : null,
    index: idx,
    total: ordered.length,
  }
}

export function getNextUnseenCard(
  bundle: HandbookBundle,
  currentCardId: string,
  statusMap: Record<string, CardStatus>
): Card | null {
  const ordered = getOrderedCards(bundle)
  if (ordered.length <= 1) return null
  const startIdx = ordered.findIndex((c) => c.id === currentCardId)
  const baseIdx = startIdx === -1 ? 0 : startIdx

  for (let offset = 1; offset < ordered.length; offset++) {
    const candidate = ordered[(baseIdx + offset) % ordered.length]
    if (statusMap[candidate.id] !== "known") {
      return candidate
    }
  }
  return null
}

export function getChapterTags(cards: Card[]): string[] {
  const unique = new Set<string>()
  for (const card of cards) {
    for (const tag of card.tags) {
      unique.add(tag)
    }
  }
  return Array.from(unique).sort((a, b) => a.localeCompare(b))
}

export function filterCards(
  cards: Card[],
  filters: CardFilterSearch,
  statusMap: Record<string, CardStatus>
): Card[] {
  const selectedTags = filters.tag
    ? filters.tag
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : []

  const filtered = cards.filter((card) => {
    if (filters.difficulty && card.difficulty !== filters.difficulty) {
      return false
    }
    if (filters.type && filters.type !== "all" && card.type !== filters.type) {
      return false
    }
    if (
      selectedTags.length > 0 &&
      !selectedTags.some((tag) => card.tags.includes(tag))
    ) {
      return false
    }
    if (filters.mostAsked && !card.mostAsked) {
      return false
    }
    if (filters.status && filters.status !== "all") {
      const cardStatus = statusMap[card.id]
      if (filters.status === "untouched" && cardStatus !== undefined) {
        return false
      }
      if (filters.status === "known" && cardStatus !== "known") {
        return false
      }
      if (filters.status === "revisit" && cardStatus !== "revisit") {
        return false
      }
    }
    return true
  })

  if (filters.sort === "difficulty") {
    return [...filtered].sort(
      (a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty]
    )
  }
  if (filters.sort === "alpha") {
    return [...filtered].sort((a, b) => a.title.localeCompare(b.title))
  }
  return filtered
}
