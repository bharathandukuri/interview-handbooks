import { Link } from "@tanstack/react-router"
import { ArrowRight, BookOpen, Layers } from "lucide-react"
import { ThemeToggle } from "@/components/features/ThemeToggle"
import { HandbookIcon } from "@/components/ui/handbook-icon"
import { getHandbooksMeta, loadHandbookBundle } from "@/lib/content"

export function HandbookPicker() {
  const handbooks = getHandbooksMeta()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-6">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-brand" aria-hidden="true" />
            <span className="font-heading text-sm font-semibold tracking-tight">
              Interview Handbooks
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <div className="mb-8 space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Choose a handbook
          </h1>
          <p className="text-sm text-muted-foreground">
            Card-first interview prep. Pick a track to begin studying.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {handbooks.map((hb) => (
            <Link
              key={hb.id}
              to="/$hb"
              params={{ hb: hb.id }}
              onMouseEnter={() => {
                void loadHandbookBundle(hb.id)
              }}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card) transition-all duration-(--duration-base) hover:border-[var(--accent-ring)] hover:shadow-(--shadow-card-hover)"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <HandbookIcon
                    icon={hb.icon}
                    iconSvg={hb.iconSvg}
                    accent={hb.accent}
                    className="size-10 rounded-xl"
                    iconClassName="size-6"
                  />
                  <ArrowRight
                    className="size-4 text-text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="font-heading text-xl font-semibold tracking-tight">
                  {hb.name}
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {hb.tagline}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 font-mono text-xs text-text-faint">
                <BookOpen className="size-3.5" aria-hidden="true" />
                <span>
                  {hb.chapterCount} chapters · {hb.cardCount} cards
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
