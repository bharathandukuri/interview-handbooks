import { Link } from "@tanstack/react-router"
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Code2,
  Columns2,
  Eye,
  Flame,
  HelpCircle,
  Lightbulb,
  RotateCcw,
} from "lucide-react"
import { FilterBar } from "@/components/features/FilterBar"
import { Button } from "@/components/ui/button"
import { ChapterIcon } from "@/components/ui/chapter-icon"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { InlineCodeTitle } from "@/components/ui/inline-code-title"
import { Progress } from "@/components/ui/progress"
import type { CardFilterSearch } from "@/lib/search-params"
import { filterCards, getChapterTags, getProgressCounts } from "@/lib/selectors"
import type { Card, CardType, ChapterMeta, HandbookMeta } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/store/useProgressStore"

interface ChapterViewProps {
  handbook: HandbookMeta
  chapter: ChapterMeta
  cards: Card[]
  filters: CardFilterSearch
  onFiltersChange: (next: CardFilterSearch) => void
}

const TYPE_ICONS: Record<CardType, typeof HelpCircle> = {
  question: HelpCircle,
  concept: Lightbulb,
  predict: Eye,
  compare: Columns2,
  pitfall: AlertTriangle,
  problem: Code2,
}

export function ChapterView({
  handbook,
  chapter,
  cards,
  filters,
  onFiltersChange,
}: ChapterViewProps) {
  const statusMap = useProgressStore((s) => s.status)
  const counts = getProgressCounts(cards, statusMap)
  const availableTags = getChapterTags(cards)
  const filtered = filterCards(cards, filters, statusMap)

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface-2">
              <ChapterIcon
                icon={chapter.icon}
                emoji={chapter.emoji}
                className="size-4.5 text-brand"
              />
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
      </header>

      <FilterBar
        filters={filters}
        availableTags={availableTags}
        totalCount={cards.length}
        visibleCount={filtered.length}
        onChange={onFiltersChange}
      />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            No cards match the active filters.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try clearing a difficulty, tag, or status filter to see more cards.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFiltersChange({})}
            className="mt-4"
          >
            Reset filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((card) => {
            const cardStatus = statusMap[card.id]
            const TypeIcon = TYPE_ICONS[card.type]
            return (
              <Link
                key={card.id}
                to="/$hb/t/$cardId"
                params={{ hb: handbook.id, cardId: card.id }}
                className="group flex flex-col justify-between gap-3 rounded-xl border border-border bg-surface p-4 shadow-(--shadow-card) transition-all duration-(--duration-base) hover:border-[var(--accent-ring)] hover:shadow-(--shadow-card-hover)"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground capitalize">
                        <TypeIcon
                          className="size-3 text-brand"
                          aria-hidden="true"
                        />
                        <span>{card.type}</span>
                      </span>
                      <DifficultyBadge difficulty={card.difficulty} />
                    </div>

                    <div className="flex items-center gap-2">
                      {card.mostAsked && (
                        <span
                          title="Most asked in interviews"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--medium)]"
                        >
                          <Flame className="size-3" aria-hidden="true" />
                          <span className="hidden sm:inline">Most asked</span>
                        </span>
                      )}
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
                  </div>

                  <h2 className="font-heading text-base leading-snug font-semibold tracking-tight text-foreground group-hover:text-brand">
                    <InlineCodeTitle text={card.title} />
                  </h2>
                </div>

                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                    {card.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[11px] text-text-faint"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <ArrowRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
