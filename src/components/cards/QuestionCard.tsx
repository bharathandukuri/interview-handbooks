import { useState } from "react"
import { useFormatForDisplay } from "@tanstack/react-hotkeys"
import { Eye, EyeOff } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { CardShell, type CardSharedProps } from "@/components/cards/CardShell"
import { RichContent } from "@/components/features/RichContent"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { appHotkeys } from "@/lib/keyboard"

export interface QuestionCardProps extends CardSharedProps {
  defaultRevealed?: boolean
}

export function QuestionCard({
  card,
  revealed: controlledRevealed,
  defaultRevealed = false,
  onRevealChange,
  ...shellProps
}: QuestionCardProps) {
  const [uncontrolledRevealed, setUncontrolledRevealed] =
    useState(defaultRevealed)
  const formatForDisplay = useFormatForDisplay()

  const isControlled = controlledRevealed !== undefined
  const isRevealed = isControlled ? controlledRevealed : uncontrolledRevealed

  const setRevealed = (next: boolean) => {
    if (!isControlled) setUncontrolledRevealed(next)
    onRevealChange?.(next)
  }

  const toggleReveal = () => setRevealed(!isRevealed)

  const extraTabs = [
    card.sections.why
      ? { id: "why", label: "Why interviewers ask", html: card.sections.why }
      : null,
    card.sections.followUps
      ? { id: "followUps", label: "Follow-ups", html: card.sections.followUps }
      : null,
    card.sections.code
      ? { id: "code", label: "Code", html: card.sections.code }
      : null,
  ].filter((t): t is { id: string; label: string; html: string } => t !== null)

  return (
    <CardShell {...shellProps} card={card} onRevealKey={toggleReveal}>
      <div className="sr-only" aria-live="polite">
        {isRevealed ? "Answer revealed" : "Answer hidden"}
      </div>

      {!isRevealed ? (
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-dashed border-border bg-surface-2/60 p-5 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Think through your answer first
            </p>
            <p className="text-xs text-muted-foreground">
              Try explaining it out loud before revealing the explanation.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setRevealed(true)}
            className="shrink-0 gap-2"
          >
            <Eye className="size-4" aria-hidden="true" />
            <span>Reveal answer</span>
            <Kbd className="bg-background/20 text-inherit">
              {formatForDisplay(appHotkeys["card.reveal"].hotkey ?? "Space")}
            </Kbd>
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span
            id="section-answer"
            className="text-xs font-semibold tracking-wider text-brand uppercase"
          >
            Answer
          </span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setRevealed(false)}
            className="gap-1.5 text-xs text-muted-foreground"
          >
            <EyeOff className="size-3.5" aria-hidden="true" />
            <span>Hide</span>
          </Button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isRevealed && (
          <motion.div
            key="answer-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-5 pt-1">
              <RichContent html={card.sections.answer ?? ""} />

              {extraTabs.length > 0 && (
                <Tabs defaultValue={extraTabs[0].id} className="pt-2">
                  <TabsList className="w-full flex-wrap justify-start sm:w-fit">
                    {extraTabs.map((tab) => (
                      <TabsTrigger key={tab.id} value={tab.id}>
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {extraTabs.map((tab) => (
                    <TabsContent
                      key={tab.id}
                      value={tab.id}
                      id={`section-${tab.id}`}
                      className="mt-3 rounded-xl border border-border bg-surface-2/60 p-4"
                    >
                      <RichContent html={tab.html} />
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CardShell>
  )
}
