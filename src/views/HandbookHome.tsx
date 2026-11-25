import { Link } from "@tanstack/react-router"
import { ArrowRight, Flame, History, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { HandbookIcon } from "@/components/ui/handbook-icon"
import { InlineCodeTitle } from "@/components/ui/inline-code-title"
import { Progress } from "@/components/ui/progress"
import {
  getCardsForChapter,
  getOrderedCards,
  getProgressCounts,
} from "@/lib/selectors"
import type { HandbookBundle } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/store/useProgressStore"

interface HandbookHomeProps {
  bundle: HandbookBundle
}

export function HandbookHome({ bundle }: HandbookHomeProps) {
  const statusMap = useProgressStore((s) => s.status)
  const lastVisitedCardId = useProgressStore(
    (s) => s.lastVisited[bundle.handbook.id]
  )
  const { handbook } = bundle

  const orderedCards = getOrderedCards(bundle)
  const overall = getProgressCounts(bundle.cards, statusMap)
  const lastCard = lastVisitedCardId
    ? bundle.cards.find((c) => c.id === lastVisitedCardId)
    : undefined
  const lastCardChapter = lastCard
    ? handbook.chapters.find((ch) => ch.slug === lastCard.chapter)
    : undefined
  const mostAskedCards = orderedCards.filter((card) => card.mostAsked)

  return (
    <div className="space-y-8">
      <section
        className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card) sm:p-8"
        style={{
          backgroundImage:
            "radial-gradient(560px circle at 100% 0%, var(--accent-soft), transparent 65%)",
        }}
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-text-faint">
            <HandbookIcon
              icon={handbook.icon}
              iconSvg={handbook.iconSvg}
              accent={handbook.accent}
              className="size-5 rounded-md border-0 bg-transparent shadow-none"
              iconClassName="size-4"
            />
            <span>
              {handbook.chapterCount} chapters · {handbook.cardCount} cards
            </span>
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {handbook.name} Interview Handbook
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            {handbook.tagline}
          </p>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              {overall.known} of {overall.total} cards mastered
            </span>
            <span className="font-mono text-text-faint tabular-nums">
              {overall.percent}%
              {overall.revisit > 0 ? ` · ${overall.revisit} to revisit` : ""}
            </span>
          </div>
          <Progress value={overall.percent} className="h-1.5" />
        </div>

        {lastCard && (
          <Link
            to="/$hb/t/$cardId"
            params={{ hb: handbook.id, cardId: lastCard.id }}
            data-slot="continue-card"
            className="group mt-6 flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-2/70 p-4 transition-colors hover:border-[var(--accent-ring)]"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 text-xs text-text-faint">
                <History className="size-3.5 text-brand" aria-hidden="true" />
                <span>Continue where you left off</span>
                {lastCardChapter && (
                  <>
                    <span>·</span>
                    <span className="truncate">
                      {lastCardChapter.emoji} {lastCardChapter.title}
                    </span>
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate font-heading text-sm font-semibold text-foreground group-hover:text-brand">
                  <InlineCodeTitle text={lastCard.title} />
                </span>
                <DifficultyBadge
                  difficulty={lastCard.difficulty}
                  className="px-1.5 py-0 text-[10px]"
                />
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand">
              <span className="hidden sm:inline">Resume</span>
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          {!lastCard && orderedCards[0] && (
            <Button asChild size="sm">
              <Link
                to="/$hb/t/$cardId"
                params={{ hb: handbook.id, cardId: orderedCards[0].id }}
              >
                <span>Start studying</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          )}

          <Button asChild variant="outline" size="sm">
            <Link to="/$hb/revision" params={{ hb: handbook.id }}>
              <Zap className="size-4" aria-hidden="true" />
              <span>Quick Revision</span>
            </Link>
          </Button>
        </div>
      </section>

      {mostAskedCards.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight">
              <Flame
                className="size-4 text-[var(--medium)]"
                aria-hidden="true"
              />
              <span>Most Asked</span>
            </h2>
            <span className="font-mono text-xs text-text-faint">
              High-frequency interview topics
            </span>
          </div>

          <div
            data-slot="most-asked-strip"
            className="flex snap-x gap-3 overflow-x-auto pb-2"
          >
            {mostAskedCards.map((card) => {
              const ch = handbook.chapters.find((c) => c.slug === card.chapter)
              const cardStatus = statusMap[card.id]
              return (
                <Link
                  key={card.id}
                  to="/$hb/t/$cardId"
                  params={{ hb: handbook.id, cardId: card.id }}
                  className="group flex max-w-[290px] min-w-[250px] shrink-0 snap-start flex-col justify-between gap-3 rounded-2xl border border-border bg-surface p-4 shadow-(--shadow-card) transition-all duration-(--duration-base) hover:border-[var(--accent-ring)] hover:shadow-(--shadow-card-hover)"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <DifficultyBadge
                        difficulty={card.difficulty}
                        className="px-2 py-0 text-[10px]"
                      />
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          cardStatus === "known"
                            ? "bg-[var(--easy)]"
                            : cardStatus === "revisit"
                              ? "bg-[var(--medium)]"
                              : "bg-border"
                        )}
                        title={cardStatus ?? "Untouched"}
                      />
                    </div>
                    <h3 className="line-clamp-2 font-heading text-sm leading-snug font-semibold text-foreground group-hover:text-brand">
                      <InlineCodeTitle text={card.title} />
                    </h3>
                  </div>

                  <div className="flex items-center justify-between font-mono text-[11px] text-text-faint">
                    <span className="truncate">
                      {ch ? `${ch.emoji} ${ch.title}` : card.chapter}
                    </span>
                    <ArrowRight
                      className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Chapters
          </h2>
          <span className="font-mono text-xs text-text-faint">
            Pick a topic to browse cards
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {handbook.chapters.map((chapter) => {
            const chapterCards = getCardsForChapter(bundle, chapter.slug)
            const counts = getProgressCounts(chapterCards, statusMap)
            return (
              <Link
                key={chapter.slug}
                to="/$hb/c/$chapter"
                params={{ hb: handbook.id, chapter: chapter.slug }}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-(--shadow-card) transition-all duration-(--duration-base) hover:border-[var(--accent-ring)] hover:shadow-(--shadow-card-hover)"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg" aria-hidden="true">
                        {chapter.emoji}
                      </span>
                      <h3 className="font-heading text-base font-semibold tracking-tight group-hover:text-brand">
                        {chapter.title}
                      </h3>
                    </div>
                    <ArrowRight
                      className="size-4 text-text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {chapter.description}
                  </p>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px] text-text-faint tabular-nums">
                    <span>
                      {counts.total} {counts.total === 1 ? "card" : "cards"}
                    </span>
                    <span>{counts.known} known</span>
                  </div>
                  <Progress value={counts.percent} className="h-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
