import Fuse, { type IFuseOptions } from "fuse.js"
import { stripInlineCode } from "./text.ts"
import type { SearchEntry } from "./types.ts"

export interface HighlightSegment {
  text: string
  highlighted: boolean
}

export type IndexedSearchEntry<T extends SearchEntry = SearchEntry> = T & {
  plainTitle: string
}

export interface SearchMatchResult<T extends SearchEntry = SearchEntry> {
  item: T
  score: number
  titleSegments: HighlightSegment[]
  chapterSegments: HighlightSegment[]
  matchedTags: Array<{ tag: string; segments: HighlightSegment[] }>
  bodySnippet: HighlightSegment[] | null
}

export const SEARCH_FUSE_OPTIONS: IFuseOptions<IndexedSearchEntry> = {
  keys: [
    { name: "plainTitle", weight: 0.5 },
    { name: "tags", weight: 0.2 },
    { name: "searchText", weight: 0.2 },
    { name: "chapterTitle", weight: 0.1 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  includeMatches: true,
  includeScore: true,
}

/**
 * Normalizes and merges overlapping or adjacent inclusive `[start, end]` intervals.
 */
export function mergeMatchIntervals(
  indices: ReadonlyArray<readonly [number, number]>,
  maxLength: number
): Array<[number, number]> {
  if (maxLength <= 0 || indices.length === 0) return []

  const clamped = indices
    .map(([start, end]): [number, number] => [
      Math.max(0, start),
      Math.min(maxLength - 1, end),
    ])
    .filter(([start, end]) => start <= end)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])

  if (clamped.length === 0) return []

  const merged: Array<[number, number]> = [[clamped[0][0], clamped[0][1]]]
  for (let i = 1; i < clamped.length; i++) {
    const [start, end] = clamped[i]
    const last = merged[merged.length - 1]
    if (start <= last[1] + 1) {
      last[1] = Math.max(last[1], end)
    } else {
      merged.push([start, end])
    }
  }
  return merged
}

/**
 * Splits `text` into highlighted and non-highlighted segments using inclusive Fuse match indices.
 */
export function getMatchRanges(
  text: string,
  indices?: ReadonlyArray<readonly [number, number]>
): HighlightSegment[] {
  if (!text) return []
  if (!indices || indices.length === 0) {
    return [{ text, highlighted: false }]
  }

  const merged = mergeMatchIntervals(indices, text.length)
  if (merged.length === 0) {
    return [{ text, highlighted: false }]
  }

  const segments: HighlightSegment[] = []
  let cursor = 0

  for (const [start, end] of merged) {
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), highlighted: false })
    }
    segments.push({ text: text.slice(start, end + 1), highlighted: true })
    cursor = end + 1
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), highlighted: false })
  }

  return segments
}

/**
 * Highlights all case-insensitive literal occurrences of `query` inside `text`.
 */
export function highlightSubstring(
  text: string,
  query: string
): HighlightSegment[] {
  const needle = query.trim().toLowerCase()
  if (!text || !needle) return text ? [{ text, highlighted: false }] : []

  const lower = text.toLowerCase()
  const ranges: Array<[number, number]> = []
  let from = 0

  while (from < lower.length) {
    const idx = lower.indexOf(needle, from)
    if (idx === -1) break
    ranges.push([idx, idx + needle.length - 1])
    from = idx + needle.length
  }

  return getMatchRanges(text, ranges)
}

/**
 * Builds a concise context snippet around the first body match with shifted highlight segments.
 */
export function getSearchSnippet(
  searchText: string,
  indices?: ReadonlyArray<readonly [number, number]>,
  maxLength = 96
): HighlightSegment[] | null {
  if (!searchText || !indices || indices.length === 0) return null

  const merged = mergeMatchIntervals(indices, searchText.length)
  if (merged.length === 0) return null

  const [firstStart, firstEnd] = merged[0]
  const halfWindow = Math.floor((maxLength - (firstEnd - firstStart + 1)) / 2)
  let sliceStart = Math.max(0, firstStart - Math.max(16, halfWindow))
  let sliceEnd = Math.min(searchText.length, sliceStart + maxLength)

  if (sliceEnd - sliceStart < maxLength && sliceStart > 0) {
    sliceStart = Math.max(0, sliceEnd - maxLength)
  }

  //Snap snippet start forward to a word boundary unless it cuts the match
  if (sliceStart > 0) {
    const spaceIdx = searchText.indexOf(" ", sliceStart)
    if (spaceIdx !== -1 && spaceIdx < firstStart) {
      sliceStart = spaceIdx + 1
    }
  }
  if (sliceEnd < searchText.length) {
    const spaceIdx = searchText.lastIndexOf(" ", sliceEnd)
    if (spaceIdx > firstEnd) {
      sliceEnd = spaceIdx
    }
  }

  const prefix = sliceStart > 0 ? "…" : ""
  const suffix = sliceEnd < searchText.length ? "…" : ""
  const excerpt = searchText.slice(sliceStart, sliceEnd)

  const shiftedIndices: Array<[number, number]> = merged
    .map(([start, end]): [number, number] => [
      start - sliceStart,
      end - sliceStart,
    ])
    .filter(([start, end]) => end >= 0 && start < excerpt.length)

  const segments = getMatchRanges(excerpt, shiftedIndices)
  if (prefix) {
    segments.unshift({ text: prefix, highlighted: false })
  }
  if (suffix) {
    segments.push({ text: suffix, highlighted: false })
  }
  return segments
}

export function createSearchIndex<T extends SearchEntry>(
  entries: T[]
): {
  fuse: Fuse<IndexedSearchEntry<T>>
  indexed: IndexedSearchEntry<T>[]
} {
  const indexed = entries.map((entry) => ({
    ...entry,
    plainTitle: stripInlineCode(entry.title),
  }))
  const fuse = new Fuse<IndexedSearchEntry<T>>(
    indexed,
    SEARCH_FUSE_OPTIONS as IFuseOptions<IndexedSearchEntry<T>>
  )
  return { fuse, indexed }
}

export function searchEntries<T extends SearchEntry>(
  fuse: Fuse<IndexedSearchEntry<T>>,
  entries: T[],
  query: string,
  limit = 12
): SearchMatchResult<T>[] {
  const trimmed = query.trim()
  if (!trimmed) {
    return entries.slice(0, Math.min(8, limit)).map((item) => ({
      item,
      score: 0,
      titleSegments: [
        { text: stripInlineCode(item.title), highlighted: false },
      ],
      chapterSegments: [{ text: item.chapterTitle, highlighted: false }],
      matchedTags: [],
      bodySnippet: null,
    }))
  }

  return fuse.search(trimmed, { limit }).map((result) => {
    const matches = result.matches ?? []
    const titleMatch = matches.find((m) => m.key === "plainTitle")
    const chapterMatch = matches.find((m) => m.key === "chapterTitle")
    const bodyMatch = matches.find((m) => m.key === "searchText")
    const tagMatches = matches.filter(
      (m) => m.key === "tags" && typeof m.refIndex === "number"
    )

    const plainTitle = result.item.plainTitle
    const titleSegments = getMatchRanges(plainTitle, titleMatch?.indices)
    const chapterSegments = getMatchRanges(
      result.item.chapterTitle,
      chapterMatch?.indices
    )
    const matchedTags = tagMatches
      .map((m) => {
        const tag = result.item.tags[m.refIndex!]
        if (!tag) return null
        return { tag, segments: getMatchRanges(tag, m.indices) }
      })
      .filter(
        (t): t is { tag: string; segments: HighlightSegment[] } => t !== null
      )

    const bodySnippet =
      bodyMatch && !titleMatch
        ? getSearchSnippet(result.item.searchText, bodyMatch.indices)
        : null

    return {
      item: result.item,
      score: result.score ?? 0,
      titleSegments,
      chapterSegments,
      matchedTags,
      bodySnippet,
    }
  })
}

export function searchChapters<
  T extends { title: string; description: string },
>(
  chapters: T[],
  query: string
): Array<{ chapter: T; titleSegments: HighlightSegment[] }> {
  const trimmed = query.trim()
  if (!trimmed) {
    return chapters.map((chapter) => ({
      chapter,
      titleSegments: [{ text: chapter.title, highlighted: false }],
    }))
  }

  const lower = trimmed.toLowerCase()
  return chapters
    .filter(
      (ch) =>
        ch.title.toLowerCase().includes(lower) ||
        ch.description.toLowerCase().includes(lower)
    )
    .map((chapter) => ({
      chapter,
      titleSegments: highlightSubstring(chapter.title, trimmed),
    }))
}
