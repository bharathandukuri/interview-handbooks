import { useEffect, useRef, useState, type ReactNode } from "react"
import { useHotkey } from "@tanstack/react-hotkeys"
import {
  AlertTriangle,
  Bookmark,
  Check,
  Code2,
  Columns2,
  Eye,
  Flame,
  HelpCircle,
  Lightbulb,
  Link2,
} from "lucide-react"
import { StatusToggle } from "@/components/features/StatusToggle"
import { Button } from "@/components/ui/button"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { InlineCodeTitle } from "@/components/ui/inline-code-title"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Card, CardStatus, CardType, RelatedCardInfo } from "@/lib/types"
import { cn } from "@/lib/utils"

export interface CardSharedProps {
  card: Card
  status?: CardStatus
  bookmarked?: boolean
  revealed?: boolean
  relatedCards?: RelatedCardInfo[]
  enableGlobalHotkeys?: boolean
  headingAs?: "h1" | "h2"
  onStatusChange?: (nextStatus: CardStatus | undefined) => void
  onToggleBookmark?: () => void
  onRevealChange?: (revealed: boolean) => void
  onShare?: (card: Card) => void
  onSelectRelated?: (cardId: string) => void
  className?: string
}

interface CardShellProps extends Omit<
  CardSharedProps,
  "revealed" | "onRevealChange"
> {
  children: ReactNode
  onRevealKey?: () => void
}

const TYPE_META: Record<CardType, { label: string; icon: typeof HelpCircle }> =
  {
    question: { label: "Question", icon: HelpCircle },
    concept: { label: "Concept", icon: Lightbulb },
    predict: { label: "Predict output", icon: Eye },
    compare: { label: "Compare", icon: Columns2 },
    pitfall: { label: "Pitfall", icon: AlertTriangle },
    problem: { label: "Coding problem", icon: Code2 },
  }

function formatFallbackTitle(cardId: string): string {
  const slug = cardId.split(".").pop() ?? cardId
  return slug.replace(/-/g, " ")
}

export function CardShell({
  card,
  status,
  bookmarked = false,
  relatedCards,
  enableGlobalHotkeys = false,
  onStatusChange,
  onToggleBookmark,
  onShare,
  onSelectRelated,
  onRevealKey,
  headingAs = "h2",
  className,
  children,
}: CardShellProps) {
  const cardRef = useRef<HTMLElement>(null)
  const [sharedCopied, setSharedCopied] = useState(false)
  const shareTimerRef = useRef<number | null>(null)
  const typeInfo = TYPE_META[card.type]
  const TypeIcon = typeInfo.icon
  const Heading = headingAs

  useEffect(() => {
    return () => {
      if (shareTimerRef.current !== null) {
        window.clearTimeout(shareTimerRef.current)
      }
    }
  }, [])

  const targetOption = enableGlobalHotkeys ? {} : { target: cardRef }

  useHotkey(
    "K",
    () => {
      onStatusChange?.(status === "known" ? undefined : "known")
    },
    {
      ...targetOption,
      ignoreInputs: true,
      enabled: Boolean(onStatusChange),
    }
  )

  useHotkey(
    "R",
    () => {
      onStatusChange?.(status === "revisit" ? undefined : "revisit")
    },
    {
      ...targetOption,
      ignoreInputs: true,
      enabled: Boolean(onStatusChange),
    }
  )

  useHotkey(
    "Space",
    () => {
      onRevealKey?.()
    },
    {
      ...targetOption,
      ignoreInputs: true,
      preventDefault: true,
      enabled: Boolean(onRevealKey),
    }
  )

  const handleShare = async () => {
    if (onShare) {
      onShare(card)
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href)
      } catch {
        // Ignore clipboard errors
      }
    }
    setSharedCopied(true)
    if (shareTimerRef.current !== null) {
      window.clearTimeout(shareTimerRef.current)
    }
    shareTimerRef.current = window.setTimeout(
      () => setSharedCopied(false),
      1800
    )
  }

  const resolvedRelated: RelatedCardInfo[] =
    relatedCards ??
    card.related.map((id) => ({
      id,
      title: formatFallbackTitle(id),
    }))

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      aria-label={card.title}
      data-slot="card-shell"
      data-card-type={card.type}
      className={cn(
        "rounded-2xl border border-border bg-surface p-4 shadow-(--shadow-card) transition-shadow duration-(--duration-base) ease-(--ease-standard) outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] sm:p-5",
        className
      )}
    >
      {/* Header */}
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground/85">
              <TypeIcon className="size-3.5 text-brand" aria-hidden="true" />
              <span>{typeInfo.label}</span>
            </span>
            <span className="text-border" aria-hidden="true">
              ·
            </span>
            <span className="text-text-faint">{card.readTime} min</span>
            {card.mostAsked && (
              <>
                <span className="text-border" aria-hidden="true">
                  ·
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-[var(--medium)]">
                  <Flame className="size-3" aria-hidden="true" />
                  <span>Most asked</span>
                </span>
              </>
            )}
          </div>

          <DifficultyBadge difficulty={card.difficulty} />
        </div>

        <Heading className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          <InlineCodeTitle text={card.title} />
        </Heading>

        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[11px] text-text-faint">
            {card.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </header>

      {/* Body slot */}
      <div className="mt-4 space-y-4 border-t border-border/70 pt-4">
        {children}
      </div>

      {/* Footer */}
      <footer className="mt-5 space-y-2.5 border-t border-border/70 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusToggle
            status={status}
            onChange={(next) => onStatusChange?.(next)}
          />

          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={bookmarked ? "secondary" : "ghost"}
                  size="sm"
                  aria-pressed={bookmarked}
                  aria-label={bookmarked ? "Remove bookmark" : "Bookmark card"}
                  onClick={onToggleBookmark}
                  className={cn(
                    "gap-1.5 text-xs",
                    bookmarked ? "text-brand" : "text-muted-foreground"
                  )}
                >
                  <Bookmark
                    className={cn("size-3.5", bookmarked && "fill-current")}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">
                    {bookmarked ? "Saved" : "Bookmark"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {bookmarked ? "Remove bookmark" : "Save for later"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Copy share link"
                  onClick={() => void handleShare()}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {sharedCopied ? (
                    <>
                      <Check
                        className="size-3.5 text-[var(--easy)]"
                        aria-hidden="true"
                      />
                      <span className="text-[var(--easy)]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="size-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">Share</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Copy card link</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {resolvedRelated.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-faint">
            <span className="font-medium">Related:</span>
            {resolvedRelated.map((rel, idx) => (
              <span key={rel.id} className="inline-flex items-center gap-2">
                {idx > 0 && <span aria-hidden="true">·</span>}
                <button
                  type="button"
                  onClick={() => onSelectRelated?.(rel.id)}
                  className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors duration-(--duration-fast) hover:text-brand hover:decoration-brand"
                >
                  {rel.title.replace(/`([^`]+)`/g, "$1")}
                </button>
              </span>
            ))}
          </div>
        )}
      </footer>
    </article>
  )
}
