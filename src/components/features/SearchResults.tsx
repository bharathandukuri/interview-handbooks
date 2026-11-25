import {
  AlertTriangle,
  Code2,
  Columns2,
  Eye,
  HelpCircle,
  Lightbulb,
} from "lucide-react"
import { HighlightedText } from "@/components/features/HighlightedText"
import { Badge } from "@/components/ui/badge"
import { CommandGroup, CommandItem } from "@/components/ui/command"
import type { SearchMatchResult } from "@/lib/search"
import type { CardType, SearchEntry } from "@/lib/types"

export type SearchCardEntry = SearchEntry & {
  handbookId: string
  handbookName: string
}

interface SearchResultsProps {
  results: SearchMatchResult<SearchCardEntry>[]
  onSelect: (entry: SearchCardEntry) => void
  mode?: "command" | "list"
  heading?: string
}

const CARD_TYPE_ICONS: Record<CardType, typeof HelpCircle> = {
  question: HelpCircle,
  concept: Lightbulb,
  predict: Eye,
  compare: Columns2,
  pitfall: AlertTriangle,
  problem: Code2,
}

function ResultRowBody({
  result,
}: {
  result: SearchMatchResult<SearchCardEntry>
}) {
  const {
    item: card,
    titleSegments,
    chapterSegments,
    matchedTags,
    bodySnippet,
  } = result
  const Icon = CARD_TYPE_ICONS[card.type]

  return (
    <>
      <Icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center gap-2">
          <HighlightedText
            segments={titleSegments}
            className="min-w-0 flex-1 truncate"
          />
          <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
            <HighlightedText segments={chapterSegments} />
          </span>
          <Badge variant="outline" className="shrink-0 text-[10px] capitalize">
            {card.difficulty}
          </Badge>
        </div>

        {(bodySnippet || matchedTags.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {matchedTags.slice(0, 2).map((tag) => (
              <span
                key={tag.tag}
                className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px]"
              >
                #<HighlightedText segments={tag.segments} />
              </span>
            ))}
            {bodySnippet && (
              <span className="min-w-0 truncate text-[11px]">
                <HighlightedText segments={bodySnippet} />
              </span>
            )}
          </div>
        )}
      </div>
    </>
  )
}

/**
 * Reusable search results list supporting both cmdk palette items and standalone lists.
 */
export function SearchResults({
  results,
  onSelect,
  mode = "command",
  heading = "Cards",
}: SearchResultsProps) {
  if (results.length === 0) return null

  if (mode === "list") {
    return (
      <div className="space-y-1" role="list" aria-label={heading}>
        {results.map((result) => (
          <button
            key={result.item.id}
            type="button"
            onClick={() => onSelect(result.item)}
            className="flex w-full items-start gap-2.5 rounded-lg border border-transparent px-3 py-2 text-left text-sm transition-colors hover:border-border hover:bg-muted/60"
          >
            <ResultRowBody result={result} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <CommandGroup heading={heading}>
      {results.map((result) => (
        <CommandItem
          key={result.item.id}
          value={result.item.id}
          onSelect={() => onSelect(result.item)}
          className="items-start py-2"
        >
          <ResultRowBody result={result} />
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
