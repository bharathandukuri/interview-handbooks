import { Link } from "@tanstack/react-router"
import { ArrowRight, Bookmark } from "lucide-react"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import type { HandbookBundle } from "@/lib/types"
import { useProgressStore } from "@/store/useProgressStore"

interface BookmarksViewProps {
  bundle: HandbookBundle
}

export function BookmarksView({ bundle }: BookmarksViewProps) {
  const bookmarks = useProgressStore((s) => s.bookmarks)
  const bookmarkedCards = bundle.cards.filter((c) => bookmarks.includes(c.id))

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
        </div>
      ) : (
        <div className="grid gap-3">
          {bookmarkedCards.map((card) => (
            <Link
              key={card.id}
              to="/$hb/t/$cardId"
              params={{ hb: bundle.handbook.id, cardId: card.id }}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-(--shadow-card) transition-colors hover:border-[var(--accent-ring)]"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DifficultyBadge difficulty={card.difficulty} />
                  <span className="font-mono text-xs text-text-faint">
                    {card.chapter}
                  </span>
                </div>
                <div className="font-heading text-base font-semibold group-hover:text-brand">
                  {card.title}
                </div>
              </div>
              <ArrowRight
                className="size-4 shrink-0 text-muted-foreground group-hover:text-brand"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
