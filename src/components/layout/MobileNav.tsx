import { Link } from "@tanstack/react-router"
import { BarChart3, BookOpen, Home, Layers, Search } from "lucide-react"
import { useCommandPalette } from "@/app/providers"
import type { HandbookBundle } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  bundle: HandbookBundle
  activePath: string
  activeChapterSlug?: string
}

export function MobileNav({
  bundle,
  activePath,
  activeChapterSlug,
}: MobileNavProps) {
  const { openPalette } = useCommandPalette()
  const { handbook } = bundle
  const hbBasePath = `/${handbook.id}`
  const targetChapter = activeChapterSlug ?? handbook.chapters[0]?.slug ?? ""

  const isHomeActive =
    activePath === hbBasePath || activePath === `${hbBasePath}/`
  const isChaptersActive =
    activePath.includes(`${hbBasePath}/c/`) ||
    activePath.includes(`${hbBasePath}/t/`)
  const isFlashcardsActive = activePath.startsWith(`${hbBasePath}/flashcards`)
  const isProgressActive = activePath.startsWith(`${hbBasePath}/progress`)

  const linkBaseClass =
    "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors"

  return (
    <nav
      data-slot="mobile-nav"
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-30 flex items-center border-t border-border bg-surface/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden"
    >
      <Link
        to="/$hb"
        params={{ hb: handbook.id }}
        className={cn(
          linkBaseClass,
          isHomeActive ? "text-brand" : "text-muted-foreground"
        )}
      >
        <Home className="size-4" aria-hidden="true" />
        <span className="truncate">Home</span>
      </Link>

      {targetChapter && (
        <Link
          to="/$hb/c/$chapter"
          params={{ hb: handbook.id, chapter: targetChapter }}
          className={cn(
            linkBaseClass,
            isChaptersActive ? "text-brand" : "text-muted-foreground"
          )}
        >
          <BookOpen className="size-4" aria-hidden="true" />
          <span className="truncate">Chapters</span>
        </Link>
      )}

      <Link
        to="/$hb/flashcards"
        params={{ hb: handbook.id }}
        className={cn(
          linkBaseClass,
          isFlashcardsActive ? "text-brand" : "text-muted-foreground"
        )}
      >
        <Layers className="size-4" aria-hidden="true" />
        <span className="truncate">Flashcards</span>
      </Link>

      <button
        type="button"
        onClick={openPalette}
        className={cn(
          linkBaseClass,
          "text-muted-foreground hover:text-foreground"
        )}
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="truncate">Search</span>
      </button>

      <Link
        to="/$hb/progress"
        params={{ hb: handbook.id }}
        className={cn(
          linkBaseClass,
          isProgressActive ? "text-brand" : "text-muted-foreground"
        )}
      >
        <BarChart3 className="size-4" aria-hidden="true" />
        <span className="truncate">Progress</span>
      </Link>
    </nav>
  )
}
