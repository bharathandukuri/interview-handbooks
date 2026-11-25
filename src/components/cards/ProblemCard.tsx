import { useState } from "react"
import { useFormatForDisplay } from "@tanstack/react-hotkeys"
import { Clock, Cpu, Eye, EyeOff, Lightbulb, Sparkles } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { CardShell, type CardSharedProps } from "@/components/cards/CardShell"
import { RichContent } from "@/components/features/RichContent"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { appHotkeys } from "@/lib/keyboard"

export interface ProblemCardProps extends CardSharedProps {
  defaultRevealed?: boolean
}

export function ProblemCard({
  card,
  revealed: controlledRevealed,
  defaultRevealed = false,
  onRevealChange,
  ...shellProps
}: ProblemCardProps) {
  const [uncontrolledRevealed, setUncontrolledRevealed] =
    useState(defaultRevealed)
  const [revealedHintCount, setRevealedHintCount] = useState(0)
  const formatForDisplay = useFormatForDisplay()

  const isControlled = controlledRevealed !== undefined
  const isRevealed = isControlled ? controlledRevealed : uncontrolledRevealed

  const setRevealed = (next: boolean) => {
    if (!isControlled) setUncontrolledRevealed(next)
    onRevealChange?.(next)
  }

  const hints = Array.isArray(card.meta.hints)
    ? (card.meta.hints as string[])
    : []
  const complexity =
    card.meta.complexity && typeof card.meta.complexity === "object"
      ? (card.meta.complexity as { time?: string; space?: string })
      : null
  const approach =
    typeof card.meta.approach === "string" ? card.meta.approach : undefined

  const hasMoreHints = revealedHintCount < hints.length

  return (
    <CardShell
      {...shellProps}
      card={card}
      onRevealKey={() => setRevealed(!isRevealed)}
    >
      <div className="sr-only" aria-live="polite">
        {isRevealed ? "Solution revealed" : "Solution hidden"}
      </div>

      {/* Problem statement */}
      <section id="section-problem" className="space-y-2">
        <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Problem
        </div>
        <RichContent html={card.sections.problem ?? ""} />
      </section>

      {/* Progressive hints */}
      {(hints.length > 0 || card.sections.hint) && (
        <section id="section-hint" className="space-y-2.5">
          {hints.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!hasMoreHints}
                  onClick={() =>
                    setRevealedHintCount((c) => Math.min(hints.length, c + 1))
                  }
                  className="gap-1.5"
                >
                  <Lightbulb
                    className="size-3.5 text-[var(--medium)]"
                    aria-hidden="true"
                  />
                  <span>
                    {hasMoreHints
                      ? `Show hint (${revealedHintCount + 1} / ${hints.length})`
                      : `All ${hints.length} hints shown`}
                  </span>
                </Button>
                {revealedHintCount > 0 && (
                  <span className="font-mono text-xs text-muted-foreground">
                    {revealedHintCount}/{hints.length} revealed
                  </span>
                )}
              </div>

              <AnimatePresence initial={false}>
                {revealedHintCount > 0 && (
                  <div className="space-y-2">
                    {hints.slice(0, revealedHintCount).map((hintHtml, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.18,
                          ease: [0.2, 0.8, 0.2, 1],
                        }}
                        className="rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm"
                      >
                        <span className="mr-2 font-mono text-xs font-semibold text-[var(--medium)]">
                          Hint {idx + 1}:
                        </span>
                        <RichContent
                          html={hintHtml}
                          className="inline [&>p]:inline"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <RichContent html={card.sections.hint ?? ""} />
          )}
        </section>
      )}

      {/* Solution toggle + reveal */}
      {!isRevealed ? (
        <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-dashed border-border bg-surface-2/60 p-4 sm:flex-row sm:items-center">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Ready to compare solutions?</p>
            <p className="text-xs text-muted-foreground">
              Reveal complexity targets, approach, and walkthrough.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setRevealed(true)}
            className="shrink-0 gap-2"
          >
            <Eye className="size-4" aria-hidden="true" />
            <span>Reveal solution</span>
            <Kbd className="bg-background/20 text-inherit">
              {formatForDisplay(appHotkeys["card.reveal"].hotkey ?? "Space")}
            </Kbd>
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {approach && (
              <Badge
                variant="outline"
                className="gap-1 border-[var(--accent-ring)] bg-[var(--accent-soft)] text-brand"
              >
                <Sparkles className="size-3" aria-hidden="true" />
                <span>{approach}</span>
              </Badge>
            )}
            {complexity?.time && (
              <Badge variant="secondary" className="gap-1 font-mono text-xs">
                <Clock
                  className="size-3 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>Time: {complexity.time}</span>
              </Badge>
            )}
            {complexity?.space && (
              <Badge variant="secondary" className="gap-1 font-mono text-xs">
                <Cpu
                  className="size-3 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>Space: {complexity.space}</span>
              </Badge>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setRevealed(false)}
            className="gap-1.5 text-xs text-muted-foreground"
          >
            <EyeOff className="size-3.5" aria-hidden="true" />
            <span>Hide solution</span>
          </Button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isRevealed && (
          <motion.div
            key="problem-solution"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              <div id="section-solution">
                <RichContent html={card.sections.solution ?? ""} />
              </div>

              {card.sections.walkthrough && (
                <div
                  id="section-walkthrough"
                  className="rounded-xl border border-border bg-surface-2/50 p-4"
                >
                  <div className="mb-2 text-xs font-semibold tracking-wider text-brand uppercase">
                    Walkthrough
                  </div>
                  <RichContent html={card.sections.walkthrough} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CardShell>
  )
}
