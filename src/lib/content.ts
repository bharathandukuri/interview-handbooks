import { handbookLoaders, searchLoaders } from "virtual:handbook-loaders"
import { handbooks } from "virtual:handbooks"
import type { HandbookBundle, HandbookMeta, SearchEntry } from "@/lib/types"

const bundleCache = new Map<string, HandbookBundle>()

if (import.meta.hot) {
  window.addEventListener("ihb:handbook-hmr", (event: Event) => {
    const customEvent = event as CustomEvent<{
      id: string
      bundle: HandbookBundle
    }>
    const detail = customEvent.detail
    if (detail?.id && detail.bundle) {
      bundleCache.set(detail.id, detail.bundle)
    }
  })
}

export function getHandbooksMeta(): HandbookMeta[] {
  return handbooks
}

export function getHandbookMeta(handbookId: string): HandbookMeta | undefined {
  return handbooks.find((h) => h.id === handbookId)
}

export async function loadHandbookBundle(
  handbookId: string
): Promise<HandbookBundle> {
  const cached = bundleCache.get(handbookId)
  if (cached) return cached

  const loader = handbookLoaders[handbookId]
  if (!loader) {
    throw new Error(`Handbook "${handbookId}" not found`)
  }
  const bundle = await loader()
  bundleCache.set(handbookId, bundle)
  return bundle
}

export async function loadHandbookSearch(
  handbookId: string
): Promise<SearchEntry[]> {
  const loader = searchLoaders[handbookId]
  if (!loader) {
    throw new Error(`Search index for handbook "${handbookId}" not found`)
  }
  const mod = await loader()
  return mod.entries
}
