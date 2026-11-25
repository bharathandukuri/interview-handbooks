import { BookOpen, Code2, Cpu, Database, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

interface HandbookIconProps {
  icon: string
  iconSvg?: string
  accent?: string
  className?: string
  iconClassName?: string
}

function FallbackIcon({
  icon,
  accent,
  iconClassName,
}: {
  icon: string
  accent?: string
  iconClassName?: string
}) {
  const key = icon.trim().toLowerCase()
  const style = accent ? { color: accent } : undefined

  if (
    key === "sql" ||
    key === "postgres" ||
    key === "postgresql" ||
    key === "database"
  ) {
    return (
      <Database
        className={cn("size-4 text-brand", iconClassName)}
        style={style}
        aria-hidden="true"
      />
    )
  }
  if (key === "terminal" || key === "bash" || key === "rust") {
    return (
      <Terminal
        className={cn("size-4 text-brand", iconClassName)}
        style={style}
        aria-hidden="true"
      />
    )
  }
  if (key === "system-design" || key === "architecture") {
    return (
      <Cpu
        className={cn("size-4 text-brand", iconClassName)}
        style={style}
        aria-hidden="true"
      />
    )
  }
  if (key === "code") {
    return (
      <Code2
        className={cn("size-4 text-brand", iconClassName)}
        style={style}
        aria-hidden="true"
      />
    )
  }
  return (
    <BookOpen
      className={cn("size-4 text-brand", iconClassName)}
      style={style}
      aria-hidden="true"
    />
  )
}

export function HandbookIcon({
  icon,
  iconSvg,
  accent,
  className,
  iconClassName,
}: HandbookIconProps) {
  return (
    <span
      data-slot="handbook-icon"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2 shadow-xs",
        className
      )}
    >
      {iconSvg ? (
        <span
          className={cn(
            "inline-flex size-5 items-center justify-center [&>svg]:size-full",
            iconClassName
          )}
          dangerouslySetInnerHTML={{ __html: iconSvg }}
        />
      ) : (
        <FallbackIcon
          icon={icon}
          accent={accent}
          iconClassName={iconClassName}
        />
      )}
    </span>
  )
}
