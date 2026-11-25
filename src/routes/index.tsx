import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRight, BookOpen, Layers } from "lucide-react"
import { ThemeToggle } from "@/components/features/ThemeToggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getHandbooksMeta, loadHandbookBundle } from "@/lib/content"

export const Route = createFileRoute("/")({
  component: FoundationHome,
})

function FoundationHome() {
  const handbooks = getHandbooksMeta()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-brand" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-tight">
              Interview Handbooks
            </span>
            <Badge variant="outline" className="font-mono text-[11px]">
              M1 Pipeline Ready
            </Badge>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-2xl border border-border bg-surface p-8 shadow-(--shadow-card)">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted-foreground">
            <BookOpen className="size-3.5 text-brand" aria-hidden="true" />
            <span>{handbooks.length} handbook loaded from content/</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Interview Handbook Template
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Build-time markdown compilation, Zod schema validation, Shiki
            dual-theme highlighting, and virtual handbook chunks are active.
          </p>

          <div className="mt-5 space-y-3">
            {handbooks.map((hb) => (
              <div
                key={hb.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface-2 p-4"
                onMouseEnter={() => {
                  void loadHandbookBundle(hb.id)
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: hb.accent }}
                      aria-hidden="true"
                    />
                    <span className="font-medium">{hb.name}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {hb.tagline}
                  </p>
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  {hb.chapterCount} ch · {hb.cardCount} cards
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {import.meta.env.DEV && (
              <Button asChild>
                <Link to="/_kit">
                  Open /#/_kit Token Palette
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
