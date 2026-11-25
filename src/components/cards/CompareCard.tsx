import { Sparkles } from "lucide-react"
import { CardShell, type CardSharedProps } from "@/components/cards/CardShell"
import { RichContent } from "@/components/features/RichContent"

export function CompareCard({ card, ...shellProps }: CardSharedProps) {
  const leftName =
    typeof card.meta.left === "string" ? card.meta.left : "Option A"
  const rightName =
    typeof card.meta.right === "string" ? card.meta.right : "Option B"

  const headers = Array.isArray(card.meta.tableHeaders)
    ? (card.meta.tableHeaders as string[])
    : null
  const rows = Array.isArray(card.meta.tableRows)
    ? (card.meta.tableRows as string[][])
    : null

  const hasThreeCols =
    headers !== null && headers.length === 3 && rows !== null && rows.length > 0
  const hasTwoCols =
    headers !== null && headers.length === 2 && rows !== null && rows.length > 0

  return (
    <CardShell {...shellProps} card={card}>
      {card.sections.intro && <RichContent html={card.sections.intro} />}

      <div
        id="section-table"
        className="overflow-x-auto rounded-xl border border-border bg-surface-2/40"
      >
        {hasThreeCols || hasTwoCols ? (
          <table className="w-full min-w-[460px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {hasThreeCols && (
                  <th className="w-1/4 px-4 py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    <RichContent
                      html={headers[0] ?? ""}
                      className="text-xs [&_p]:m-0"
                    />
                  </th>
                )}
                <th
                  className="px-4 py-3 font-heading text-sm font-semibold text-foreground"
                  style={{
                    backgroundColor: "var(--accent-soft)",
                    borderTop: "2px solid var(--accent)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: "var(--accent)" }}
                      aria-hidden="true"
                    />
                    <span>{leftName}</span>
                  </div>
                </th>
                <th
                  className="px-4 py-3 font-heading text-sm font-semibold text-foreground"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--accent-2) 12%, transparent)",
                    borderTop: "2px solid var(--accent-2)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: "var(--accent-2)" }}
                      aria-hidden="true"
                    />
                    <span>{rightName}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((cells, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="transition-colors hover:bg-surface-2/60"
                >
                  {hasThreeCols && (
                    <td className="px-4 py-3 align-top font-medium text-muted-foreground">
                      <RichContent
                        html={cells[0] ?? ""}
                        className="text-sm [&_p]:m-0"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 align-top">
                    <RichContent
                      html={cells[hasThreeCols ? 1 : 0] ?? ""}
                      className="text-sm [&_p]:m-0"
                    />
                  </td>
                  <td className="px-4 py-3 align-top">
                    <RichContent
                      html={cells[hasThreeCols ? 2 : 1] ?? ""}
                      className="text-sm [&_p]:m-0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4">
            <RichContent html={card.sections.table ?? ""} />
          </div>
        )}
      </div>

      {card.sections.verdict && (
        <div
          id="section-verdict"
          className="rounded-xl border border-l-3 border-border px-4 py-3"
          style={{
            borderLeftColor: "var(--accent)",
            backgroundColor: "var(--accent-soft)",
          }}
        >
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-brand uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Verdict</span>
          </div>
          <RichContent
            html={card.sections.verdict}
            className="text-sm [&>p]:my-1"
          />
        </div>
      )}
    </CardShell>
  )
}
