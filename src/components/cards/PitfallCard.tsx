import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { CardShell, type CardSharedProps } from "@/components/cards/CardShell"
import { RichContent } from "@/components/features/RichContent"

export function PitfallCard({ card, ...shellProps }: CardSharedProps) {
  return (
    <CardShell {...shellProps} card={card}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section
          id="section-trap"
          aria-label="The trap"
          className="rounded-xl border p-3.5"
          style={{
            borderColor: "color-mix(in srgb, var(--hard) 35%, transparent)",
            backgroundColor:
              "color-mix(in srgb, var(--hard-soft) 50%, transparent)",
          }}
        >
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[var(--hard)] uppercase">
            <AlertTriangle className="size-3.5" aria-hidden="true" />
            <span>The trap</span>
          </div>
          <RichContent
            html={card.sections.trap ?? ""}
            codeTone="trap"
            codeTitle="Trap"
            className="[&_[data-slot=code-block]]:my-0"
          />
        </section>

        <section
          id="section-fix"
          aria-label="The fix"
          className="rounded-xl border p-3.5"
          style={{
            borderColor: "color-mix(in srgb, var(--easy) 35%, transparent)",
            backgroundColor:
              "color-mix(in srgb, var(--easy-soft) 50%, transparent)",
          }}
        >
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[var(--easy)] uppercase">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            <span>The fix</span>
          </div>
          <RichContent
            html={card.sections.fix ?? ""}
            codeTone="fix"
            codeTitle="Fix"
            className="[&_[data-slot=code-block]]:my-0"
          />
        </section>
      </div>

      {card.sections.why && (
        <section id="section-why" className="space-y-1.5 pt-1">
          <h3 className="text-xs font-semibold tracking-wider text-brand uppercase">
            Why it happens
          </h3>
          <RichContent html={card.sections.why} />
        </section>
      )}
    </CardShell>
  )
}
