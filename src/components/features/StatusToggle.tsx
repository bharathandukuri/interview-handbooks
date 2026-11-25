import { useFormatForDisplay } from "@tanstack/react-hotkeys"
import { CheckCircle2, RotateCcw } from "lucide-react"
import { motion } from "motion/react"
import { Kbd } from "@/components/ui/kbd"
import { appHotkeys } from "@/lib/keyboard"
import type { CardStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StatusToggleProps {
  status?: CardStatus
  onChange: (nextStatus: CardStatus | undefined) => void
  showHotkeys?: boolean
  size?: "sm" | "default"
  className?: string
}

export function StatusToggle({
  status,
  onChange,
  showHotkeys = true,
  size = "default",
  className,
}: StatusToggleProps) {
  const formatForDisplay = useFormatForDisplay()
  const knownKey = formatForDisplay(appHotkeys["card.known"].hotkey ?? "K")
  const revisitKey = formatForDisplay(appHotkeys["card.revisit"].hotkey ?? "R")
  const isKnown = status === "known"
  const isRevisit = status === "revisit"

  const buttonPadding =
    size === "sm" ? "h-7 px-2.5 text-xs" : "h-8 px-3 text-xs"

  return (
    <div
      role="group"
      aria-label="Card mastery status"
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
        aria-pressed={isKnown}
        onClick={() => onChange(isKnown ? undefined : "known")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border font-medium transition-colors duration-(--duration-fast) outline-none",
          buttonPadding,
          isKnown
            ? "border-[color-mix(in_srgb,var(--easy)_55%,transparent)] bg-[var(--easy-soft)] text-[var(--easy)]"
            : "border-border bg-surface-2 text-muted-foreground hover:border-border hover:text-foreground"
        )}
      >
        <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
        <span>Known</span>
        {showHotkeys && (
          <Kbd className="hidden opacity-80 sm:inline-flex">{knownKey}</Kbd>
        )}
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
        aria-pressed={isRevisit}
        onClick={() => onChange(isRevisit ? undefined : "revisit")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border font-medium transition-colors duration-(--duration-fast) outline-none",
          buttonPadding,
          isRevisit
            ? "border-[color-mix(in_srgb,var(--medium)_55%,transparent)] bg-[var(--medium-soft)] text-[var(--medium)]"
            : "border-border bg-surface-2 text-muted-foreground hover:border-border hover:text-foreground"
        )}
      >
        <RotateCcw className="size-3.5 shrink-0" aria-hidden="true" />
        <span>Revisit</span>
        {showHotkeys && (
          <Kbd className="hidden opacity-80 sm:inline-flex">{revisitKey}</Kbd>
        )}
      </motion.button>
    </div>
  )
}
