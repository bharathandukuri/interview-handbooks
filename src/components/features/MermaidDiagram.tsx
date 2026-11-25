import { useEffect, useId, useRef, useState } from "react"
import { Check, Code2, Copy, Workflow } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { resolveTheme, useSettingsStore } from "@/store/useSettingsStore"

export interface MermaidDiagramProps {
  code: string
  title?: string
  className?: string
}

// Serialize mermaid.initialize + mermaid.render calls across components so
// concurrent theme/accent renders never race on global config.
let renderQueue: Promise<void> = Promise.resolve()

function enqueueMermaidRender(task: () => Promise<void>): Promise<void> {
  const next = renderQueue.then(task, task)
  renderQueue = next.then(
    () => undefined,
    () => undefined
  )
  return next
}

function readThemePalette() {
  const root = document.documentElement
  const styles = getComputedStyle(root)
  const get = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback

  const isDark =
    root.classList.contains("dark") || !root.classList.contains("light")

  return {
    isDark,
    bg: get("--bg", isDark ? "#0b0d12" : "#fafaf8"),
    surface: get("--surface", isDark ? "#11141b" : "#ffffff"),
    surface2: get("--surface-2", isDark ? "#171b24" : "#f3f4f6"),
    border: get("--border", isDark ? "#232836" : "#e5e7eb"),
    text: get("--text", isDark ? "#e8eaf0" : "#12141a"),
    textMuted: get("--text-muted", isDark ? "#9aa3b5" : "#5b6475"),
    accent: get("--accent", "#4a90e2"),
    accent2: get("--accent-2", "#ffd43b"),
    fontFamily: get(
      "--font-sans",
      '"Plus Jakarta Sans Variable", ui-sans-serif, system-ui, sans-serif'
    ),
  }
}

export function MermaidDiagram({
  code,
  title = "Diagram",
  className,
}: MermaidDiagramProps) {
  const rawId = useId()
  const diagramId = `ihb-mermaid-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`
  const themeSetting = useSettingsStore((s) => s.theme)
  const resolvedTheme = resolveTheme(themeSetting)

  const [themeRevision, setThemeRevision] = useState(0)
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [showSource, setShowSource] = useState(false)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  // Re-render diagram if root theme classes or handbook --accent styles change.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeRevision((n) => n + 1)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false

    enqueueMermaidRender(async () => {
      try {
        const { default: mermaid } = await import("mermaid")
        if (cancelled) return

        const palette = readThemePalette()
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: palette.fontFamily,
          themeVariables: {
            darkMode: palette.isDark,
            background: palette.surface,
            primaryColor: palette.surface2,
            primaryTextColor: palette.text,
            primaryBorderColor: palette.accent,
            secondaryColor: palette.surface,
            secondaryTextColor: palette.text,
            secondaryBorderColor: palette.accent2,
            tertiaryColor: palette.bg,
            tertiaryTextColor: palette.textMuted,
            tertiaryBorderColor: palette.border,
            lineColor: palette.accent,
            textColor: palette.text,
            mainBkg: palette.surface2,
            nodeBorder: palette.accent,
            clusterBkg: palette.surface,
            clusterBorder: palette.border,
            edgeLabelBackground: palette.surface,
            noteBkgColor: palette.surface2,
            noteTextColor: palette.text,
            noteBorderColor: palette.border,
            actorBkg: palette.surface2,
            actorBorder: palette.accent,
            actorTextColor: palette.text,
            signalColor: palette.accent,
            signalTextColor: palette.text,
            fontFamily: palette.fontFamily,
          },
        })

        const renderResult = await mermaid.render(
          `${diagramId}-${themeRevision}`,
          code.trim()
        )
        if (!cancelled) {
          setSvg(renderResult.svg)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to render Mermaid diagram"
          )
        }
      }
    })

    return () => {
      cancelled = true
    }
  }, [code, diagramId, resolvedTheme, themeRevision])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim())
      setCopied(true)
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
      timerRef.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard unavailable
    }
  }

  return (
    <figure
      data-slot="mermaid-diagram"
      className={cn(
        "my-3 overflow-hidden rounded-xl border border-border bg-surface-2/60",
        className
      )}
    >
      <figcaption className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5">
        <div className="flex items-center gap-2">
          <Workflow className="size-3.5 text-brand" aria-hidden="true" />
          <span className="text-xs font-semibold text-foreground">{title}</span>
          <span className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            mermaid
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                aria-pressed={showSource}
                onClick={() => setShowSource((v) => !v)}
                className={cn(
                  "gap-1 text-xs text-muted-foreground hover:text-foreground",
                  showSource && "bg-surface text-foreground"
                )}
              >
                <Code2 className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">
                  {showSource ? "Diagram" : "Source"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {showSource ? "Show rendered diagram" : "View Mermaid source"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                aria-label={
                  copied ? "Copied diagram source" : "Copy diagram source"
                }
                onClick={() => void handleCopy()}
                className="gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {copied ? (
                  <>
                    <Check
                      className="size-3.5 text-[var(--easy)]"
                      aria-hidden="true"
                    />
                    <span className="text-[var(--easy)]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Copy Mermaid source</TooltipContent>
          </Tooltip>
        </div>
      </figcaption>

      {showSource ? (
        <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-foreground">
          <code>{code.trim()}</code>
        </pre>
      ) : error ? (
        <div className="space-y-2 p-4 text-xs text-[var(--hard)]">
          <p className="font-medium">Mermaid render error: {error}</p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-foreground">
            <code>{code.trim()}</code>
          </pre>
        </div>
      ) : !svg ? (
        <div className="p-4">
          <Skeleton className="h-36 w-full rounded-lg" />
        </div>
      ) : (
        <div
          className="overflow-x-auto p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </figure>
  )
}
