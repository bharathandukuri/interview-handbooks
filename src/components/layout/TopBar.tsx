import { Fragment } from "react"
import { useFormatForDisplay } from "@tanstack/react-hotkeys"
import { Link } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { useCommandPalette } from "@/app/providers"
import { ThemeToggle } from "@/components/features/ThemeToggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { appHotkeys } from "@/lib/keyboard"
import type { Card, ChapterMeta, HandbookBundle } from "@/lib/types"

interface TopBarProps {
  bundle: HandbookBundle
  activeChapter?: ChapterMeta
  activeCard?: Card
  sectionLabel?: string
}

export function TopBar({
  bundle,
  activeChapter,
  activeCard,
  sectionLabel,
}: TopBarProps) {
  const { openPalette } = useCommandPalette()
  const formatForDisplay = useFormatForDisplay()
  const { handbook } = bundle

  const isRootHome = !activeChapter && !activeCard && !sectionLabel
  const shortcutLabel = formatForDisplay(
    appHotkeys["palette.open"].hotkey ?? "Mod+K"
  )

  return (
    <header
      data-slot="topbar"
      className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-background/85 px-3 backdrop-blur-md sm:gap-3 sm:px-6"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarTrigger aria-label="Toggle navigation sidebar" />
        <Separator orientation="vertical" className="h-4 shrink-0" />

        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap overflow-hidden">
            <BreadcrumbItem
              className={activeCard ? "hidden sm:inline-flex" : "inline-flex"}
            >
              {isRootHome ? (
                <BreadcrumbPage className="truncate font-heading font-medium">
                  {handbook.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    to="/$hb"
                    params={{ hb: handbook.id }}
                    className="truncate"
                  >
                    {handbook.name}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {sectionLabel && (
              <Fragment>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="min-w-0">
                  <BreadcrumbPage className="truncate font-medium">
                    {sectionLabel}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </Fragment>
            )}

            {activeChapter && !sectionLabel && (
              <Fragment>
                <BreadcrumbSeparator
                  className={activeCard ? "hidden sm:inline-flex" : undefined}
                />
                <BreadcrumbItem className="min-w-0">
                  {activeCard ? (
                    <BreadcrumbLink asChild>
                      <Link
                        to="/$hb/c/$chapter"
                        params={{
                          hb: handbook.id,
                          chapter: activeChapter.slug,
                        }}
                        className="inline-flex max-w-[120px] items-center gap-1 truncate sm:max-w-[180px]"
                      >
                        <span aria-hidden="true">{activeChapter.emoji}</span>
                        <span className="truncate">{activeChapter.title}</span>
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="inline-flex items-center gap-1.5 truncate font-medium">
                      <span aria-hidden="true">{activeChapter.emoji}</span>
                      <span className="truncate">{activeChapter.title}</span>
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            )}

            {activeCard && (
              <Fragment>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="min-w-0">
                  <BreadcrumbPage className="max-w-[145px] truncate font-medium sm:max-w-[260px] lg:max-w-[360px]">
                    {activeCard.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </Fragment>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openPalette}
          aria-label={`Open search (${shortcutLabel})`}
          className="h-8 w-8 justify-center bg-surface-2 px-0 text-muted-foreground hover:border-[var(--accent-ring)] hover:text-foreground sm:h-9 sm:w-48 sm:justify-between sm:px-3 lg:w-60"
        >
          <span className="inline-flex items-center gap-2">
            <Search className="size-3.5" aria-hidden="true" />
            <span className="hidden text-xs sm:inline">Search...</span>
          </span>
          <Kbd className="hidden sm:inline-flex">{shortcutLabel}</Kbd>
        </Button>

        <ThemeToggle />
      </div>
    </header>
  )
}
