import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { CardStatus } from "@/lib/types"

const exportedProgressSchema = z.object({
  version: z.literal(1),
  status: z.record(z.string(), z.enum(["known", "revisit"])),
  bookmarks: z.array(z.string()),
  lastVisited: z.record(z.string(), z.string()),
})

export interface ProgressState {
  status: Record<string, CardStatus>
  bookmarks: string[]
  lastVisited: Record<string, string>
  revealed: Record<string, boolean>
  setStatus: (cardId: string, status: CardStatus | undefined) => void
  toggleBookmark: (cardId: string) => void
  setLastVisited: (handbookId: string, cardId: string) => void
  setRevealed: (cardId: string, revealed: boolean) => void
  exportJSON: () => string
  importJSON: (raw: string) => { ok: true } | { ok: false; error: string }
  reset: () => void
}

const DEFAULT_PERSISTED = {
  status: {} as Record<string, CardStatus>,
  bookmarks: [] as string[],
  lastVisited: {} as Record<string, string>,
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PERSISTED,
      revealed: {},

      setStatus: (cardId, nextStatus) =>
        set((state) => {
          const next = { ...state.status }
          if (nextStatus === undefined) {
            delete next[cardId]
          } else {
            next[cardId] = nextStatus
          }
          return { status: next }
        }),

      toggleBookmark: (cardId) =>
        set((state) => {
          const exists = state.bookmarks.includes(cardId)
          return {
            bookmarks: exists
              ? state.bookmarks.filter((id) => id !== cardId)
              : [...state.bookmarks, cardId],
          }
        }),

      setLastVisited: (handbookId, cardId) =>
        set((state) => {
          if (state.lastVisited[handbookId] === cardId) return state
          return {
            lastVisited: {
              ...state.lastVisited,
              [handbookId]: cardId,
            },
          }
        }),

      setRevealed: (cardId, isRevealed) =>
        set((state) => ({
          revealed: {
            ...state.revealed,
            [cardId]: isRevealed,
          },
        })),

      exportJSON: () => {
        const { status, bookmarks, lastVisited } = get()
        return JSON.stringify(
          {
            version: 1,
            exportedAt: new Date().toISOString(),
            status,
            bookmarks,
            lastVisited,
          },
          null,
          2
        )
      },

      importJSON: (raw) => {
        try {
          const parsedJson: unknown = JSON.parse(raw)
          const validated = exportedProgressSchema.safeParse(parsedJson)
          if (!validated.success) {
            return {
              ok: false,
              error:
                validated.error.issues[0]?.message ?? "Invalid progress format",
            }
          }
          set({
            status: validated.data.status,
            bookmarks: Array.from(new Set(validated.data.bookmarks)),
            lastVisited: validated.data.lastVisited,
          })
          return { ok: true }
        } catch (err) {
          return {
            ok: false,
            error:
              err instanceof Error ? err.message : "Failed to parse JSON file",
          }
        }
      },

      reset: () =>
        set({
          ...DEFAULT_PERSISTED,
          revealed: {},
        }),
    }),
    {
      name: "ihb:v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        status: state.status,
        bookmarks: state.bookmarks,
        lastVisited: state.lastVisited,
      }),
      migrate: (persistedState) => {
        const raw = (persistedState ?? {}) as Partial<ProgressState>
        const status: Record<string, CardStatus> = {}
        if (raw.status && typeof raw.status === "object") {
          for (const [k, v] of Object.entries(raw.status)) {
            if (v === "known" || v === "revisit") status[k] = v
          }
        }
        const bookmarks = Array.isArray(raw.bookmarks)
          ? Array.from(
              new Set(
                raw.bookmarks.filter((x): x is string => typeof x === "string")
              )
            )
          : []
        const lastVisited: Record<string, string> = {}
        if (raw.lastVisited && typeof raw.lastVisited === "object") {
          for (const [k, v] of Object.entries(raw.lastVisited)) {
            if (typeof v === "string") lastVisited[k] = v
          }
        }
        return { status, bookmarks, lastVisited }
      },
    }
  )
)
