import { useEffect, useMemo, useState } from "react"
import { useFormatForDisplay } from "@tanstack/react-hotkeys"
import { useNavigate, useParams, useRouterState } from "@tanstack/react-router"
import {
  BarChart3,
  Bookmark,
  BookOpen,
  Home,
  Layers,
  Palette,
  RotateCcw,
  SunMoon,
  Zap,
} from "lucide-react"
import { toast } from "sonner"
import { HighlightedText } from "@/components/features/HighlightedText"
import {
  SearchResults,
  type SearchCardEntry,
} from "@/components/features/SearchResults"
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
import {
  createSearchIndex,
  highlightSubstring,
  searchChapters,
  searchEntries,
} from "@/lib/search"
import { useSettingsStore } from "@/store/useSettingsStore"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [entries, setEntries] = useState<SearchCardEntry[]>([])
  const [loaded, setLoaded] = useState(false)
  const navigate = useNavigate()
  const params = useParams({ strict: false }) as { hb?: string }
  const location = useRouterState({
    select: (s) => ({
      pathname: s.location.pathname,
      searchStr: s.location.searchStr,
    }),
  })
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

  const orderedEntries = useMemo(() => {
    if (!activeHbId) return entries
    return [...entries].sort((a, b) => {
      if (a.handbookId === activeHbId && b.handbookId !== activeHbId) return -1
      if (a.handbookId !== activeHbId && b.handbookId === activeHbId) return 1
      return 0
    })
  }, [entries, activeHbId])

  const { fuse } = useMemo(
    () => createSearchIndex(orderedEntries),
    [orderedEntries]
  )

  const matchedCards = useMemo(
    () => searchEntries(fuse, orderedEntries, query, 12),
    [fuse, orderedEntries, query]
  )

  const allChapters = useMemo(
    () =>
      handbooks.flatMap((hb) =>
        hb.chapters.map((ch) => ({
          handbookId: hb.id,
          handbookName: hb.name,
          ...ch,
        }))
      ),
    [handbooks]
  )

  const matchedChapters = useMemo(
    () => searchChapters(allChapters, query),
    [allChapters, query]
  )

  const hasActiveSearch =
    Boolean(location.searchStr && location.searchStr.length > 1) ||
    Boolean(
      activeHbId &&
      (location.pathname.startsWith(`/${activeHbId}/c/`) ||
        location.pathname.startsWith(`/${activeHbId}/flashcards`))
    )

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
            label: "Go to flashcards",
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
            label: "Go to progress",
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
      ...(hasActiveSearch
        ? [
            {
              id: "reset-filters",
              label: "Reset filters",
              shortcut: undefined,
              icon: RotateCcw,
              run: () => {
                void navigate({
                  to: ".",
                  search: {},
                  replace: true,
                })
                toast.success("Filters cleared")
              },
            },
          ]
        : []),
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

    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return list
    return list.filter((a) => a.label.toLowerCase().includes(trimmed))
  }, [
    activeHbId,
    formatForDisplay,
    hasActiveSearch,
    navigate,
    query,
    toggleTheme,
  ])

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

          <SearchResults
            results={matchedCards}
            onSelect={(card) => {
              handleOpenChange(false)
              void navigate({
                to: "/$hb/t/$cardId",
                params: { hb: card.handbookId, cardId: card.id },
              })
            }}
          />

          {matchedChapters.length > 0 && (
            <>
              {matchedCards.length > 0 && <CommandSeparator />}
              <CommandGroup heading="Chapters">
                {matchedChapters.map(({ chapter: ch, titleSegments }) => (
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
                      {ch.emoji} <HighlightedText segments={titleSegments} />
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
              {(matchedCards.length > 0 || matchedChapters.length > 0) && (
                <CommandSeparator />
              )}
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
                      <span className="flex-1">
                        <HighlightedText
                          segments={highlightSubstring(action.label, query)}
                        />
                      </span>
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
