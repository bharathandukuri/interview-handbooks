import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  label?: string
  size?: "sm" | "md"
  className?: string
  barClassName?: string
}

/**
 * Accessible horizontal progress bar styled with theme tokens and reduced-motion support.
 */
export function ProgressBar({
  value,
  label = "Progress",
  size = "sm",
  className,
  barClassName,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  const isComplete = clamped >= 100

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      data-slot="progress-bar"
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-muted",
        size === "sm" ? "h-1.5" : "h-2",
        className
      )}
    >
      <div
        data-slot="progress-bar-fill"
        className={cn(
          "h-full rounded-full transition-[width,background-color] duration-(--duration-slow) ease-(--ease-standard) motion-reduce:transition-none",
          isComplete ? "bg-[var(--easy)]" : "bg-[var(--accent)]",
          barClassName
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
