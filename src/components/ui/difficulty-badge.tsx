import { Badge } from "@/components/ui/badge"
import type { Difficulty } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DifficultyBadgeProps {
  difficulty: Difficulty
  className?: string
}

const DIFFICULTY_STYLES: Record<
  Difficulty,
  { label: string; color: string; softBg: string }
> = {
  easy: {
    label: "Easy",
    color: "var(--easy)",
    softBg: "var(--easy-soft)",
  },
  medium: {
    label: "Medium",
    color: "var(--medium)",
    softBg: "var(--medium-soft)",
  },
  hard: {
    label: "Hard",
    color: "var(--hard)",
    softBg: "var(--hard-soft)",
  },
}

export function DifficultyBadge({
  difficulty,
  className,
}: DifficultyBadgeProps) {
  const style = DIFFICULTY_STYLES[difficulty]

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 border font-medium", className)}
      style={{
        borderColor: `color-mix(in srgb, ${style.color} 40%, transparent)`,
        backgroundColor: style.softBg,
        color: style.color,
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: style.color }}
        aria-hidden="true"
      />
      <span>{style.label}</span>
    </Badge>
  )
}
