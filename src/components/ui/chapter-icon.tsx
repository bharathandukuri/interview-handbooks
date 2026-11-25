import {
  Blocks,
  BookOpen,
  Box,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Network,
  Shield,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ChapterIconProps {
  icon?: string
  emoji?: string
  className?: string
}

const CHAPTER_ICONS: Record<string, LucideIcon> = {
  blocks: Blocks,
  basics: Blocks,
  foundations: Blocks,
  zap: Zap,
  functions: Zap,
  box: Box,
  oop: Box,
  cpu: Cpu,
  internals: Cpu,
  workflow: Workflow,
  concurrency: Workflow,
  async: Workflow,
  terminal: Terminal,
  stdlib: Terminal,
  testing: Terminal,
  code: Code2,
  coding: Code2,
  practice: Code2,
  layers: Layers,
  database: Database,
  shield: Shield,
  security: Shield,
  network: Network,
  "git-branch": GitBranch,
  sparkles: Sparkles,
  book: BookOpen,
}

const EMOJI_ICON_FALLBACK: Record<string, LucideIcon> = {
  "🧱": Blocks,
  "⚡": Zap,
  "📦": Box,
  "🧠": Cpu,
  "🔄": Workflow,
  "💻": Code2,
  "🚀": Sparkles,
}

/**
 * Renders a crisp Lucide vector icon for a handbook chapter, gracefully
 * supporting explicit `icon` names and legacy `emoji` entries.
 */
export function ChapterIcon({ icon, emoji, className }: ChapterIconProps) {
  const normalized = icon?.trim().toLowerCase()
  const IconComponent =
    (normalized ? CHAPTER_ICONS[normalized] : undefined) ??
    (emoji ? EMOJI_ICON_FALLBACK[emoji.trim()] : undefined) ??
    BookOpen

  return (
    <IconComponent
      data-slot="chapter-icon"
      className={cn("size-4 shrink-0", className)}
      aria-hidden="true"
    />
  )
}
