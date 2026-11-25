import { Link } from "@tanstack/react-router"
import { BarChart3 } from "lucide-react"
import { ProgressRing } from "@/components/features/ProgressRing"
import { Progress } from "@/components/ui/progress"
import { getCardsForChapter, getProgressCounts } from "@/lib/selectors"
import type { HandbookBundle } from "@/lib/types"
import { useProgressStore } from "@/store/useProgressStore"

interface ProgressViewProps {
  bundle: HandbookBundle
}

export function ProgressView({ bundle }: ProgressViewProps) {
  const statusMap = useProgressStore((s) => s.status)
  const overall = getProgressCounts(bundle.cards, statusMap)

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground">
              <BarChart3 className="size-3.5 text-brand" aria-hidden="true" />
              <span>Progress Overview</span>
            </div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {bundle.handbook.name} Mastery
            </h1>
            <p className="text-sm text-muted-foreground">
              {overall.known} known · {overall.revisit} revisit ·{" "}
              {overall.untouched} untouched
            </p>
          </div>

          <ProgressRing
            value={overall.percent}
            size={68}
            strokeWidth={5}
            showValue
            label={`${bundle.handbook.name} overall progress`}
          />
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
        <h2 className="font-heading text-base font-semibold">By chapter</h2>
        <div className="space-y-4">
          {bundle.handbook.chapters.map((chapter) => {
            const chapterCards = getCardsForChapter(bundle, chapter.slug)
            const counts = getProgressCounts(chapterCards, statusMap)
            return (
              <div key={chapter.slug} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <Link
                    to="/$hb/c/$chapter"
                    params={{ hb: bundle.handbook.id, chapter: chapter.slug }}
                    className="font-medium hover:text-brand"
                  >
                    {chapter.emoji} {chapter.title}
                  </Link>
                  <span className="font-mono text-xs text-muted-foreground">
                    {counts.known}/{counts.total} ({counts.percent}%)
                  </span>
                </div>
                <Progress value={counts.percent} />
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
