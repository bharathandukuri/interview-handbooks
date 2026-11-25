import { useEffect, useState, type CSSProperties, type ReactNode } from "react"
import { useHotkey } from "@tanstack/react-hotkeys"
import { useNavigate, useParams, useRouterState } from "@tanstack/react-router"
import { MobileNav } from "@/components/layout/MobileNav"
import { HandbookSidebar } from "@/components/layout/Sidebar"
import { TocPanel } from "@/components/layout/TocPanel"
import { TopBar } from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { appHotkeys } from "@/lib/keyboard"
import type { HandbookBundle } from "@/lib/types"
import { applyHandbookAccent, cn, resetHandbookAccent } from "@/lib/utils"
import {
  DEFAULT_SIDEBAR_WIDTH,
  useSettingsStore,
} from "@/store/useSettingsStore"

interface AppShellProps {
  bundle: HandbookBundle
  children: ReactNode
}

function getSectionLabel(pathname: string, hbId: string): string | undefined {
  const base = `/${hbId}`
  if (pathname.startsWith(`${base}/flashcards`)) return "Flashcards"
  if (pathname.startsWith(`${base}/revision`)) return "Quick Revision"
  if (pathname.startsWith(`${base}/progress`)) return "Progress"
  if (pathname.startsWith(`${base}/bookmarks`)) return "Bookmarks"
  return undefined
}

export function AppShell({ bundle, children }: AppShellProps) {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const params = useParams({ strict: false }) as {
    chapter?: string
    cardId?: string
  }

  const sidebarWidth = useSettingsStore((s) => s.sidebarWidth)
  const setSidebarWidth = useSettingsStore((s) => s.setSidebarWidth)

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true
    return window.innerWidth >= 1280
  })

  useEffect(() => {
    if (typeof window === "undefined") return undefined
    const media = window.matchMedia("(min-width: 1280px)")
    const onChange = (event: MediaQueryListEvent) => {
      setSidebarOpen(event.matches)
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    applyHandbookAccent(bundle.handbook.accent, bundle.handbook.accent2)
    return () => resetHandbookAccent()
  }, [bundle.handbook.accent, bundle.handbook.accent2])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])

  useHotkey(appHotkeys["nav.home"], () => {
    void navigate({ to: "/$hb", params: { hb: bundle.handbook.id } })
  })

  const activeCard = params.cardId
    ? bundle.cards.find((c) => c.id === params.cardId)
    : undefined
  const activeChapterSlug = activeCard?.chapter ?? params.chapter
  const activeChapter = activeChapterSlug
    ? bundle.handbook.chapters.find((c) => c.slug === activeChapterSlug)
    : undefined
  const sectionLabel = getSectionLabel(pathname, bundle.handbook.id)

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
          "--sidebar-width-icon": "3rem",
        } as CSSProperties
      }
    >
      <HandbookSidebar
        bundle={bundle}
        activePath={pathname}
        activeChapterSlug={activeChapterSlug}
        activeCardId={activeCard?.id}
        onResizeWidth={setSidebarWidth}
        onResetWidth={() => setSidebarWidth(DEFAULT_SIDEBAR_WIDTH)}
      />

      <SidebarInset className="min-w-0 bg-background">
        <TopBar
          bundle={bundle}
          activeChapter={activeChapter}
          activeCard={activeCard}
          sectionLabel={sectionLabel}
        />

        <div
          className={cn(
            "mx-auto flex w-full flex-1 justify-center gap-10 px-4 pt-6 pb-24 sm:px-8 sm:pt-8 sm:pb-12",
            activeCard ? "max-w-[1040px]" : "max-w-4xl"
          )}
        >
          <div className="min-w-0 flex-1">{children}</div>
          <TocPanel activeCard={activeCard} />
        </div>
      </SidebarInset>

      <MobileNav
        bundle={bundle}
        activePath={pathname}
        activeChapterSlug={activeChapterSlug}
      />
    </SidebarProvider>
  )
}
