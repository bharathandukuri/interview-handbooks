import { useState } from "react"
import { useFormatForDisplay } from "@tanstack/react-hotkeys"
import { CheckCircle2, Eye, RotateCcw, XCircle } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { CardShell, type CardSharedProps } from "@/components/cards/CardShell"
import { RichContent } from "@/components/features/RichContent"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { appHotkeys } from "@/lib/keyboard"
import { cn } from "@/lib/utils"

export interface PredictCardProps extends CardSharedProps {
  defaultRevealed?: boolean
}

export function PredictCard({
  card,
  revealed: controlledRevealed,
  defaultRevealed = false,
  onRevealChange,
  ...shellProps
}: PredictCardProps) {
  const [uncontrolledRevealed, setUncontrolledRevealed] =
    useState(defaultRevealed)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const formatForDisplay = useFormatForDisplay()

  const options = Array.isArray(card.meta.options)
    ? (card.meta.options as string[])
    : undefined
  const correctIndex =
    typeof card.meta.answer === "number" ? card.meta.answer : undefined

  const isControlled = controlledRevealed !== undefined
  const isRevealed = isControlled ? controlledRevealed : uncontrolledRevealed

  const setRevealed = (next: boolean) => {
    if (!isControlled) setUncontrolledRevealed(next)
    onRevealChange?.(next)
  }

  const handleSelectOption = (index: number) => {
    setSelectedOption(index)
    setRevealed(true)
  }

  const handleReset = () => {
    setSelectedOption(null)
    setRevealed(false)
  }

  const hasFeedback =
    selectedOption !== null && correctIndex !== undefined && isRevealed
  const isCorrect = hasFeedback && selectedOption === correctIndex

  return (
    <CardShell
      {...shellProps}
      card={card}
      onRevealKey={() => setRevealed(!isRevealed)}
    >
      <div className="sr-only" aria-live="polite">
        {isRevealed
          ? hasFeedback
            ? isCorrect
              ? "Correct answer selected, output revealed"
              : "Incorrect option selected, output revealed"
            : "Output revealed"
          : "Output hidden"}
      </div>

      {card.sections.intro && <RichContent html={card.sections.intro} />}
      <div id="section-code">
        <RichContent html={card.sections.code ?? ""} />
      </div>

      {options && options.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              What will this snippet print?
            </span>
            {(isRevealed || selectedOption !== null) && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleReset}
                className="gap-1 text-xs text-muted-foreground"
              >
                <RotateCcw className="size-3" aria-hidden="true" />
                <span>Reset</span>
              </Button>
            )}
          </div>

          <div
            role="radiogroup"
            aria-label="Output prediction options"
            className="grid gap-2 sm:grid-cols-2"
          >
            {options.map((opt, index) => {
              const letter = String.fromCharCode(65 + index)
              const picked = selectedOption === index
              const isAnswer = correctIndex === index
              const showAsCorrect = isRevealed && isAnswer
              const showAsWrong = isRevealed && picked && !isAnswer

              return (
                <button
                  key={`${index}-${opt}`}
                  type="button"
                  role="radio"
                  aria-checked={picked}
                  onClick={() => handleSelectOption(index)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors duration-(--duration-fast) outline-none",
                    showAsCorrect
                      ? "border-[var(--easy)] bg-[var(--easy-soft)] text-foreground"
                      : showAsWrong
                        ? "border-[var(--hard)] bg-[var(--hard-soft)] text-foreground"
                        : picked
                          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-foreground"
                          : "border-border bg-surface-2 text-foreground hover:border-[var(--accent-ring)]"
                  )}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-surface font-mono text-xs font-semibold">
                    {letter}
                  </span>
                  <span className="flex-1 font-mono text-xs sm:text-sm">
                    {opt}
                  </span>
                  {showAsCorrect && (
                    <CheckCircle2
                      className="size-4 shrink-0 text-[var(--easy)]"
                      aria-hidden="true"
                    />
                  )}
                  {showAsWrong && (
                    <XCircle
                      className="size-4 shrink-0 text-[var(--hard)]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        !isRevealed && (
          <div className="flex items-center justify-between rounded-xl border border-dashed border-border bg-surface-2/60 p-4">
            <span className="text-sm text-muted-foreground">
              Predict the output before revealing
            </span>
            <Button
              type="button"
              onClick={() => setRevealed(true)}
              className="gap-2"
            >
              <Eye className="size-4" aria-hidden="true" />
              <span>Show output</span>
              <Kbd className="bg-background/20 text-inherit">
                {formatForDisplay(appHotkeys["card.reveal"].hotkey ?? "Space")}
              </Kbd>
            </Button>
          </div>
        )
      )}

      <AnimatePresence initial={false}>
        {isRevealed && (
          <motion.div
            key="predict-reveal"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-1">
              {hasFeedback && (
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium",
                    isCorrect
                      ? "bg-[var(--easy-soft)] text-[var(--easy)]"
                      : "bg-[var(--hard-soft)] text-[var(--hard)]"
                  )}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="size-3.5" aria-hidden="true" />
                      <span>Spot on!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="size-3.5" aria-hidden="true" />
                      <span>
                        Not quite — option{" "}
                        {String.fromCharCode(65 + (correctIndex ?? 0))} matches
                        the output.
                      </span>
                    </>
                  )}
                </div>
              )}

              <div
                id="section-output"
                className="rounded-xl border border-border bg-surface-2 p-3.5"
              >
                <div className="mb-1.5 font-mono text-[11px] font-medium tracking-wider text-text-faint uppercase">
                  Output
                </div>
                <RichContent
                  html={card.sections.output ?? ""}
                  className="[&_[data-slot=code-block]]:my-0"
                />
              </div>

              {card.sections.explanation && (
                <div id="section-explanation" className="space-y-1.5">
                  <div className="text-xs font-semibold tracking-wider text-brand uppercase">
                    Explanation
                  </div>
                  <RichContent html={card.sections.explanation} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CardShell>
  )
}
