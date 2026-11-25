import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Flame, Printer, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChapterIcon } from "@/components/ui/chapter-icon"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { InlineCodeTitle } from "@/components/ui/inline-code-title"
import { getCardsForChapter } from "@/lib/selectors"
import type { HandbookBundle } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RevisionViewProps {
  bundle: HandbookBundle
}

export function RevisionView({ bundle }: RevisionViewProps) {
  const { handbook } = bundle
  const [mostAskedOnly, setMostAskedOnly] = useState(false)

  const chapterGroups = handbook.chapters
    .map((chapter) => {
      const cards = getCardsForChapter(bundle, chapter.slug).filter(
        (card) => card.revision.length > 0 && (!mostAskedOnly || card.mostAsked)
      )
      return { chapter, cards }
    })
    .filter((group) => group.cards.length > 0)

  const totalTakeaways = chapterGroups.reduce(
    (sum, group) =>
      sum + group.cards.reduce((cardSum, c) => cardSum + c.revision.length, 0),
    0
  )
  const totalCards = chapterGroups.reduce(
    (sum, group) => sum + group.cards.length,
    0
  )

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground">
              <Zap className="size-3.5 text-brand" aria-hidden="true" />
              <span>Quick Revision</span>
            </div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {handbook.name} Cheatsheet
            </h1>
            <p className="text-sm text-muted-foreground">
              {totalTakeaways} key takeaway{totalTakeaways === 1 ? "" : "s"}{" "}
              across {totalCards} card{totalCards === 1 ? "" : "s"} in{" "}
              {chapterGroups.length} chapter
              {chapterGroups.length === 1 ? "" : "s"}.
            </p>
          </div>

          <div
            data-print-hide="true"
            className="flex flex-wrap items-center gap-2"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-pressed={mostAskedOnly}
              onClick={() => setMostAskedOnly((prev) => !prev)}
              className={cn(
                "gap-1.5 text-xs",
                mostAskedOnly &&
                  "border-[color-mix(in_srgb,var(--accent-2)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent-2)_14%,transparent)] text-foreground"
              )}
            >
              <Flame
                className={cn(
                  "size-3.5",
                  mostAskedOnly
                    ? "text-[var(--medium)]"
                    : "text-muted-foreground"
                )}
                aria-hidden="true"
              />
              <span>Most asked only</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5 text-xs"
            >
              <Printer className="size-3.5" aria-hidden="true" />
              <span>Print cheatsheet</span>
            </Button>
          </div>
        </div>
      </header>

      {chapterGroups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            No revision notes match this filter.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Turn off &ldquo;Most asked only&rdquo; to view takeaways from all
            chapters.
          </p>
          {mostAskedOnly && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMostAskedOnly(false)}
              className="mt-4"
            >
              Show all takeaways
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {chapterGroups.map(({ chapter, cards }) => (
            <section
              key={chapter.slug}
              data-print-chapter
              className="rounded-2xl border border-border bg-surface p-5 shadow-(--shadow-card)"
            >
              <div className="mb-3 flex items-center justify-between gap-2 border-b border-border pb-2.5">
                <h2 className="flex items-center gap-2 font-heading text-base font-semibold">
                  <ChapterIcon
                    icon={chapter.icon}
                    emoji={chapter.emoji}
                    className="size-4 text-brand"
                  />
                  <span>{chapter.title}</span>
                </h2>
                <span className="font-mono text-xs text-text-faint tabular-nums">
                  {cards.length} card{cards.length === 1 ? "" : "s"}
                </span>
              </div>

              <ul className="grid gap-2.5 sm:grid-cols-2">
                {cards.map((card) => (
                  <li
                    key={card.id}
                    data-print-item
                    className="rounded-xl border border-border bg-surface-2/50 p-3.5 text-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link
                        to="/$hb/t/$cardId"
                        params={{ hb: handbook.id, cardId: card.id }}
                        className="font-medium text-foreground hover:text-brand"
                      >
                        <InlineCodeTitle text={card.title} />
                      </Link>
                      <div className="flex items-center gap-1.5">
                        {card.mostAsked && (
                          <Flame
                            className="size-3.5 text-[var(--medium)]"
                            aria-label="Most asked"
                          />
                        )}
                        <DifficultyBadge difficulty={card.difficulty} />
                      </div>
                    </div>

                    <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
                      {card.revision.map((line, idx) => (
                        <li key={idx}>
                          <InlineCodeTitle text={line} />
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
