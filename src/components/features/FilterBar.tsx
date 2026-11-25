import { ArrowUpDown, ChevronDown, Flame, RotateCcw, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { CardFilterSearch } from "@/lib/search-params"
import type { Difficulty } from "@/lib/types"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  filters: CardFilterSearch
  availableTags: string[]
  totalCount: number
  visibleCount: number
  onChange: (next: CardFilterSearch) => void
}

const DIFFICULTIES: Array<{ value: Difficulty; label: string; dot: string }> = [
  { value: "easy", label: "Easy", dot: "bg-[var(--easy)]" },
  { value: "medium", label: "Medium", dot: "bg-[var(--medium)]" },
  { value: "hard", label: "Hard", dot: "bg-[var(--hard)]" },
]

const STATUS_LABELS: Record<string, string> = {
  all: "All statuses",
  untouched: "Untouched",
  revisit: "Revisit",
  known: "Known",
}

const SORT_LABELS: Record<string, string> = {
  order: "Default order",
  difficulty: "Difficulty",
  alpha: "Title (A–Z)",
}

export function cleanSearchParams(next: CardFilterSearch): CardFilterSearch {
  return {
    difficulty: next.difficulty,
    tag: next.tag || undefined,
    status: next.status && next.status !== "all" ? next.status : undefined,
    mostAsked: next.mostAsked ? true : undefined,
    sort: next.sort && next.sort !== "order" ? next.sort : undefined,
  }
}

export function FilterBar({
  filters,
  availableTags,
  totalCount,
  visibleCount,
  onChange,
}: FilterBarProps) {
  const selectedTags = filters.tag
    ? filters.tag
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : []

  const activeStatus = filters.status ?? "all"
  const activeSort = filters.sort ?? "order"
  const hasActiveFilters = Boolean(
    filters.difficulty ||
    selectedTags.length > 0 ||
    (filters.status && filters.status !== "all") ||
    filters.mostAsked ||
    (filters.sort && filters.sort !== "order")
  )

  const handleToggleTag = (tag: string, checked: boolean) => {
    const nextSet = new Set(selectedTags)
    if (checked) {
      nextSet.add(tag)
    } else {
      nextSet.delete(tag)
    }
    const serialized = Array.from(nextSet).join(",")
    onChange(
      cleanSearchParams({
        ...filters,
        tag: serialized.length > 0 ? serialized : undefined,
      })
    )
  }

  return (
    <div
      data-slot="filter-bar"
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-3 shadow-(--shadow-card)"
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* Difficulty chips */}
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="Filter by difficulty"
          value={filters.difficulty ?? ""}
          onValueChange={(value) =>
            onChange(
              cleanSearchParams({
                ...filters,
                difficulty: value ? (value as Difficulty) : undefined,
              })
            )
          }
        >
          {DIFFICULTIES.map((item) => (
            <ToggleGroupItem
              key={item.value}
              value={item.value}
              className="gap-1.5 px-2.5 text-xs data-[state=on]:bg-surface-2 data-[state=on]:text-foreground"
            >
              <span
                className={cn("size-1.5 rounded-full", item.dot)}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {/* Multi-select Tags dropdown */}
        {availableTags.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant={selectedTags.length > 0 ? "secondary" : "outline"}
                size="sm"
                className="h-8 gap-1.5 px-2.5 text-xs"
              >
                <Tag
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>
                  {selectedTags.length === 0
                    ? "Tags"
                    : selectedTags.length === 1
                      ? `#${selectedTags[0]}`
                      : `Tags (${selectedTags.length})`}
                </span>
                <ChevronDown
                  className="size-3 text-muted-foreground"
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filter by tags</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableTags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={(checked) =>
                    handleToggleTag(tag, checked === true)
                  }
                >
                  <span className="font-mono text-xs">#{tag}</span>
                </DropdownMenuCheckboxItem>
              ))}
              {selectedTags.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={false}
                    onCheckedChange={() =>
                      onChange(
                        cleanSearchParams({ ...filters, tag: undefined })
                      )
                    }
                  >
                    <span className="text-xs text-muted-foreground">
                      Clear tags
                    </span>
                  </DropdownMenuCheckboxItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Status filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant={activeStatus !== "all" ? "secondary" : "outline"}
              size="sm"
              className="h-8 gap-1.5 px-2.5 text-xs"
            >
              <span>{STATUS_LABELS[activeStatus]}</span>
              <ChevronDown
                className="size-3 text-muted-foreground"
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuLabel>Study status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={activeStatus}
              onValueChange={(value) =>
                onChange(
                  cleanSearchParams({
                    ...filters,
                    status: value as CardFilterSearch["status"],
                  })
                )
              }
            >
              <DropdownMenuRadioItem value="all">
                All statuses
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="untouched">
                Untouched
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="revisit">
                Revisit
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="known">Known</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Most asked toggle */}
        <Button
          type="button"
          variant={filters.mostAsked ? "secondary" : "outline"}
          size="sm"
          aria-pressed={Boolean(filters.mostAsked)}
          onClick={() =>
            onChange(
              cleanSearchParams({
                ...filters,
                mostAsked: filters.mostAsked ? undefined : true,
              })
            )
          }
          className={cn(
            "h-8 gap-1.5 px-2.5 text-xs",
            filters.mostAsked &&
              "border-[color-mix(in_srgb,var(--accent-2)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent-2)_14%,transparent)] text-foreground"
          )}
        >
          <Flame
            className={cn(
              "size-3.5",
              filters.mostAsked
                ? "text-[var(--medium)]"
                : "text-muted-foreground"
            )}
            aria-hidden="true"
          />
          <span>Most asked</span>
        </Button>

        {/* Sort selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant={activeSort !== "order" ? "secondary" : "outline"}
              size="sm"
              className="h-8 gap-1.5 px-2.5 text-xs"
            >
              <ArrowUpDown
                className="size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              <span>{SORT_LABELS[activeSort]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuLabel>Sort cards</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={activeSort}
              onValueChange={(value) =>
                onChange(
                  cleanSearchParams({
                    ...filters,
                    sort: value as CardFilterSearch["sort"],
                  })
                )
              }
            >
              <DropdownMenuRadioItem value="order">
                Default order
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="difficulty">
                Difficulty
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="alpha">
                Title (A–Z)
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-text-faint tabular-nums">
          {visibleCount}/{totalCount}
        </span>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onChange({})}
            className="gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  )
}
