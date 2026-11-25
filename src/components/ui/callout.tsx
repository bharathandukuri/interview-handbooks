import type { ReactNode } from "react"
import { AlertTriangle, Gauge, Lightbulb, Sparkles } from "lucide-react"
import type { DirectiveVariant } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CalloutProps {
  variant: DirectiveVariant
  title?: string
  children: ReactNode
  className?: string
}

const CALLOUT_CONFIG: Record<
  DirectiveVariant,
  {
    defaultTitle: string
    icon: typeof Lightbulb
    borderStyle: string
    bgStyle: string
    accentColor: string
  }
> = {
  tip: {
    defaultTitle: "Tip",
    icon: Lightbulb,
    borderStyle: "border-l-[var(--easy)]",
    bgStyle: "bg-[var(--easy-soft)]",
    accentColor: "text-[var(--easy)]",
  },
  pitfall: {
    defaultTitle: "Pitfall",
    icon: AlertTriangle,
    borderStyle: "border-l-[var(--hard)]",
    bgStyle: "bg-[var(--hard-soft)]",
    accentColor: "text-[var(--hard)]",
  },
  insight: {
    defaultTitle: "Insight",
    icon: Sparkles,
    borderStyle: "border-l-[var(--accent)]",
    bgStyle: "bg-[var(--accent-soft)]",
    accentColor: "text-[var(--accent)]",
  },
  complexity: {
    defaultTitle: "Complexity",
    icon: Gauge,
    borderStyle: "border-l-[var(--medium)]",
    bgStyle: "bg-[var(--medium-soft)]",
    accentColor: "text-[var(--medium)]",
  },
}

export function Callout({ variant, title, children, className }: CalloutProps) {
  const config = CALLOUT_CONFIG[variant]
  const Icon = config.icon
  const heading = title || config.defaultTitle

  return (
    <aside
      data-slot="callout"
      data-variant={variant}
      className={cn(
        "my-4 rounded-xl border border-l-3 border-border px-4 py-3 text-sm leading-relaxed",
        config.borderStyle,
        config.bgStyle,
        className
      )}
    >
      <div
        className={cn(
          "mb-1 flex items-center gap-2 font-semibold",
          config.accentColor
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span>{heading}</span>
      </div>
      <div className="text-foreground/95 [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  )
}
