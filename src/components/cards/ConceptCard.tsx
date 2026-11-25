import type { ReactNode } from "react"
import { CardShell, type CardSharedProps } from "@/components/cards/CardShell"
import { RichContent } from "@/components/features/RichContent"

export interface ConceptCardProps extends CardSharedProps {
  diagramSlot?: ReactNode
}

export function ConceptCard({
  card,
  diagramSlot,
  ...shellProps
}: ConceptCardProps) {
  return (
    <CardShell {...shellProps} card={card}>
      {diagramSlot && (
        <div
          data-slot="concept-diagram"
          className="rounded-xl border border-border bg-surface-2 p-4"
        >
          {diagramSlot}
        </div>
      )}
      <div id="section-body">
        <RichContent html={card.sections.body ?? ""} />
      </div>
    </CardShell>
  )
}
