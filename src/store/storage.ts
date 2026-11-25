import type { StateStorage } from "zustand/middleware"

interface StorageLike {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

function getGlobalStorage(): StorageLike | null {
  try {
    const candidate = (globalThis as { localStorage?: StorageLike })
      .localStorage
    if (
      candidate &&
      typeof candidate.getItem === "function" &&
      typeof candidate.setItem === "function" &&
      typeof candidate.removeItem === "function"
    ) {
      return candidate
    }
  } catch {
    return null
  }
  return null
}

/**
 * Dynamically delegates to `globalThis.localStorage` when available and falls back
 * to a no-op storage in non-DOM environments (Node / Vitest without DOM or SSR).
 */
export function createSafeStorage(): StateStorage {
  return {
    getItem: (name) => getGlobalStorage()?.getItem(name) ?? null,
    setItem: (name, value) => {
      getGlobalStorage()?.setItem(name, value)
    },
    removeItem: (name) => {
      getGlobalStorage()?.removeItem(name)
    },
  }
}
