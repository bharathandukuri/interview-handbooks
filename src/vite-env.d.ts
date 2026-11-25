/// <reference types="vite/client" />

declare const __SINGLE_HANDBOOK__: string

declare module "virtual:handbooks" {
  import type { HandbookMeta } from "@/lib/types"
  export const handbooks: HandbookMeta[]
  export default handbooks
}

declare module "virtual:handbook/*" {
  import type { Card, HandbookMeta } from "@/lib/types"
  export const handbook: HandbookMeta
  export const cards: Card[]
  const bundle: { handbook: HandbookMeta; cards: Card[] }
  export default bundle
}

declare module "virtual:search/*" {
  import type { SearchEntry } from "@/lib/types"
  export const entries: SearchEntry[]
  export default entries
}

declare module "virtual:handbook-loaders" {
  import type { HandbookBundle, SearchEntry } from "@/lib/types"
  export const handbookLoaders: Record<string, () => Promise<HandbookBundle>>
  export const searchLoaders: Record<
    string,
    () => Promise<{ entries: SearchEntry[] }>
  >
}
