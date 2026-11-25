import { BookOpen, Code2, Cpu, Database, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

interface HandbookIconProps {
  icon: string
  accent?: string
  accent2?: string
  className?: string
  iconClassName?: string
}

function PythonEmblem({
  accent = "#4A90E2",
  accent2 = "#FFD43B",
  className,
}: {
  accent?: string
  accent2?: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-5", className)}
      aria-hidden="true"
    >
      <path
        d="M11.9 2C7.8 2 8.1 3.8 8.1 3.8l.01 1.9h3.9v.6H6.6S4 6 4 10c0 4 2.3 3.9 2.3 3.9h1.4v-1.9s-.1-2.3 2.3-2.3h3.9s2.2 0 2.2-2.1V4.1S16.4 2 11.9 2Zm-2.1 1.2a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4Z"
        fill={accent}
      />
      <path
        d="M12.1 22c4.1 0 3.8-1.8 3.8-1.8l-.01-1.9h-3.9v-.6h5.4s2.6.3 2.6-3.7c0-4-2.3-3.9-2.3-3.9h-1.4V12s.1 2.3-2.3 2.3h-3.9s-2.2 0-2.2 2.1v3.5S7.6 22 12.1 22Zm2.1-1.2a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4Z"
        fill={accent2}
      />
    </svg>
  )
}

function JavaEmblem({
  accent = "#E76F00",
  accent2 = "#5382A1",
  className,
}: {
  accent?: string
  accent2?: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-5", className)}
      aria-hidden="true"
    >
      <path
        d="M10 3.5c1 1.3-.8 2.2 0 3.5m4-3.5c1 1.3-.8 2.2 0 3.5"
        stroke={accent}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6.5 10h9.5v3.5a4.75 4.75 0 0 1-9.5 0V10Z"
        stroke={accent2}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M16 10.75h1.5a2 2 0 0 1 0 4H16"
        stroke={accent2}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M5 19.5c2.2.8 11.8.8 14 0"
        stroke={accent}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LanguageMonogram({
  label,
  bg,
  fg,
  className,
}: {
  label: string
  bg: string
  fg: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex size-5 items-center justify-center rounded font-mono text-[10px] font-bold tracking-tight",
        className
      )}
      style={{ backgroundColor: bg, color: fg }}
      aria-hidden="true"
    >
      {label}
    </span>
  )
}

export function HandbookIcon({
  icon,
  accent,
  accent2,
  className,
  iconClassName,
}: HandbookIconProps) {
  const key = icon.trim().toLowerCase()

  const renderGlyph = () => {
    switch (key) {
      case "python":
        return (
          <PythonEmblem
            accent={accent}
            accent2={accent2}
            className={iconClassName}
          />
        )
      case "java":
        return (
          <JavaEmblem
            accent={accent}
            accent2={accent2}
            className={iconClassName}
          />
        )
      case "sql":
      case "postgres":
      case "postgresql":
      case "database":
        return (
          <Database
            className={cn("size-4 text-brand", iconClassName)}
            style={accent ? { color: accent } : undefined}
            aria-hidden="true"
          />
        )
      case "javascript":
      case "js":
        return (
          <LanguageMonogram
            label="JS"
            bg={accent ?? "#F7DF1E"}
            fg="#0B0D12"
            className={iconClassName}
          />
        )
      case "typescript":
      case "ts":
        return (
          <LanguageMonogram
            label="TS"
            bg={accent ?? "#3178C6"}
            fg="#FFFFFF"
            className={iconClassName}
          />
        )
      case "go":
      case "golang":
        return (
          <LanguageMonogram
            label="GO"
            bg={accent ?? "#00ADD8"}
            fg="#0B0D12"
            className={iconClassName}
          />
        )
      case "cpp":
      case "c++":
        return (
          <LanguageMonogram
            label="C+"
            bg={accent ?? "#00599C"}
            fg="#FFFFFF"
            className={iconClassName}
          />
        )
      case "rust":
        return (
          <Terminal
            className={cn("size-4 text-brand", iconClassName)}
            style={accent ? { color: accent } : undefined}
            aria-hidden="true"
          />
        )
      case "system-design":
      case "architecture":
        return (
          <Cpu
            className={cn("size-4 text-brand", iconClassName)}
            style={accent ? { color: accent } : undefined}
            aria-hidden="true"
          />
        )
      case "code":
        return (
          <Code2
            className={cn("size-4 text-brand", iconClassName)}
            style={accent ? { color: accent } : undefined}
            aria-hidden="true"
          />
        )
      default:
        return (
          <BookOpen
            className={cn("size-4 text-brand", iconClassName)}
            style={accent ? { color: accent } : undefined}
            aria-hidden="true"
          />
        )
    }
  }

  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2 shadow-xs",
        className
      )}
    >
      {renderGlyph()}
    </span>
  )
}
