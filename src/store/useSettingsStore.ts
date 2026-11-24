import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type ThemeSetting = "dark" | "light" | "system"
export type FontScaleSetting = 0.9 | 1 | 1.1 | 1.2

export interface SettingsState {
  theme: ThemeSetting
  fontScale: FontScaleSetting
  reducedMotion: boolean | null
  collapsedChapters: Record<string, boolean>
  setTheme: (theme: ThemeSetting) => void
  toggleTheme: () => void
  setFontScale: (fontScale: FontScaleSetting) => void
  setReducedMotion: (reducedMotion: boolean | null) => void
  setChapterCollapsed: (chapterKey: string, collapsed: boolean) => void
  resetSettings: () => void
}

const DEFAULT_SETTINGS = {
  theme: "dark" as ThemeSetting,
  fontScale: 1 as FontScaleSetting,
  reducedMotion: null as boolean | null,
  collapsedChapters: {} as Record<string, boolean>,
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
      resetSettings: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: "ihb:settings:v1",
      version: 1,
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

        return {
          theme,
          fontScale,
          reducedMotion,
          collapsedChapters,
        }
      },
    }
  )
)
