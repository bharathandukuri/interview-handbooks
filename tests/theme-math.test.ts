import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const readWorkspaceFile = (relPath: string): string =>
  fs.readFileSync(path.resolve(process.cwd(), relPath), "utf8")

describe("theme-matched scrollbars and KaTeX CSS tokens", () => {
  it("styles global and WebKit scrollbars exclusively with theme tokens", () => {
    const baseCss = readWorkspaceFile("src/styles/base.css")

    expect(baseCss).toContain("scrollbar-width: thin;")
    expect(baseCss).toContain("scrollbar-color: var(--border) transparent;")
    expect(baseCss).toContain("::-webkit-scrollbar-thumb")
    expect(baseCss).toContain("background-color: var(--border);")
    expect(baseCss).toContain("background-color: var(--text-faint);")
    expect(baseCss).toContain("background-color: var(--accent);")
    expect(baseCss).toContain('@import "katex/dist/katex.min.css";')
  })

  it("uses theme tokens on Radix ScrollArea scrollbar thumb", () => {
    const scrollArea = readWorkspaceFile("src/components/ui/scroll-area.tsx")

    expect(scrollArea).toContain("bg-border")
    expect(scrollArea).toContain("hover:bg-text-faint")
    expect(scrollArea).toContain("active:bg-brand")
  })

  it("themes KaTeX inline and block display styles via CSS variables", () => {
    const proseCss = readWorkspaceFile("src/styles/prose.css")

    expect(proseCss).toContain(".katex {")
    expect(proseCss).toContain("color: var(--text);")
    expect(proseCss).toContain(".katex-display {")
    expect(proseCss).toContain("background-color: var(--surface-2);")
    expect(proseCss).toContain("border: 1px solid var(--border);")
    expect(proseCss).toContain("border-radius: var(--radius-md);")
  })

  it("defines distinct dark and light palette values for scrollbar and math tokens", () => {
    const tokensCss = readWorkspaceFile("src/styles/tokens.css")

    expect(tokensCss).toContain("color-scheme: dark;")
    expect(tokensCss).toContain("color-scheme: light;")
    expect(tokensCss).toMatch(/\.dark\s*\{[\s\S]*--border:\s*#232836;/)
    expect(tokensCss).toMatch(/\.light\s*\{[\s\S]*--border:\s*#e5e7eb;/)
    expect(tokensCss).toMatch(/\.dark\s*\{[\s\S]*--surface-2:\s*#171b24;/)
    expect(tokensCss).toMatch(/\.light\s*\{[\s\S]*--surface-2:\s*#f3f4f6;/)
  })
})
