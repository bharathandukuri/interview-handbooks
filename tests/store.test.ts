import { beforeEach, describe, expect, it } from "vitest"

interface MockStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
}

const BackingMap = new Map<string, string>()

const mockLocalStorage: MockStorage = {
  getItem: (key) => BackingMap.get(key) ?? null,
  setItem: (key, value) => {
    BackingMap.set(key, value)
  },
  removeItem: (key) => {
    BackingMap.delete(key)
  },
  clear: () => {
    BackingMap.clear()
  },
}

Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
  configurable: true,
  writable: true,
})

const { parseProgressBackup, useProgressStore } =
  await import("../src/store/useProgressStore.ts")
const {
  clampSidebarWidth,
  DEFAULT_SIDEBAR_WIDTH,
  resolveTheme,
  useSettingsStore,
} = await import("../src/store/useSettingsStore.ts")

describe("useProgressStore", () => {
  beforeEach(() => {
    BackingMap.clear()
    useProgressStore.getState().reset()
  })

  it("persists status, bookmarks, and lastVisited under ihb:v1 without persisting revealed", () => {
    const store = useProgressStore.getState()
    store.setStatus("python.basics.mutability", "known")
    store.setStatus("python.basics.is-vs-equals", "revisit")
    store.toggleBookmark("python.basics.mutability")
    store.setLastVisited("python", "python.basics.mutability")
    store.setRevealed("python.basics.mutability", true)

    expect(useProgressStore.getState().revealed).toEqual({
      "python.basics.mutability": true,
    })

    const raw = BackingMap.get("ihb:v1")
    expect(raw).toBeDefined()
    const persisted = JSON.parse(raw!) as {
      state: Record<string, unknown>
      version: number
    }
    expect(persisted.version).toBe(1)
    expect(persisted.state).toEqual({
      status: {
        "python.basics.mutability": "known",
        "python.basics.is-vs-equals": "revisit",
      },
      bookmarks: ["python.basics.mutability"],
      lastVisited: { python: "python.basics.mutability" },
    })
    expect(persisted.state.revealed).toBeUndefined()

    store.setStatus("python.basics.mutability", undefined)
    store.toggleBookmark("python.basics.mutability")
    expect(useProgressStore.getState().status).toEqual({
      "python.basics.is-vs-equals": "revisit",
    })
    expect(useProgressStore.getState().bookmarks).toEqual([])
  })

  it("exports and imports JSON with Zod validation and rejects malformed backups", () => {
    const store = useProgressStore.getState()
    store.setStatus("python.basics.a", "known")
    store.toggleBookmark("python.basics.a")
    store.setLastVisited("python", "python.basics.a")

    const snapshot = store.exportJSON()
    const parsedPreview = parseProgressBackup(snapshot)
    expect(parsedPreview.ok).toBe(true)

    store.reset()
    expect(useProgressStore.getState().status).toEqual({})

    const importOk = useProgressStore.getState().importJSON(snapshot)
    expect(importOk).toEqual({ ok: true })
    expect(useProgressStore.getState().status).toEqual({
      "python.basics.a": "known",
    })
    expect(useProgressStore.getState().bookmarks).toEqual(["python.basics.a"])
    expect(useProgressStore.getState().lastVisited).toEqual({
      python: "python.basics.a",
    })

    const badJson = useProgressStore.getState().importJSON("{not-json")
    expect(badJson.ok).toBe(false)

    const wrongVersion = useProgressStore.getState().importJSON(
      JSON.stringify({
        version: 2,
        status: {},
        bookmarks: [],
        lastVisited: {},
      })
    )
    expect(wrongVersion.ok).toBe(false)

    const badStatus = useProgressStore.getState().importJSON(
      JSON.stringify({
        version: 1,
        status: { "python.basics.a": "archived" },
        bookmarks: [],
        lastVisited: {},
      })
    )
    expect(badStatus.ok).toBe(false)

    expect(useProgressStore.getState().status).toEqual({
      "python.basics.a": "known",
    })
  })

  it("rehydrates and sanitizes corrupted persisted storage via migrate", async () => {
    BackingMap.set(
      "ihb:v1",
      JSON.stringify({
        version: 0,
        state: {
          status: {
            "python.basics.a": "known",
            "python.basics.bad": "invalid",
          },
          bookmarks: ["python.basics.a", 123, "python.basics.a"],
          lastVisited: { python: "python.basics.a", invalid: 42 },
        },
      })
    )

    await useProgressStore.persist.rehydrate()
    const hydrated = useProgressStore.getState()
    expect(hydrated.status).toEqual({ "python.basics.a": "known" })
    expect(hydrated.bookmarks).toEqual(["python.basics.a"])
    expect(hydrated.lastVisited).toEqual({ python: "python.basics.a" })
  })
})

describe("useSettingsStore", () => {
  beforeEach(() => {
    BackingMap.clear()
    useSettingsStore.getState().resetSettings()
  })

  it("persists theme, fontScale, collapsedChapters, and clamped sidebarWidth under ihb:settings:v1", () => {
    expect(clampSidebarWidth(100)).toBe(220)
    expect(clampSidebarWidth(900)).toBe(420)
    expect(clampSidebarWidth(305.6)).toBe(306)

    const settings = useSettingsStore.getState()
    settings.toggleTheme()
    expect(useSettingsStore.getState().theme).toBe("light")

    settings.setFontScale(1.1)
    settings.setSidebarWidth(500)
    settings.setChapterCollapsed("python:basics", true)

    expect(useSettingsStore.getState().sidebarWidth).toBe(420)
    expect(resolveTheme("system")).toBe("dark")

    const raw = BackingMap.get("ihb:settings:v1")
    expect(raw).toBeDefined()
    const parsed = JSON.parse(raw!) as {
      state: { theme: string; fontScale: number; sidebarWidth: number }
      version: number
    }
    expect(parsed.version).toBe(2)
    expect(parsed.state.theme).toBe("light")
    expect(parsed.state.fontScale).toBe(1.1)
    expect(parsed.state.sidebarWidth).toBe(420)

    useSettingsStore.getState().resetSettings()
    expect(useSettingsStore.getState().theme).toBe("dark")
    expect(useSettingsStore.getState().sidebarWidth).toBe(DEFAULT_SIDEBAR_WIDTH)
  })

  it("sanitizes invalid persisted settings during migrate", async () => {
    BackingMap.set(
      "ihb:settings:v1",
      JSON.stringify({
        version: 1,
        state: {
          theme: "sepia",
          fontScale: 3,
          reducedMotion: "yes",
          sidebarWidth: 9999,
        },
      })
    )

    await useSettingsStore.persist.rehydrate()
    const state = useSettingsStore.getState()
    expect(state.theme).toBe("dark")
    expect(state.fontScale).toBe(1)
    expect(state.reducedMotion).toBeNull()
    expect(state.sidebarWidth).toBe(420)
  })
})
