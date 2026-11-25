import { Link } from "@tanstack/react-router"
import {
  ArrowLeftRight,
  BarChart3,
  Bookmark,
  Check,
  ChevronRight,
  Home,
  Layers,
  Palette,
  RotateCcw,
  Zap,
} from "lucide-react"
import { ProgressRing } from "@/components/features/ProgressRing"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { getHandbooksMeta } from "@/lib/content"
import { getCardsForChapter, getProgressCounts } from "@/lib/selectors"
import type { HandbookBundle } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/store/useProgressStore"
import { useSettingsStore } from "@/store/useSettingsStore"

interface HandbookSidebarProps {
  bundle: HandbookBundle
  activePath: string
  activeChapterSlug?: string
  activeCardId?: string
}

export function HandbookSidebar({
  bundle,
  activePath,
  activeChapterSlug,
  activeCardId,
}: HandbookSidebarProps) {
  const { isMobile, setOpenMobile, state } = useSidebar()
  const collapsedChapters = useSettingsStore((s) => s.collapsedChapters)
  const setChapterCollapsed = useSettingsStore((s) => s.setChapterCollapsed)
  const statusMap = useProgressStore((s) => s.status)
  const allHandbooks = getHandbooksMeta()
  const { handbook } = bundle

  const hbBasePath = `/${handbook.id}`
  const isHomeActive =
    activePath === hbBasePath || activePath === `${hbBasePath}/`
  const isIconCollapsed = state === "collapsed" && !isMobile

  const closeMobileIfNeeded = () => {
    if (isMobile) setOpenMobile(false)
  }

  const navItems = [
    {
      label: "Overview",
      to: "/$hb" as const,
      icon: Home,
      isActive: isHomeActive,
    },
    {
      label: "Flashcards",
      to: "/$hb/flashcards" as const,
      icon: Layers,
      isActive: activePath.startsWith(`${hbBasePath}/flashcards`),
    },
    {
      label: "Quick Revision",
      to: "/$hb/revision" as const,
      icon: Zap,
      isActive: activePath.startsWith(`${hbBasePath}/revision`),
    },
    {
      label: "Progress",
      to: "/$hb/progress" as const,
      icon: BarChart3,
      isActive: activePath.startsWith(`${hbBasePath}/progress`),
    },
    {
      label: "Bookmarks",
      to: "/$hb/bookmarks" as const,
      icon: Bookmark,
      isActive: activePath.startsWith(`${hbBasePath}/bookmarks`),
    },
  ]

  const overallCounts = getProgressCounts(bundle.cards, statusMap)

  return (
    <Sidebar collapsible="icon" id="handbook-sidebar">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip={`${handbook.name} · ${overallCounts.known}/${overallCounts.total} known`}
              className="hover:bg-sidebar-accent/80"
            >
              <Link
                to="/$hb"
                params={{ hb: handbook.id }}
                onClick={closeMobileIfNeeded}
              >
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg font-heading text-sm font-bold shadow-xs"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-fg)",
                  }}
                  aria-hidden="true"
                >
                  {handbook.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-heading text-sm font-semibold text-foreground">
                    {handbook.name}
                  </span>
                  <span className="truncate font-mono text-[11px] text-muted-foreground">
                    {overallCounts.known}/{overallCounts.total} known ·{" "}
                    {handbook.chapterCount} ch
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full">
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.isActive}
                        tooltip={item.label}
                      >
                        <Link
                          to={item.to}
                          params={{ hb: handbook.id }}
                          onClick={closeMobileIfNeeded}
                        >
                          <Icon
                            className={cn(
                              item.isActive
                                ? "text-brand"
                                : "text-muted-foreground"
                            )}
                            aria-hidden="true"
                          />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Chapters</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {handbook.chapters.map((ch) => {
                  const cards = getCardsForChapter(bundle, ch.slug)
                  const counts = getProgressCounts(cards, statusMap)
                  const chapterKey = `${handbook.id}.${ch.slug}`
                  const isCollapsed = collapsedChapters[chapterKey] ?? false
                  const isCurrentChapter = activeChapterSlug === ch.slug

                  if (isIconCollapsed) {
                    return (
                      <SidebarMenuItem key={ch.slug}>
                        <SidebarMenuButton
                          asChild
                          isActive={isCurrentChapter}
                          tooltip={`${ch.emoji} ${ch.title} (${counts.known}/${counts.total})`}
                        >
                          <Link
                            to="/$hb/c/$chapter"
                            params={{ hb: handbook.id, chapter: ch.slug }}
                            onClick={closeMobileIfNeeded}
                          >
                            <span
                              className="flex size-4 shrink-0 items-center justify-center text-sm leading-none"
                              aria-hidden="true"
                            >
                              {ch.emoji}
                            </span>
                            <span>{ch.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  }

                  return (
                    <Collapsible
                      key={ch.slug}
                      open={!isCollapsed}
                      onOpenChange={(open) =>
                        setChapterCollapsed(chapterKey, !open)
                      }
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <div className="flex items-center gap-0.5">
                          <SidebarMenuButton
                            asChild
                            isActive={isCurrentChapter && !activeCardId}
                            className="flex-1 pr-1"
                          >
                            <Link
                              to="/$hb/c/$chapter"
                              params={{ hb: handbook.id, chapter: ch.slug }}
                              onClick={closeMobileIfNeeded}
                            >
                              <span
                                className="flex size-4 shrink-0 items-center justify-center text-sm leading-none"
                                aria-hidden="true"
                              >
                                {ch.emoji}
                              </span>
                              <span className="flex-1 truncate">
                                {ch.title}
                              </span>
                            </Link>
                          </SidebarMenuButton>

                          <CollapsibleTrigger asChild>
                            <button
                              type="button"
                              aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${ch.title}`}
                              className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
                            >
                              <ProgressRing
                                value={counts.percent}
                                size={16}
                                strokeWidth={2}
                                label={`${ch.title} progress`}
                              />
                              <ChevronRight
                                className="size-3.5 transition-transform duration-(--duration-fast) group-data-[state=open]/collapsible:rotate-90"
                                aria-hidden="true"
                              />
                            </button>
                          </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {cards.map((card) => {
                              const cardStatus = statusMap[card.id]
                              const isCurrentCard = activeCardId === card.id

                              return (
                                <SidebarMenuSubItem key={card.id}>
                                  <SidebarMenuSubButton
                                    asChild
                                    size="sm"
                                    isActive={isCurrentCard}
                                  >
                                    <Link
                                      to="/$hb/t/$cardId"
                                      params={{
                                        hb: handbook.id,
                                        cardId: card.id,
                                      }}
                                      onClick={closeMobileIfNeeded}
                                      className={cn(
                                        isCurrentCard &&
                                          "font-medium text-brand"
                                      )}
                                    >
                                      <span className="flex-1 truncate">
                                        {card.title}
                                      </span>
                                      {cardStatus === "known" && (
                                        <Check
                                          className="size-3 shrink-0 text-[var(--easy)]"
                                          aria-label="Known"
                                        />
                                      )}
                                      {cardStatus === "revisit" && (
                                        <RotateCcw
                                          className="size-3 shrink-0 text-[var(--medium)]"
                                          aria-label="Revisit"
                                        />
                                      )}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      {(allHandbooks.length > 1 || import.meta.env.DEV) && (
        <SidebarFooter className="border-t border-sidebar-border p-2">
          <SidebarMenu>
            {allHandbooks.length > 1 && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm" tooltip="Switch handbook">
                  <Link to="/" onClick={closeMobileIfNeeded}>
                    <ArrowLeftRight
                      className="text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>All handbooks</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {import.meta.env.DEV && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm" tooltip="Design kit">
                  <Link to="/_kit" onClick={closeMobileIfNeeded}>
                    <Palette
                      className="text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>UI Kit (/_kit)</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  )
}
