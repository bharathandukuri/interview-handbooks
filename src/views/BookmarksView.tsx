import { Link } from "@tanstack/react-router"
import { ArrowRight, Bookmark, Check, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { InlineCodeTitle } from "@/components/ui/inline-code-title"
import { getOrderedCards } from "@/lib/selectors"
import { stripInlineCode } from "@/lib/text"
import type { HandbookBundle } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/store/useProgressStore"

interface BookmarksViewProps {
  bundle: HandbookBundle
}

export function BookmarksView({ bundle }: BookmarksViewProps) {
  const bookmarks = useProgressStore((s) => s.bookmarks)
  const statusMap = useProgressStore((s) => s.status)
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark)

  const bookmarkedCards = getOrderedCards(bundle).filter((c) =>
    bookmarks.includes(c.id)
  )
  const chapterTitles = new Map(
    bundle.handbook.chapters.map((chapter) => [chapter.slug, chapter.title])
  )

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
        <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground">
          <Bookmark className="size-3.5 text-brand" aria-hidden="true" />
          <span>Saved Cards</span>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Bookmarks
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {bookmarkedCards.length} saved card
          {bookmarkedCards.length === 1 ? "" : "s"} in {bundle.handbook.name}.
        </p>
      </header>

      {bookmarkedCards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            No bookmarks yet.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Click the bookmark icon on any card to pin it here for quick review.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link to="/$hb" params={{ hb: bundle.handbook.id }}>
              Browse chapters
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {bookmarkedCards.map((card) => {
            const cardStatus = statusMap[card.id]
            const chapterTitle = chapterTitles.get(card.chapter) ?? card.chapter
            return (
              <div
                key={card.id}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4 shadow-(--shadow-card) transition-colors hover:border-[var(--accent-ring)]"
              >
                <Link
                  to="/$hb/t/$cardId"
                  params={{ hb: bundle.handbook.id, cardId: card.id }}
                  className="min-w-0 flex-1 space-y-1.5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <DifficultyBadge difficulty={card.difficulty} />
                    <span className="font-mono text-xs text-text-faint">
                      {chapterTitle}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-mono text-[11px]",
                        cardStatus === "known"
                          ? "text-[var(--easy)]"
                          : cardStatus === "revisit"
                            ? "text-[var(--medium)]"
                            : "text-text-faint"
                      )}
                    >
                      {cardStatus === "known" && (
                        <Check className="size-3" aria-hidden="true" />
                      )}
                      {cardStatus === "revisit" && (
                        <RotateCcw className="size-3" aria-hidden="true" />
                      )}
                      <span>
                        {cardStatus === "known"
                          ? "Known"
                          : cardStatus === "revisit"
                            ? "Revisit"
                            : `${card.readTime} min`}
                      </span>
                    </span>
                  </div>
                  <div className="font-heading text-base font-semibold text-foreground group-hover:text-brand">
                    <InlineCodeTitle text={card.title} />
                  </div>
                </Link>

                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => toggleBookmark(card.id)}
                    aria-label={`Remove bookmark for ${stripInlineCode(card.title)}`}
                    title="Remove bookmark"
                    className="text-brand hover:text-destructive"
                  >
                    <Bookmark
                      className="size-4 fill-current"
                      aria-hidden="true"
                    />
                  </Button>
                  <Link
                    to="/$hb/t/$cardId"
                    params={{ hb: bundle.handbook.id, cardId: card.id }}
                    aria-label={`Open ${stripInlineCode(card.title)}`}
                    className="rounded-md p-1 text-muted-foreground transition-colors group-hover:text-brand"
                  >
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
