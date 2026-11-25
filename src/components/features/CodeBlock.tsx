import { useEffect, useRef, useState, type ReactNode } from "react"
import { Check, Copy, WrapText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface CodeBlockProps {
  html: string
  language?: string
  rawCode?: string
  outputHtml?: string
  title?: string
  tone?: "default" | "trap" | "fix"
  showLineNumbers?: boolean
  footerSlot?: ReactNode
  className?: string
}

export function CodeBlock({
  html,
  language = "text",
  rawCode,
  outputHtml,
  title,
  tone = "default",
  showLineNumbers = true,
  footerSlot,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [wrapped, setWrapped] = useState(false)
  const codeContainerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    const text =
      rawCode ??
      codeContainerRef.current?.querySelector("pre")?.textContent ??
      codeContainerRef.current?.textContent ??
      ""
    if (!text) return
    try {
      await navigator.clipboard.writeText(text.replace(/\n$/, ""))
      setCopied(true)
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
      timerRef.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard unavailable in restricted contexts
    }
  }

  const toneContainerClass =
    tone === "trap"
      ? "border-[color-mix(in_srgb,var(--hard)_40%,transparent)] bg-[color-mix(in_srgb,var(--hard-soft)_55%,var(--surface-2))]"
      : tone === "fix"
        ? "border-[color-mix(in_srgb,var(--easy)_40%,transparent)] bg-[color-mix(in_srgb,var(--easy-soft)_55%,var(--surface-2))]"
        : "border-border bg-surface-2"

  const toneHeaderClass =
    tone === "trap"
      ? "border-[color-mix(in_srgb,var(--hard)_25%,transparent)]"
      : tone === "fix"
        ? "border-[color-mix(in_srgb,var(--easy)_25%,transparent)]"
        : "border-border"

  return (
    <div
      data-slot="code-block"
      data-tone={tone}
      data-line-numbers={showLineNumbers ? "true" : "false"}
      className={cn(
        "my-3 overflow-hidden rounded-xl border",
        toneContainerClass,
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2 border-b px-3 py-1.5",
          toneHeaderClass
        )}
      >
        <div className="flex items-center gap-2">
          {title && (
            <span
              className={cn(
                "text-xs font-semibold",
                tone === "trap" && "text-[var(--hard)]",
                tone === "fix" && "text-[var(--easy)]",
                tone === "default" && "text-foreground"
              )}
            >
              {title}
            </span>
          )}
          <span className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={wrapped ? "Disable line wrapping" : "Wrap lines"}
                aria-pressed={wrapped}
                onClick={() => setWrapped((v) => !v)}
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  wrapped && "bg-surface text-foreground"
                )}
              >
                <WrapText className="size-3.5" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {wrapped ? "Unwrap lines" : "Wrap lines"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                aria-label={copied ? "Copied code" : "Copy code"}
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
            <TooltipContent side="top">
              {copied ? "Copied!" : "Copy snippet"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div
        ref={codeContainerRef}
        className={cn(
          "overflow-x-auto p-3.5 [&_pre]:m-0 [&_pre]:bg-transparent! [&_pre]:p-0 [&_pre]:font-mono [&_pre]:text-[length:var(--text-sm)] [&_pre]:leading-relaxed [&_pre]:outline-none",
          wrapped &&
            "[&_code]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:whitespace-pre-wrap"
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {outputHtml && (
        <div className="border-t border-border bg-surface px-3.5 py-2.5">
          <div className="mb-1 font-mono text-[11px] font-medium tracking-wider text-text-faint uppercase">
            Output
          </div>
          <div
            className="overflow-x-auto font-mono text-[length:var(--text-sm)] leading-relaxed text-foreground [&_pre]:m-0 [&_pre]:bg-transparent! [&_pre]:p-0"
            dangerouslySetInnerHTML={{ __html: outputHtml }}
          />
        </div>
      )}

      {footerSlot && (
        <div className="border-t border-border bg-surface px-3 py-2">
          {footerSlot}
        </div>
      )}
    </div>
  )
}
