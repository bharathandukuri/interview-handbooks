import { createElement, Fragment, useMemo, type ReactNode } from "react"
import { CodeBlock } from "@/components/features/CodeBlock"
import { MermaidDiagram } from "@/components/features/MermaidDiagram"
import { Callout } from "@/components/ui/callout"
import { Kbd } from "@/components/ui/kbd"
import type { DirectiveVariant } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RichContentProps {
  html: string
  className?: string
  codeTone?: "default" | "trap" | "fix"
  codeTitle?: string
}

const CALLOUT_VARIANTS = new Set<string>([
  "tip",
  "pitfall",
  "insight",
  "complexity",
])

const ALLOWED_TAGS = new Set<string>([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "strong",
  "b",
  "em",
  "i",
  "code",
  "pre",
  "blockquote",
  "a",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "hr",
  "br",
  "del",
  "span",
  "div",
])

function renderDomNode(
  node: ChildNode,
  key: string,
  options: { codeTone?: "default" | "trap" | "fix"; codeTitle?: string }
): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null
  }

  const el = node as Element
  const tag = el.tagName.toLowerCase()

  if (tag === "div" && el.hasAttribute("data-mermaid-diagram")) {
    const code = el.getAttribute("data-code") ?? el.textContent ?? ""
    return <MermaidDiagram key={key} code={code} />
  }

  if (
    (tag === "span" || tag === "div") &&
    (el.classList.contains("katex-display") || el.classList.contains("katex"))
  ) {
    return (
      <span
        key={key}
        className={el.className}
        dangerouslySetInnerHTML={{ __html: el.innerHTML }}
      />
    )
  }

  if (tag === "div" && el.hasAttribute("data-code-block")) {
    const lang = el.getAttribute("data-lang") ?? "text"
    const preHtml = el.innerHTML
    const rawCode = el.textContent ?? ""
    return (
      <CodeBlock
        key={key}
        html={preHtml}
        language={lang}
        rawCode={rawCode}
        tone={options.codeTone}
        title={options.codeTitle}
      />
    )
  }

  if (tag === "div" && el.hasAttribute("data-callout")) {
    const rawVariant = el.getAttribute("data-callout") ?? "tip"
    const variant: DirectiveVariant = CALLOUT_VARIANTS.has(rawVariant)
      ? (rawVariant as DirectiveVariant)
      : "tip"
    const title = el.getAttribute("data-callout-title") ?? undefined
    const children = Array.from(el.childNodes).map((child, idx) =>
      renderDomNode(child, `${key}-${idx}`, options)
    )
    return (
      <Callout key={key} variant={variant} title={title}>
        {children}
      </Callout>
    )
  }

  if (tag === "kbd") {
    return <Kbd key={key}>{el.textContent}</Kbd>
  }

  if (!ALLOWED_TAGS.has(tag)) {
    return null
  }

  if (tag === "br" || tag === "hr") {
    return createElement(tag, { key })
  }

  const props: Record<string, unknown> = { key }
  const classAttr = el.getAttribute("class")
  if (classAttr) props.className = classAttr
  if (tag === "a") {
    const href = el.getAttribute("href") ?? ""
    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("#") ||
      href.startsWith("/")
    ) {
      props.href = href
      if (href.startsWith("http")) {
        props.target = "_blank"
        props.rel = "noreferrer noopener"
      }
    }
  }
  if (tag === "td" || tag === "th") {
    const align = el.getAttribute("align")
    if (align) props.style = { textAlign: align }
  }

  const children = Array.from(el.childNodes).map((child, idx) =>
    renderDomNode(child, `${key}-${idx}`, options)
  )

  return createElement(tag, props, ...children)
}

export function RichContent({
  html,
  className,
  codeTone = "default",
  codeTitle,
}: RichContentProps) {
  const nodes = useMemo(() => {
    if (!html || typeof DOMParser === "undefined") return null
    const doc = new DOMParser().parseFromString(html, "text/html")
    return Array.from(doc.body.childNodes).map((child, idx) =>
      renderDomNode(child, `n-${idx}`, { codeTone, codeTitle })
    )
  }, [html, codeTone, codeTitle])

  if (!html) return null

  return (
    <div className={cn("prose-card max-w-none", className)}>
      {nodes ? (
        <Fragment>{nodes}</Fragment>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </div>
  )
}
