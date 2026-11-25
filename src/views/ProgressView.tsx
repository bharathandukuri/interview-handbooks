import { useRef, useState, type ChangeEvent } from "react"
import { Link } from "@tanstack/react-router"
import {
  ArrowRight,
  BarChart3,
  Check,
  Download,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react"
import { toast } from "sonner"
import { ProgressBar } from "@/components/features/ProgressBar"
import { ProgressRing } from "@/components/features/ProgressRing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChapterIcon } from "@/components/ui/chapter-icon"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { InlineCodeTitle } from "@/components/ui/inline-code-title"
import {
  getCardsForChapter,
  getOrderedCards,
  getProgressCounts,
} from "@/lib/selectors"
import { stripInlineCode } from "@/lib/text"
import type { HandbookBundle } from "@/lib/types"
import { parseProgressBackup, useProgressStore } from "@/store/useProgressStore"

interface ProgressViewProps {
  bundle: HandbookBundle
}

interface PendingImport {
  fileName: string
  raw: string
  statusCount: number
  bookmarkCount: number
}

export function ProgressView({ bundle }: ProgressViewProps) {
  const statusMap = useProgressStore((s) => s.status)
  const setStatus = useProgressStore((s) => s.setStatus)
  const exportJSON = useProgressStore((s) => s.exportJSON)
  const importJSON = useProgressStore((s) => s.importJSON)
  const reset = useProgressStore((s) => s.reset)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null)
  const [resetOpen, setResetOpen] = useState(false)

  const overall = getProgressCounts(bundle.cards, statusMap)
  const orderedCards = getOrderedCards(bundle)
  const revisitCards = orderedCards.filter(
    (card) => statusMap[card.id] === "revisit"
  )
  const chapterTitles = new Map(
    bundle.handbook.chapters.map((chapter) => [chapter.slug, chapter.title])
  )

  const handleExport = () => {
    const json = exportJSON()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${bundle.handbook.id}-progress.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Progress backup downloaded", {
      description: `${bundle.handbook.id}-progress.json`,
    })
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    const raw = await file.text()
    const parsed = parseProgressBackup(raw)
    if (!parsed.ok) {
      toast.error("Invalid backup file", {
        description: parsed.error,
      })
      return
    }

    setPendingImport({
      fileName: file.name,
      raw,
      statusCount: Object.keys(parsed.data.status).length,
      bookmarkCount: parsed.data.bookmarks.length,
    })
  }

  const handleConfirmImport = () => {
    if (!pendingImport) return
    const result = importJSON(pendingImport.raw)
    const fileName = pendingImport.fileName
    setPendingImport(null)

    if (!result.ok) {
      toast.error("Import failed", { description: result.error })
      return
    }

    toast.success("Progress restored", {
      description: `Loaded backup from ${fileName}`,
    })
  }

  const handleConfirmReset = () => {
    reset()
    setResetOpen(false)
    toast.success("Study progress reset")
  }

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
            size={72}
            strokeWidth={5}
            showValue
            label={`${bundle.handbook.name} overall progress`}
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-surface-2/60 px-3.5 py-2.5">
            <div className="font-mono text-lg font-semibold text-[var(--easy)] tabular-nums">
              {overall.known}
            </div>
            <div className="text-xs text-muted-foreground">Known</div>
          </div>
          <div className="rounded-xl border border-border bg-surface-2/60 px-3.5 py-2.5">
            <div className="font-mono text-lg font-semibold text-[var(--medium)] tabular-nums">
              {overall.revisit}
            </div>
            <div className="text-xs text-muted-foreground">Revisit</div>
          </div>
          <div className="rounded-xl border border-border bg-surface-2/60 px-3.5 py-2.5">
            <div className="font-mono text-lg font-semibold text-foreground tabular-nums">
              {overall.untouched}
            </div>
            <div className="text-xs text-muted-foreground">Untouched</div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
        <h2 className="font-heading text-base font-semibold">By chapter</h2>
        <div className="space-y-4">
          {bundle.handbook.chapters.map((chapter) => {
            const chapterCards = getCardsForChapter(bundle, chapter.slug)
            const counts = getProgressCounts(chapterCards, statusMap)
            return (
              <div key={chapter.slug} className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <Link
                    to="/$hb/c/$chapter"
                    params={{ hb: bundle.handbook.id, chapter: chapter.slug }}
                    className="inline-flex items-center gap-2 font-medium hover:text-brand"
                  >
                    <ChapterIcon
                      icon={chapter.icon}
                      emoji={chapter.emoji}
                      className="size-4 text-muted-foreground"
                    />
                    <span>{chapter.title}</span>
                  </Link>
                  <div className="flex items-center gap-2 font-mono text-xs tabular-nums">
                    {counts.revisit > 0 && (
                      <span className="text-[var(--medium)]">
                        {counts.revisit} revisit
                      </span>
                    )}
                    <span className="text-muted-foreground">
                      {counts.known}/{counts.total} ({counts.percent}%)
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={counts.percent}
                  label={`${chapter.title} progress`}
                />
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <RotateCcw
              className="size-4 text-[var(--medium)]"
              aria-hidden="true"
            />
            <h2 className="font-heading text-base font-semibold">
              Cards to revisit
            </h2>
          </div>
          <Badge variant="secondary" className="font-mono text-xs tabular-nums">
            {revisitCards.length}
          </Badge>
        </div>

        {revisitCards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface-2/40 p-6 text-center">
            <p className="text-sm font-medium text-foreground">
              No cards flagged for revisit.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Mark tricky cards as Revisit while studying to collect them here.
            </p>
          </div>
        ) : (
          <div className="grid gap-2.5">
            {revisitCards.map((card) => (
              <div
                key={card.id}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-2/40 p-3.5 transition-colors hover:border-[var(--accent-ring)]"
              >
                <Link
                  to="/$hb/t/$cardId"
                  params={{ hb: bundle.handbook.id, cardId: card.id }}
                  className="min-w-0 flex-1 space-y-1"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <DifficultyBadge difficulty={card.difficulty} />
                    <span className="font-mono text-xs text-text-faint">
                      {chapterTitles.get(card.chapter) ?? card.chapter}
                    </span>
                  </div>
                  <div className="font-heading text-sm font-semibold text-foreground group-hover:text-brand">
                    <InlineCodeTitle text={card.title} />
                  </div>
                </Link>

                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatus(card.id, "known")}
                    aria-label={`Mark ${stripInlineCode(card.title)} as known`}
                    className="gap-1 text-xs text-muted-foreground hover:text-[var(--easy)]"
                  >
                    <Check className="size-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Mark known</span>
                  </Button>
                  <Link
                    to="/$hb/t/$cardId"
                    params={{ hb: bundle.handbook.id, cardId: card.id }}
                    aria-label={`Open ${stripInlineCode(card.title)}`}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-brand"
                  >
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
        <div className="space-y-1">
          <h2 className="font-heading text-base font-semibold">
            Backup &amp; reset
          </h2>
          <p className="text-xs text-muted-foreground">
            Study progress is saved locally in this browser. Export a JSON
            backup anytime or restore from a saved file.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          aria-label="Import progress JSON file"
          className="sr-only"
          onChange={(e) => void handleFileChange(e)}
        />

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="size-3.5" aria-hidden="true" />
            <span>Export JSON</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-3.5" aria-hidden="true" />
            <span>Import JSON</span>
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setResetOpen(true)}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            <span>Reset progress</span>
          </Button>
        </div>
      </section>

      <Dialog
        open={pendingImport !== null}
        onOpenChange={(open) => {
          if (!open) setPendingImport(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace progress from backup?</DialogTitle>
            <DialogDescription>
              Importing{" "}
              <span className="font-mono text-foreground">
                {pendingImport?.fileName}
              </span>{" "}
              will overwrite your current study statuses, bookmarks, and reading
              history across handbooks.
            </DialogDescription>
          </DialogHeader>

          {pendingImport && (
            <div className="rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 font-mono text-xs text-muted-foreground">
              {pendingImport.statusCount} card status
              {pendingImport.statusCount === 1 ? "" : "es"} ·{" "}
              {pendingImport.bookmarkCount} bookmark
              {pendingImport.bookmarkCount === 1 ? "" : "s"}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingImport(null)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirmImport}>
              Import &amp; replace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset all study progress?</DialogTitle>
            <DialogDescription>
              This permanently clears all Known and Revisit statuses, bookmarks,
              and resume history in this browser. Export a JSON backup first if
              you want to keep your progress.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setResetOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmReset}
            >
              Reset everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
