import { splitInlineCode } from "@/lib/text"

interface InlineCodeTitleProps {
  text: string
  className?: string
}

export function InlineCodeTitle({ text, className }: InlineCodeTitleProps) {
  const segments = splitInlineCode(text)

  return (
    <span className={className}>
      {segments.map((seg, idx) =>
        seg.isCode ? (
          <code
            key={idx}
            className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.88em] font-medium"
          >
            {seg.text}
          </code>
        ) : (
          <span key={idx}>{seg.text}</span>
        )
      )}
    </span>
  )
}
