import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type ThemeSetting = "dark" | "light" | "system"
export type FontScaleSetting = 0.9 | 1 | 1.1 | 1.2

export const DEFAULT_SIDEBAR_WIDTH = 280
export const MIN_SIDEBAR_WIDTH = 220
export const MAX_SIDEBAR_WIDTH = 420

export function clampSidebarWidth(width: number): number {
  return Math.max(
    MIN_SIDEBAR_WIDTH,
    Math.min(MAX_SIDEBAR_WIDTH, Math.round(width))
  )
}

export interface SettingsState {
  theme: ThemeSetting
  fontScale: FontScaleSetting
  reducedMotion: boolean | null
  collapsedChapters: Record<string, boolean>
  sidebarWidth: number
  setTheme: (theme: ThemeSetting) => void
  toggleTheme: () => void
  setFontScale: (fontScale: FontScaleSetting) => void
  setReducedMotion: (reducedMotion: boolean | null) => void
  setChapterCollapsed: (chapterKey: string, collapsed: boolean) => void
  setSidebarWidth: (width: number) => void
  resetSettings: () => void
}

const DEFAULT_SETTINGS = {
  theme: "dark" as ThemeSetting,
  fontScale: 1 as FontScaleSetting,
  reducedMotion: null as boolean | null,
  collapsedChapters: {} as Record<string, boolean>,
  sidebarWidth: DEFAULT_SIDEBAR_WIDTH,
}

export function resolveTheme(theme: ThemeSetting): "dark" | "light" {
  if (theme !== "system") return theme
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const current = resolveTheme(get().theme)
        set({ theme: current === "dark" ? "light" : "dark" })
      },
      setFontScale: (fontScale) => set({ fontScale }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setChapterCollapsed: (chapterKey, collapsed) =>
        set((state) => ({
          collapsedChapters: {
            ...state.collapsedChapters,
            [chapterKey]: collapsed,
          },
        })),
      setSidebarWidth: (width) =>
        set({ sidebarWidth: clampSidebarWidth(width) }),
      resetSettings: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: "ihb:settings:v1",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => {
        const state = (persistedState ?? {}) as Partial<SettingsState>
        const theme =
          state.theme === "dark" ||
          state.theme === "light" ||
          state.theme === "system"
            ? state.theme
            : "dark"
        const fontScale =
          state.fontScale === 0.9 ||
          state.fontScale === 1 ||
          state.fontScale === 1.1 ||
          state.fontScale === 1.2
            ? state.fontScale
            : 1
        const reducedMotion =
          typeof state.reducedMotion === "boolean" ? state.reducedMotion : null
        const collapsedChapters =
          state.collapsedChapters && typeof state.collapsedChapters === "object"
            ? state.collapsedChapters
            : {}
        const sidebarWidth =
          typeof state.sidebarWidth === "number" &&
          Number.isFinite(state.sidebarWidth)
            ? clampSidebarWidth(state.sidebarWidth)
            : DEFAULT_SIDEBAR_WIDTH

        return {
          theme,
          fontScale,
          reducedMotion,
          collapsedChapters,
          sidebarWidth,
        }
      },
    }
  )
)
