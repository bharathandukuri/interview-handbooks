import { useEffect, useState } from "react"
import { useFormatForDisplay } from "@tanstack/react-hotkeys"
import { Link } from "@tanstack/react-router"
import { ArrowUpRight, Compass, Keyboard, ListTree } from "lucide-react"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { Kbd } from "@/components/ui/kbd"
import { getRelatedCardsInfo } from "@/lib/selectors"
import type { Card, HandbookBundle } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TocSectionItem {
  id: string
  label: string
}

interface TocPanelProps {
  bundle: HandbookBundle
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
    const collectSections = (): TocSectionItem[] => {
      const container = document.querySelector("[data-card-reader]")
      if (!container) return []
      const nodes = [
        ...container.querySelectorAll<HTMLElement>('[id^="section-"]'),
      ]
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
      const found = collectSections()
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
      mutationObserver.observe(container, { childList: true, subtree: true })
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
    <section className="rounded-xl border border-border bg-surface p-3.5">
      <div className="mb-2.5 flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wider text-text-faint uppercase">
        <ListTree className="size-3.5 text-brand" aria-hidden="true" />
        <span>On this card</span>
      </div>
      <nav aria-label="Card sections">
        <ul className="space-y-1 border-l border-border pl-2.5">
          {sections.map((section) => {
            const isActive = activeId === section.id
            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => handleScrollToSection(section.id)}
                  className={cn(
                    "w-full rounded-md px-2 py-1 text-left text-xs transition-colors",
                    isActive
                      ? "bg-[var(--accent-soft)] font-medium text-brand"
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
    </section>
  )
}

export function TocPanel({ bundle, activeCard }: TocPanelProps) {
  const formatForDisplay = useFormatForDisplay()
  const relatedCards = activeCard
    ? getRelatedCardsInfo(activeCard, bundle.cards)
    : []
  const cardsById = new Map(bundle.cards.map((c) => [c.id, c]))

  return (
    <aside
      data-slot="toc-panel"
      aria-label="On this page"
      className="hidden w-(--toc-width) shrink-0 xl:block"
    >
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-5 overflow-y-auto pr-1">
        {activeCard ? (
          <>
            <CardSectionsToc key={activeCard.id} activeCard={activeCard} />

            {relatedCards.length > 0 && (
              <section className="rounded-xl border border-border bg-surface p-3.5">
                <div className="mb-2.5 flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wider text-text-faint uppercase">
                  <Compass className="size-3.5 text-brand" aria-hidden="true" />
                  <span>Related cards</span>
                </div>
                <ul className="space-y-2">
                  {relatedCards.map((rel) => {
                    const target = cardsById.get(rel.id)
                    return (
                      <li key={rel.id}>
                        <Link
                          to="/$hb/t/$cardId"
                          params={{ hb: bundle.handbook.id, cardId: rel.id }}
                          className="group flex flex-col gap-1 rounded-lg border border-border bg-surface-2/60 p-2.5 text-xs transition-colors hover:border-[var(--accent-ring)]"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="font-medium text-foreground group-hover:text-brand">
                              {rel.title}
                            </span>
                            <ArrowUpRight
                              className="size-3.5 shrink-0 text-text-faint group-hover:text-brand"
                              aria-hidden="true"
                            />
                          </div>
                          {target && (
                            <DifficultyBadge
                              difficulty={target.difficulty}
                              className="w-fit px-1.5 py-0 text-[10px]"
                            />
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}
          </>
        ) : (
          <section className="rounded-xl border border-border bg-surface p-3.5">
            <div className="mb-2.5 flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wider text-text-faint uppercase">
              <Compass className="size-3.5 text-brand" aria-hidden="true" />
              <span>Chapters</span>
            </div>
            <ul className="space-y-1">
              {bundle.handbook.chapters.map((ch) => (
                <li key={ch.slug}>
                  <Link
                    to="/$hb/c/$chapter"
                    params={{ hb: bundle.handbook.id, chapter: ch.slug }}
                    className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                  >
                    <span className="truncate">
                      {ch.emoji} {ch.title}
                    </span>
                    <span className="font-mono text-[11px] text-text-faint">
                      {ch.cardCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-xl border border-border bg-surface p-3.5">
          <div className="mb-2.5 flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wider text-text-faint uppercase">
            <Keyboard className="size-3.5 text-brand" aria-hidden="true" />
            <span>Shortcuts</span>
          </div>
          <dl className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <dt>Search</dt>
              <dd>
                <Kbd>{formatForDisplay("Mod+K")}</Kbd>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Theme</dt>
              <dd>
                <Kbd>{formatForDisplay("D")}</Kbd>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Home</dt>
              <dd>
                <Kbd>{formatForDisplay(["G", "H"])}</Kbd>
              </dd>
            </div>
            {activeCard && (
              <>
                <div className="flex items-center justify-between">
                  <dt>Reveal</dt>
                  <dd>
                    <Kbd>{formatForDisplay("Space")}</Kbd>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Known / Revisit</dt>
                  <dd className="inline-flex items-center gap-1">
                    <Kbd>{formatForDisplay("K")}</Kbd>
                    <Kbd>{formatForDisplay("R")}</Kbd>
                  </dd>
                </div>
              </>
            )}
          </dl>
        </section>
      </div>
    </aside>
  )
}
