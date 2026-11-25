import { useEffect, useMemo, useState } from "react"
import { useFormatForDisplay } from "@tanstack/react-hotkeys"
import { useNavigate, useParams } from "@tanstack/react-router"
import Fuse from "fuse.js"
import {
  AlertTriangle,
  BarChart3,
  Bookmark,
  BookOpen,
  Code2,
  Columns2,
  Eye,
  HelpCircle,
  Home,
  Layers,
  Lightbulb,
  Palette,
  SunMoon,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { getHandbooksMeta, loadHandbookSearch } from "@/lib/content"
import { appHotkeys } from "@/lib/keyboard"
import { stripInlineCode } from "@/lib/text"
import type { CardType, SearchEntry } from "@/lib/types"
import { useSettingsStore } from "@/store/useSettingsStore"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SearchEntryWithHandbook = SearchEntry & {
  handbookId: string
  handbookName: string
}

const CARD_TYPE_ICONS: Record<CardType, typeof HelpCircle> = {
  question: HelpCircle,
  concept: Lightbulb,
  predict: Eye,
  compare: Columns2,
  pitfall: AlertTriangle,
  problem: Code2,
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [entries, setEntries] = useState<SearchEntryWithHandbook[]>([])
  const [loaded, setLoaded] = useState(false)
  const navigate = useNavigate()
  const params = useParams({ strict: false }) as { hb?: string }
  const toggleTheme = useSettingsStore((s) => s.toggleTheme)
  const formatForDisplay = useFormatForDisplay()
  const handbooks = useMemo(() => getHandbooksMeta(), [])
  const activeHbId = params.hb ?? handbooks[0]?.id

  useEffect(() => {
    if (!open || loaded) return
    let cancelled = false

    Promise.all(
      handbooks.map(async (hb) => {
        const list = await loadHandbookSearch(hb.id)
        return list.map((entry) => ({
          ...entry,
          handbookId: hb.id,
          handbookName: hb.name,
        }))
      })
    )
      .then((groups) => {
        if (!cancelled) {
          setEntries(groups.flat())
          setLoaded(true)
        }
      })
      .catch((err) => {
        console.error("Failed to load search index:", err)
      })

    return () => {
      cancelled = true
    }
  }, [open, loaded, handbooks])

  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        keys: [
          { name: "title", weight: 0.5 },
          { name: "tags", weight: 0.2 },
          { name: "searchText", weight: 0.2 },
          { name: "chapterTitle", weight: 0.1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [entries]
  )

  const trimmed = query.trim()
  const matchedCards = useMemo(() => {
    if (!trimmed) return entries.slice(0, 8)
    return fuse
      .search(trimmed)
      .slice(0, 12)
      .map((r) => r.item)
  }, [trimmed, entries, fuse])

  const matchedChapters = useMemo(() => {
    const allChapters = handbooks.flatMap((hb) =>
      hb.chapters.map((ch) => ({
        handbookId: hb.id,
        handbookName: hb.name,
        ...ch,
      }))
    )
    if (!trimmed) return allChapters
    const lower = trimmed.toLowerCase()
    return allChapters.filter(
      (ch) =>
        ch.title.toLowerCase().includes(lower) ||
        ch.description.toLowerCase().includes(lower)
    )
  }, [handbooks, trimmed])

  const actions = useMemo(() => {
    const hbActions = activeHbId
      ? [
          {
            id: "go-home",
            label: "Go to handbook home",
            shortcut: formatForDisplay(["G", "H"]),
            icon: Home,
            run: () =>
              void navigate({ to: "/$hb", params: { hb: activeHbId } }),
          },
          {
            id: "go-flashcards",
            label: "Open flashcards",
            shortcut: undefined,
            icon: Layers,
            run: () =>
              void navigate({
                to: "/$hb/flashcards",
                params: { hb: activeHbId },
              }),
          },
          {
            id: "go-revision",
            label: "Open quick revision",
            shortcut: undefined,
            icon: Zap,
            run: () =>
              void navigate({
                to: "/$hb/revision",
                params: { hb: activeHbId },
              }),
          },
          {
            id: "go-progress",
            label: "View progress",
            shortcut: undefined,
            icon: BarChart3,
            run: () =>
              void navigate({
                to: "/$hb/progress",
                params: { hb: activeHbId },
              }),
          },
          {
            id: "go-bookmarks",
            label: "Open bookmarks",
            shortcut: undefined,
            icon: Bookmark,
            run: () =>
              void navigate({
                to: "/$hb/bookmarks",
                params: { hb: activeHbId },
              }),
          },
        ]
      : [
          {
            id: "go-home",
            label: "Go to home",
            shortcut: formatForDisplay(["G", "H"]),
            icon: Home,
            run: () => void navigate({ to: "/" }),
          },
        ]

    const list = [
      {
        id: "toggle-theme",
        label: "Toggle color theme",
        shortcut: formatForDisplay(appHotkeys["theme.toggle"].hotkey ?? "D"),
        icon: SunMoon,
        run: () => toggleTheme(),
      },
      ...hbActions,
      ...(import.meta.env.DEV
        ? [
            {
              id: "open-kit",
              label: "Open design system kit (/kit)",
              shortcut: undefined,
              icon: Palette,
              run: () => void navigate({ to: "/_kit" }),
            },
          ]
        : []),
    ]
    if (!trimmed) return list
    const lower = trimmed.toLowerCase()
    return list.filter((a) => a.label.toLowerCase().includes(lower))
  }, [activeHbId, formatForDisplay, navigate, toggleTheme, trimmed])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setQuery("")
    onOpenChange(nextOpen)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Command Palette"
      description="Search cards, chapters, and quick actions"
    >
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search cards, tags, chapters, or actions..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {loaded
              ? "No matching cards, chapters, or actions."
              : "Loading index..."}
          </CommandEmpty>

          {matchedCards.length > 0 && (
            <CommandGroup heading="Cards">
              {matchedCards.map((card) => {
                const Icon = CARD_TYPE_ICONS[card.type]
                return (
                  <CommandItem
                    key={card.id}
                    value={card.id}
                    onSelect={() => {
                      handleOpenChange(false)
                      void navigate({
                        to: "/$hb/t/$cardId",
                        params: { hb: card.handbookId, cardId: card.id },
                      })
                    }}
                  >
                    <Icon className="size-4 text-brand" aria-hidden="true" />
                    <span className="flex-1 truncate">
                      {stripInlineCode(card.title)}
                    </span>
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      {card.chapterTitle}
                    </span>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {card.difficulty}
                    </Badge>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )}

          {matchedChapters.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Chapters">
                {matchedChapters.map((ch) => (
                  <CommandItem
                    key={`${ch.handbookId}.${ch.slug}`}
                    value={`${ch.handbookId}.${ch.slug}`}
                    onSelect={() => {
                      handleOpenChange(false)
                      void navigate({
                        to: "/$hb/c/$chapter",
                        params: { hb: ch.handbookId, chapter: ch.slug },
                      })
                    }}
                  >
                    <BookOpen
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="flex-1 truncate">
                      {ch.emoji} {ch.title}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {ch.cardCount} cards
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {actions.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Actions">
                {actions.map((action) => {
                  const Icon = action.icon
                  return (
                    <CommandItem
                      key={action.id}
                      value={action.id}
                      onSelect={() => {
                        handleOpenChange(false)
                        action.run()
                      }}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      <span className="flex-1">{action.label}</span>
                      {action.shortcut && (
                        <CommandShortcut>{action.shortcut}</CommandShortcut>
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </>
          )}
        </CommandList>
        <div className="flex items-center justify-between border-t border-border bg-surface-2/60 px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span>Navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Kbd>↵</Kbd>
              <span>Open</span>
            </span>
          </div>
          <span className="font-mono text-[11px] text-text-faint">
            {entries.length} indexed cards
          </span>
        </div>
      </Command>
    </CommandDialog>
  )
}
