import { Link } from "@tanstack/react-router"
import {
  ArrowLeftRight,
  BarChart3,
  Bookmark,
  ChevronRight,
  Home,
  Zap,
} from "lucide-react"
import { ChapterIcon } from "@/components/ui/chapter-icon"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { HandbookIcon } from "@/components/ui/handbook-icon"
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
import { stripInlineCode } from "@/lib/text"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/store/useProgressStore"
import { useSettingsStore } from "@/store/useSettingsStore"

interface HandbookSidebarProps {
  bundle: HandbookBundle
  activePath: string
  activeChapterSlug?: string
  activeCardId?: string
  onResizeWidth?: (width: number) => void
  onResetWidth?: () => void
}

export function HandbookSidebar({
  bundle,
  activePath,
  activeChapterSlug,
  activeCardId,
  onResizeWidth,
  onResetWidth,
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

  return (
    <Sidebar collapsible="icon" id="handbook-sidebar">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip={handbook.name}
              className="hover:bg-sidebar-accent/80"
            >
              <Link
                to="/$hb"
                params={{ hb: handbook.id }}
                onClick={closeMobileIfNeeded}
              >
                <HandbookIcon
                  icon={handbook.icon}
                  iconSvg={handbook.iconSvg}
                  accent={handbook.accent}
                />
                <span className="min-w-0 flex-1 truncate font-heading text-sm font-semibold text-foreground">
                  {handbook.name}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel>Study</SidebarGroupLabel>
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
                const isCurrentChapter = activeChapterSlug === ch.slug
                const defaultExpanded =
                  handbook.chapters.length <= 3 ||
                  isCurrentChapter ||
                  (!activeChapterSlug && ch.slug === handbook.chapters[0]?.slug)
                const isCollapsed =
                  collapsedChapters[chapterKey] ?? !defaultExpanded

                if (isIconCollapsed) {
                  return (
                    <SidebarMenuItem key={ch.slug}>
                      <SidebarMenuButton
                        asChild
                        isActive={isCurrentChapter}
                        tooltip={`${ch.title} (${counts.known}/${counts.total})`}
                      >
                        <Link
                          to="/$hb/c/$chapter"
                          params={{ hb: handbook.id, chapter: ch.slug }}
                          onClick={closeMobileIfNeeded}
                        >
                          <ChapterIcon
                            icon={ch.icon}
                            emoji={ch.emoji}
                            className={
                              isCurrentChapter
                                ? "text-brand"
                                : "text-muted-foreground"
                            }
                          />
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
                    className="group/collapsible min-w-0"
                  >
                    <SidebarMenuItem className="min-w-0">
                      <div className="flex min-w-0 items-center gap-1">
                        <SidebarMenuButton
                          asChild
                          isActive={isCurrentChapter && !activeCardId}
                          className="min-w-0 flex-1"
                        >
                          <Link
                            to="/$hb/c/$chapter"
                            params={{ hb: handbook.id, chapter: ch.slug }}
                            onClick={closeMobileIfNeeded}
                            className="min-w-0"
                          >
                            <ChapterIcon
                              icon={ch.icon}
                              emoji={ch.emoji}
                              className={
                                isCurrentChapter && !activeCardId
                                  ? "text-brand"
                                  : "text-muted-foreground"
                              }
                            />
                            <span className="min-w-0 flex-1 truncate">
                              {ch.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>

                        <CollapsibleTrigger asChild>
                          <button
                            type="button"
                            aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${ch.title}`}
                            className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md px-1.5 font-mono text-[11px] text-text-faint tabular-nums transition-colors hover:bg-sidebar-accent hover:text-foreground"
                          >
                            <span>
                              {counts.known}/{counts.total}
                            </span>
                            <ChevronRight
                              className="size-3.5 transition-transform duration-(--duration-fast) group-data-[state=open]/collapsible:rotate-90"
                              aria-hidden="true"
                            />
                          </button>
                        </CollapsibleTrigger>
                      </div>

                      <CollapsibleContent>
                        <SidebarMenuSub className="mr-0 pr-0">
                          {cards.map((card) => {
                            const cardStatus = statusMap[card.id]
                            const isCurrentCard = activeCardId === card.id

                            return (
                              <SidebarMenuSubItem
                                key={card.id}
                                className="min-w-0"
                              >
                                <SidebarMenuSubButton
                                  asChild
                                  size="sm"
                                  isActive={isCurrentCard}
                                  className="min-w-0"
                                >
                                  <Link
                                    to="/$hb/t/$cardId"
                                    params={{
                                      hb: handbook.id,
                                      cardId: card.id,
                                    }}
                                    onClick={closeMobileIfNeeded}
                                    className={cn(
                                      "flex w-full min-w-0 items-center gap-2",
                                      isCurrentCard && "font-medium text-brand"
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "size-1.5 shrink-0 rounded-full",
                                        cardStatus === "known"
                                          ? "bg-[var(--easy)]"
                                          : cardStatus === "revisit"
                                            ? "bg-[var(--medium)]"
                                            : isCurrentCard
                                              ? "bg-brand"
                                              : "bg-border"
                                      )}
                                      aria-hidden="true"
                                    />
                                    <span className="min-w-0 flex-1 truncate">
                                      {stripInlineCode(card.title)}
                                    </span>
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
      </SidebarContent>

      {allHandbooks.length > 1 && (
        <SidebarFooter className="border-t border-sidebar-border p-2">
          <SidebarMenu>
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
          </SidebarMenu>
        </SidebarFooter>
      )}
      <SidebarRail onResizeWidth={onResizeWidth} onResetWidth={onResetWidth} />
    </Sidebar>
  )
}
