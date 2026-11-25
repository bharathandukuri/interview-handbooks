import { useEffect, useState } from "react"
import type { Card } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TocSectionItem {
  id: string
  label: string
}

interface TocPanelProps {
  activeCard?: Card
}

function getSectionLabel(sectionId: string, card: Card): string {
  const key = sectionId.replace(/^section-/, "")
  switch (key) {
    case "answer":
      return "Answer"
    case "why":
      return card.type === "pitfall" ? "Why it happens" : "Why interviewers ask"
    case "followUps":
      return "Follow-ups"
    case "code":
      return "Code snippet"
    case "body":
      return "Concept"
    case "output":
      return "Output"
    case "explanation":
      return "Explanation"
    case "table":
      return `${String(card.meta.left ?? "Left")} vs ${String(card.meta.right ?? "Right")}`
    case "verdict":
      return "Verdict"
    case "trap":
      return "The trap"
    case "fix":
      return "The fix"
    case "problem":
      return "Problem"
    case "hint":
      return "Hints"
    case "solution":
      return "Solution"
    case "walkthrough":
      return "Walkthrough"
    default:
      return key
  }
}

function CardSectionsToc({ activeCard }: { activeCard: Card }) {
  const [sections, setSections] = useState<TocSectionItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const collectVisibleSections = (): TocSectionItem[] => {
      const container = document.querySelector("[data-card-reader]")
      if (!container) return []
      const nodes = [
        ...container.querySelectorAll<HTMLElement>('[id^="section-"]'),
      ].filter((el) => !el.closest("[hidden]"))

      return nodes
        .map((el) => ({
          id: el.id,
          label: getSectionLabel(el.id, activeCard),
        }))
        .filter(
          (item, index, list) =>
            list.findIndex((x) => x.id === item.id) === index
        )
    }

    let intersectionObserver: IntersectionObserver | null = null
    const bindIntersectionObserver = () => {
      intersectionObserver?.disconnect()
      const found = collectVisibleSections()
      setSections(found)
      if (found.length > 0) {
        setActiveId((prev) =>
          found.some((s) => s.id === prev) ? prev : found[0].id
        )
      }
      if (found.length === 0 || typeof IntersectionObserver === "undefined") {
        return
      }

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          if (visible[0]?.target.id) {
            setActiveId(visible[0].target.id)
          }
        },
        {
          rootMargin: "-84px 0px -55% 0px",
          threshold: [0, 0.25, 0.5],
        }
      )

      for (const item of found) {
        const el = document.getElementById(item.id)
        if (el) intersectionObserver.observe(el)
      }
    }

    const frameId = requestAnimationFrame(() => {
      bindIntersectionObserver()
    })

    const container = document.querySelector("[data-card-reader]")
    const mutationObserver =
      container && typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            bindIntersectionObserver()
          })
        : null

    if (container && mutationObserver) {
      mutationObserver.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["hidden", "data-state"],
      })
    }

    return () => {
      cancelAnimationFrame(frameId)
      intersectionObserver?.disconnect()
      mutationObserver?.disconnect()
    }
  }, [activeCard])

  if (sections.length === 0) return null

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (!el) return
    setActiveId(sectionId)
    const prefersReduced =
      document.documentElement.getAttribute("data-reduced-motion") === "true" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    })
  }

  return (
    <aside
      data-slot="toc-panel"
      aria-label="On this card"
      className="hidden w-48 shrink-0 xl:block"
    >
      <div className="sticky top-20 space-y-2">
        <div className="font-mono text-[11px] font-medium tracking-wider text-text-faint uppercase">
          On this card
        </div>
        <nav aria-label="Card sections">
          <ul className="space-y-1 border-l border-border pl-3">
            {sections.map((section) => {
              const isActive = activeId === section.id
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => handleScrollToSection(section.id)}
                    className={cn(
                      "w-full py-0.5 text-left text-xs transition-colors",
                      isActive
                        ? "font-medium text-brand"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {section.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export function TocPanel({ activeCard }: TocPanelProps) {
  if (!activeCard) return null
  return <CardSectionsToc key={activeCard.id} activeCard={activeCard} />
}
