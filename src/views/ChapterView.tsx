import { Link } from "@tanstack/react-router"
import { ArrowRight, Check, Flame, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { InlineCodeTitle } from "@/components/ui/inline-code-title"
import { Progress } from "@/components/ui/progress"
import type { CardFilterSearch } from "@/lib/search-params"
import { filterCards, getProgressCounts } from "@/lib/selectors"
import type { Card, ChapterMeta, HandbookMeta } from "@/lib/types"
import { useProgressStore } from "@/store/useProgressStore"

interface ChapterViewProps {
  handbook: HandbookMeta
  chapter: ChapterMeta
  cards: Card[]
  filters: CardFilterSearch
}

export function ChapterView({
  handbook,
  chapter,
  cards,
  filters,
}: ChapterViewProps) {
  const statusMap = useProgressStore((s) => s.status)
  const counts = getProgressCounts(cards, statusMap)
  const filtered = filterCards(cards, filters, statusMap)

  const activeFilters: string[] = []
  if (filters.difficulty) activeFilters.push(`difficulty:${filters.difficulty}`)
  if (filters.tag) activeFilters.push(`tag:#${filters.tag}`)
  if (filters.status && filters.status !== "all") {
    activeFilters.push(`status:${filters.status}`)
  }
  if (filters.mostAsked) activeFilters.push("mostAsked")

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" aria-hidden="true">
              {chapter.emoji}
            </span>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {chapter.title}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">{chapter.description}</p>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-text-faint tabular-nums">
            <span>
              {counts.known} of {counts.total} known
            </span>
            <span>{counts.percent}%</span>
          </div>
          <Progress value={counts.percent} className="h-1.5" />
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">
              Active filters:
            </span>
            {activeFilters.map((label) => (
              <Badge
                key={label}
                variant="secondary"
                className="font-mono text-xs"
              >
                {label}
              </Badge>
            ))}
            <Button asChild variant="ghost" size="xs">
              <Link
                to="/$hb/c/$chapter"
                params={{ hb: handbook.id, chapter: chapter.slug }}
                search={{}}
              >
                Clear filters
              </Link>
            </Button>
          </div>
        )}
      </header>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            No cards match the active filters.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link
              to="/$hb/c/$chapter"
              params={{ hb: handbook.id, chapter: chapter.slug }}
              search={{}}
            >
              Show all cards in {chapter.title}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((card) => {
            const cardStatus = statusMap[card.id]
            return (
              <Link
                key={card.id}
                to="/$hb/t/$cardId"
                params={{ hb: handbook.id, cardId: card.id }}
                className="group flex flex-col justify-between gap-3 rounded-2xl border border-border bg-surface p-5 shadow-(--shadow-card) transition-all duration-(--duration-base) hover:border-[var(--accent-ring)] hover:shadow-(--shadow-card-hover) sm:flex-row sm:items-center"
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted-foreground uppercase">
                      {card.type}
                    </span>
                    <DifficultyBadge difficulty={card.difficulty} />
                    {card.mostAsked && (
                      <Badge
                        variant="outline"
                        className="gap-1 border-[color-mix(in_srgb,var(--accent-2)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent-2)_14%,transparent)] text-foreground"
                      >
                        <Flame
                          className="size-3 text-[var(--medium)]"
                          aria-hidden="true"
                        />
                        <span>Most asked</span>
                      </Badge>
                    )}
                    {cardStatus === "known" && (
                      <Badge
                        variant="outline"
                        className="gap-1 border-[color-mix(in_srgb,var(--easy)_45%,transparent)] bg-[var(--easy-soft)] text-[var(--easy)]"
                      >
                        <Check className="size-3" aria-hidden="true" />
                        <span>Known</span>
                      </Badge>
                    )}
                    {cardStatus === "revisit" && (
                      <Badge
                        variant="outline"
                        className="gap-1 border-[color-mix(in_srgb,var(--medium)_45%,transparent)] bg-[var(--medium-soft)] text-[var(--medium)]"
                      >
                        <RotateCcw className="size-3" aria-hidden="true" />
                        <span>Revisit</span>
                      </Badge>
                    )}
                  </div>

                  <h2 className="font-heading text-base font-semibold tracking-tight text-foreground group-hover:text-brand">
                    <InlineCodeTitle text={card.title} />
                  </h2>

                  {card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] text-text-faint"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2 font-mono text-xs text-muted-foreground group-hover:text-brand">
                  <span>{card.readTime} min</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
