import type { HighlightSegment } from "@/lib/search"

interface HighlightedTextProps {
  segments: HighlightSegment[]
  className?: string
}

/**
 * Renders highlighted text segments returned by the Fuse search utilities.
 */
export function HighlightedText({ segments, className }: HighlightedTextProps) {
  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.highlighted ? (
          <mark
            key={index}
            className="rounded-xs bg-[var(--accent-soft)] px-0.5 font-semibold text-brand"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </span>
  )
}
