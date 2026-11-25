export type CardType =
  "question" | "concept" | "predict" | "compare" | "pitfall" | "problem"

export type Difficulty = "easy" | "medium" | "hard"

export type DirectiveVariant = "tip" | "pitfall" | "insight" | "complexity"

export interface ChapterMeta {
  slug: string
  dirName: string
  order: number
  title: string
  emoji: string
  description: string
  cardCount: number
}

export interface HandbookMeta {
  id: string
  name: string
  tagline: string
  icon: string
  accent: string
  accent2: string
  version: number
  chapterCount: number
  cardCount: number
  chapters: ChapterMeta[]
}

export interface CompareRow {
  cells: string[]
}

export interface Card {
  id: string
  handbook: string
  chapter: string
  order: number
  type: CardType
  title: string
  difficulty: Difficulty
  tags: string[]
  mostAsked: boolean
  readTime: number
  related: string[]
  revision: string[]
  sections: Record<string, string>
  meta: Record<string, unknown>
  searchText: string
}

export interface HandbookBundle {
  handbook: HandbookMeta
  cards: Card[]
}

export interface SearchEntry {
  id: string
  title: string
  tags: string[]
  searchText: string
  chapter: string
  chapterTitle: string
  type: CardType
  difficulty: Difficulty
  mostAsked: boolean
}

export interface ContentWarning {
  filePath: string
  field: string
  message: string
}

export interface LoadedHandbookData {
  handbooks: HandbookMeta[]
  bundles: Record<string, HandbookBundle>
  search: Record<string, SearchEntry[]>
  warnings: ContentWarning[]
}
