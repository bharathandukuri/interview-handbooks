import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { loadAllHandbooks } from "../plugins/handbook-content.ts"
import { ContentValidationError } from "../src/lib/schema.ts"

const tempDirs: string[] = []

function makeTempContent(setup: (root: string) => void): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ihb-test-"))
  tempDirs.push(dir)
  setup(dir)
  return dir
}

function writeFile(targetPath: string, content: string): void {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
  fs.writeFileSync(targetPath, content, "utf8")
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop()
    if (dir && fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  }
})

describe("loadAllHandbooks on repository Python sample", () => {
  it("loads the 3 sample Python cards with Shiki dual-theme HTML and directives", async () => {
    const contentRoot = path.resolve(process.cwd(), "content")
    const result = await loadAllHandbooks(contentRoot)

    expect(result.handbooks).toHaveLength(1)
    expect(result.handbooks[0]?.id).toBe("python")
    expect(result.handbooks[0]?.chapterCount).toBe(2)
    expect(result.handbooks[0]?.cardCount).toBe(3)
    expect(result.warnings).toHaveLength(0)

    const bundle = result.bundles.python
    expect(bundle).toBeDefined()
    expect(bundle?.cards.map((c) => c.id)).toEqual([
      "python.basics.mutable-vs-immutable",
      "python.basics.is-vs-equals",
      "python.functions.args-kwargs",
    ])

    const qCard = bundle?.cards[0]
    expect(qCard?.sections.answer).toContain("data-code-block")
    expect(qCard?.sections.answer).toContain("--shiki-dark")
    expect(qCard?.sections.answer).toContain("--shiki-light")
    expect(qCard?.sections.answer).toContain('data-callout="insight"')
    expect(qCard?.sections.answer).toContain(
      'data-callout-title="Interview insight"'
    )
    expect(qCard?.sections.why).toContain("object-reference model")
    expect(qCard?.sections.followUps).toContain("<li>")

    const pCard = bundle?.cards[1]
    expect(pCard?.sections.code).toContain("data-code-block")
    expect(pCard?.sections.output).toContain("True False")
    expect(pCard?.meta.outputText).toContain("True False")

    const cCard = bundle?.cards[2]
    expect(cCard?.sections.body).toContain('<kbd data-kbd="">Space</kbd>')
    expect(cCard?.sections.body).toContain('data-callout="tip"')
    expect(cCard?.sections.body).toContain(
      'data-callout-title="Forwarding safely"'
    )

    expect(result.search.python).toHaveLength(3)
    expect(result.search.python?.[0]?.chapterTitle).toBe("Python Basics")
  })
})

describe("loadAllHandbooks validation and warnings", () => {
  const baseHandbook = [
    "id: demo",
    "name: Demo",
    "tagline: Demo tagline",
    "icon: code",
    "accent: '#4A90E2'",
    "accent2: '#FFD43B'",
    "version: 1",
    "chapters:",
    "  - 01-intro",
  ].join("\n")

  const baseChapter = [
    "title: Intro",
    "emoji: 🚀",
    "description: Intro chapter",
  ].join("\n")

  it("fails with file path and field name on missing frontmatter field", async () => {
    const root = makeTempContent((dir) => {
      writeFile(path.join(dir, "demo/handbook.yml"), baseHandbook)
      writeFile(path.join(dir, "demo/01-intro/chapter.yml"), baseChapter)
      writeFile(
        path.join(dir, "demo/01-intro/01-bad.md"),
        `---\ntype: question\ndifficulty: easy\ntags: [core]\n---\n\n## Answer\n\nHi\n`
      )
    })

    await expect(loadAllHandbooks(root)).rejects.toMatchObject({
      name: "ContentValidationError",
      field: "title",
      filePath: expect.stringContaining("01-bad.md"),
    })
  })

  it("fails with file path and field name when ## Answer is missing on question card", async () => {
    const root = makeTempContent((dir) => {
      writeFile(path.join(dir, "demo/handbook.yml"), baseHandbook)
      writeFile(path.join(dir, "demo/01-intro/chapter.yml"), baseChapter)
      writeFile(
        path.join(dir, "demo/01-intro/01-missing-answer.md"),
        `---\ntype: question\ntitle: Missing answer\ndifficulty: easy\ntags: [core]\n---\n\n## Why interviewers ask\n\nReasons.\n`
      )
    })

    await expect(loadAllHandbooks(root)).rejects.toMatchObject({
      name: "ContentValidationError",
      field: "sections.Answer",
      filePath: expect.stringContaining("01-missing-answer.md"),
    })
  })

  it("fails on duplicate card ids after stripping numeric prefixes", async () => {
    const root = makeTempContent((dir) => {
      writeFile(path.join(dir, "demo/handbook.yml"), baseHandbook)
      writeFile(path.join(dir, "demo/01-intro/chapter.yml"), baseChapter)
      const card = `---\ntype: concept\ntitle: Same\ndifficulty: easy\ntags: [core]\n---\n\nHello.\n`
      writeFile(path.join(dir, "demo/01-intro/01-same.md"), card)
      writeFile(path.join(dir, "demo/01-intro/02-same.md"), card)
    })

    await expect(loadAllHandbooks(root)).rejects.toMatchObject({
      name: "ContentValidationError",
      field: "id",
      filePath: expect.stringContaining("02-same.md"),
    })
  })

  it("fails when related references a nonexistent card id", async () => {
    const root = makeTempContent((dir) => {
      writeFile(path.join(dir, "demo/handbook.yml"), baseHandbook)
      writeFile(path.join(dir, "demo/01-intro/chapter.yml"), baseChapter)
      writeFile(
        path.join(dir, "demo/01-intro/01-rel.md"),
        `---\ntype: concept\ntitle: Rel\ndifficulty: easy\ntags: [core]\nrelated: [demo.intro.missing]\n---\n\nBody.\n`
      )
    })

    await expect(loadAllHandbooks(root)).rejects.toMatchObject({
      name: "ContentValidationError",
      field: "related",
      filePath: expect.stringContaining("01-rel.md"),
    })
  })

  it("fails on unsupported directives with file path and field name", async () => {
    const root = makeTempContent((dir) => {
      writeFile(path.join(dir, "demo/handbook.yml"), baseHandbook)
      writeFile(path.join(dir, "demo/01-intro/chapter.yml"), baseChapter)
      writeFile(
        path.join(dir, "demo/01-intro/01-dir.md"),
        `---\ntype: concept\ntitle: Dir\ndifficulty: easy\ntags: [core]\n---\n\n:::warning\nNope\n:::\n`
      )
    })

    await expect(loadAllHandbooks(root)).rejects.toBeInstanceOf(
      ContentValidationError
    )
  })

  it("emits warnings (not errors) for concept >250 words, code >20 lines, and missing revision on mostAsked", async () => {
    const longWords = Array.from({ length: 260 }, () => "python").join(" ")
    const longCode = Array.from({ length: 22 }, (_, i) => `x_${i} = ${i}`).join(
      "\n"
    )
    const root = makeTempContent((dir) => {
      writeFile(path.join(dir, "demo/handbook.yml"), baseHandbook)
      writeFile(path.join(dir, "demo/01-intro/chapter.yml"), baseChapter)
      writeFile(
        path.join(dir, "demo/01-intro/01-warn.md"),
        `---\ntype: concept\ntitle: Long\ndifficulty: easy\ntags: [core]\nmostAsked: true\n---\n\n${longWords}\n\n\`\`\`python\n${longCode}\n\`\`\`\n`
      )
    })

    const data = await loadAllHandbooks(root)
    expect(data.handbooks[0]?.cardCount).toBe(1)
    expect(data.warnings.map((w) => w.field)).toEqual(
      expect.arrayContaining(["revision", "code", "body"])
    )
  })

  it("extracts compare, pitfall, and problem sections and enforces their required blocks", async () => {
    const root = makeTempContent((dir) => {
      writeFile(path.join(dir, "demo/handbook.yml"), baseHandbook)
      writeFile(path.join(dir, "demo/01-intro/chapter.yml"), baseChapter)
      writeFile(
        path.join(dir, "demo/01-intro/01-cmp.md"),
        `---\ntype: compare\ntitle: A vs B\ndifficulty: easy\ntags: [core]\nleft: A\nright: B\n---\n\n| Feature | A | B |\n| --- | --- | --- |\n| Speed | Fast | Slow |\n\n## Verdict\n\nPick A.\n`
      )
      writeFile(
        path.join(dir, "demo/01-intro/02-pit.md"),
        `---\ntype: pitfall\ntitle: Trap\ndifficulty: medium\ntags: [core]\n---\n\n## The trap\n\n\`\`\`python\nx = []\n\`\`\`\n\n## The fix\n\n\`\`\`python\nx = None\n\`\`\`\n\n## Why it happens\n\nShared list.\n`
      )
      writeFile(
        path.join(dir, "demo/01-intro/03-prob.md"),
        `---\ntype: problem\ntitle: Two Sum\ndifficulty: easy\ntags: [arrays]\ncomplexity:\n  time: O(n)\n  space: O(n)\napproach: Hash map\n---\n\n## Problem\n\nFind indices.\n\n## Hint\n\n- Use a dict\n- Store seen values\n\n## Solution\n\n\`\`\`python\ndef two_sum(): pass\n\`\`\`\n\n## Walkthrough\n\nLinear scan.\n`
      )
    })

    const data = await loadAllHandbooks(root)
    const cards = data.bundles.demo?.cards ?? []
    expect(cards).toHaveLength(3)
    expect(cards[0]?.sections.table).toContain("<table>")
    expect(cards[0]?.sections.verdict).toContain("Pick A.")
    expect(cards[0]?.meta.tableHeaders).toHaveLength(3)
    expect(cards[1]?.sections.trap).toContain("data-code-block")
    expect(cards[1]?.sections.fix).toContain("data-code-block")
    expect(cards[1]?.sections.why).toContain("Shared list.")
    expect(cards[2]?.sections.problem).toContain("Find indices.")
    expect(cards[2]?.meta.hints).toHaveLength(2)
    expect(cards[2]?.sections.solution).toContain("data-code-block")
    expect(cards[2]?.sections.walkthrough).toContain("Linear scan.")
  })

  it("compiles fenced mermaid blocks to data-mermaid-diagram while preserving searchText", async () => {
    const root = makeTempContent((dir) => {
      writeFile(path.join(dir, "demo/handbook.yml"), baseHandbook)
      writeFile(path.join(dir, "demo/01-intro/chapter.yml"), baseChapter)
      writeFile(
        path.join(dir, "demo/01-intro/01-diag.md"),
        `---\ntype: concept\ntitle: Flow\ndifficulty: easy\ntags: [diagrams]\n---\n\nSee the flow:\n\n\`\`\`mermaid\nflowchart LR\n  Start --> Finish\n\`\`\`\n`
      )
    })

    const data = await loadAllHandbooks(root)
    const card = data.bundles.demo?.cards[0]
    expect(card?.sections.body).toContain("data-mermaid-diagram")
    expect(card?.sections.body).not.toContain("data-code-block")
    expect(card?.searchText).toContain("Start --> Finish")
  })

  it("compiles inline and block KaTeX math without treating block math as code blocks", async () => {
    const root = makeTempContent((dir) => {
      writeFile(path.join(dir, "demo/handbook.yml"), baseHandbook)
      writeFile(path.join(dir, "demo/01-intro/chapter.yml"), baseChapter)
      writeFile(
        path.join(dir, "demo/01-intro/01-math.md"),
        [
          "---",
          "type: concept",
          "title: Recurrence complexity",
          "difficulty: medium",
          "tags: [complexity, math]",
          "---",
          "",
          "Merge sort achieves $O(n \\log n)$ time via the recurrence:",
          "",
          "$$",
          "T(n) = 2T(n/2) + \\Theta(n)",
          "$$",
          "",
          "```python",
          "def merge_sort(arr):",
          "    return arr",
          "```",
        ].join("\n")
      )
    })

    const data = await loadAllHandbooks(root)
    const card = data.bundles.demo?.cards[0]
    expect(card?.sections.body).toContain('class="katex"')
    expect(card?.sections.body).toContain('class="katex-display"')
    expect(card?.sections.body).toContain("<math ")
    expect(card?.sections.body).toContain("data-code-block")
    expect(card?.sections.body).not.toContain("math-display")
    expect(card?.searchText).toContain("O(n \\log n)")
    expect(card?.searchText).toContain("T(n) = 2T(n/2)")
  })

  it("fails with file path and math field on malformed KaTeX syntax", async () => {
    const root = makeTempContent((dir) => {
      writeFile(path.join(dir, "demo/handbook.yml"), baseHandbook)
      writeFile(path.join(dir, "demo/01-intro/chapter.yml"), baseChapter)
      writeFile(
        path.join(dir, "demo/01-intro/01-bad-math.md"),
        `---\ntype: concept\ntitle: Bad math\ndifficulty: easy\ntags: [math]\n---\n\nBroken formula $\\frac{1$ here.\n`
      )
    })

    await expect(loadAllHandbooks(root)).rejects.toMatchObject({
      name: "ContentValidationError",
      field: "math",
      filePath: expect.stringContaining("01-bad-math.md"),
    })
  })
})
