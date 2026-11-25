import { Link } from "@tanstack/react-router"
import { ArrowLeft, Compass, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getHandbooksMeta } from "@/lib/content"

interface NotFoundProps {
  title?: string
  message?: string
  handbookId?: string
}

export function NotFound({
  title = "Page not found",
  message = "The page, chapter, or card you requested does not exist in this handbook.",
  handbookId,
}: NotFoundProps) {
  const defaultHb = handbookId ?? getHandbooksMeta()[0]?.id

  return (
    <div
      data-slot="not-found"
      className="flex min-h-[60vh] items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-7 text-center shadow-(--shadow-card)">
        <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl border border-border bg-surface-2 text-brand">
          <Compass className="size-5" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {message}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {defaultHb ? (
            <Button asChild size="sm">
              <Link to="/$hb" params={{ hb: defaultHb }}>
                <Home className="size-4" aria-hidden="true" />
                <span>Handbook home</span>
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to="/">
                <Home className="size-4" aria-hidden="true" />
                <span>Go home</span>
              </Link>
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Go back</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
