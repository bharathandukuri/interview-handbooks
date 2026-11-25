import { Link } from "@tanstack/react-router"
import { Zap } from "lucide-react"
import { getCardsForChapter } from "@/lib/selectors"
import type { HandbookBundle } from "@/lib/types"

interface RevisionViewProps {
  bundle: HandbookBundle
}

export function RevisionView({ bundle }: RevisionViewProps) {
  const { handbook } = bundle

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
        <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground">
          <Zap className="size-3.5 text-brand" aria-hidden="true" />
          <span>Quick Revision</span>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {handbook.name} Cheatsheet
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One-line revision takeaways aggregated automatically from card
          frontmatter.
        </p>
      </header>

      <div className="space-y-4">
        {handbook.chapters.map((chapter) => {
          const cards = getCardsForChapter(bundle, chapter.slug).filter(
            (c) => c.revision.length > 0
          )
          if (cards.length === 0) return null

          return (
            <section
              key={chapter.slug}
              className="rounded-2xl border border-border bg-surface p-5 shadow-(--shadow-card)"
            >
              <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-semibold">
                <span aria-hidden="true">{chapter.emoji}</span>
                <span>{chapter.title}</span>
              </h2>
              <ul className="space-y-2">
                {cards.map((card) => (
                  <li
                    key={card.id}
                    className="rounded-xl border border-border bg-surface-2/60 p-3 text-sm"
                  >
                    <Link
                      to="/$hb/t/$cardId"
                      params={{ hb: handbook.id, cardId: card.id }}
                      className="font-medium text-foreground hover:text-brand"
                    >
                      {card.title}
                    </Link>
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                      {card.revision.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
