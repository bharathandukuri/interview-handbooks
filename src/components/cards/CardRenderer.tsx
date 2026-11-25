import type { ReactNode } from "react"
import type { CardSharedProps } from "@/components/cards/CardShell"
import { CompareCard } from "@/components/cards/CompareCard"
import { ConceptCard } from "@/components/cards/ConceptCard"
import { PitfallCard } from "@/components/cards/PitfallCard"
import { PredictCard } from "@/components/cards/PredictCard"
import { ProblemCard } from "@/components/cards/ProblemCard"
import { QuestionCard } from "@/components/cards/QuestionCard"

export interface CardRendererProps extends CardSharedProps {
  defaultRevealed?: boolean
  diagramSlot?: ReactNode
}

export function CardRenderer({
  card,
  defaultRevealed,
  diagramSlot,
  ...sharedProps
}: CardRendererProps) {
  switch (card.type) {
    case "question":
      return (
        <QuestionCard
          card={card}
          defaultRevealed={defaultRevealed}
          {...sharedProps}
        />
      )
    case "concept":
      return (
        <ConceptCard card={card} diagramSlot={diagramSlot} {...sharedProps} />
      )
    case "predict":
      return (
        <PredictCard
          card={card}
          defaultRevealed={defaultRevealed}
          {...sharedProps}
        />
      )
    case "compare":
      return <CompareCard card={card} {...sharedProps} />
    case "pitfall":
      return <PitfallCard card={card} {...sharedProps} />
    case "problem":
      return (
        <ProblemCard
          card={card}
          defaultRevealed={defaultRevealed}
          {...sharedProps}
        />
      )
  }
}
