import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { load as loadYaml } from "js-yaml"
import rehypeKatex from "rehype-katex"
import rehypeStringify from "rehype-stringify"
import remarkDirective from "remark-directive"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { createHighlighter, type Highlighter } from "shiki"
import { unified } from "unified"
import type { DevEnvironment, EnvironmentModuleNode, Plugin } from "vite"
import {
  ALLOWED_DIRECTIVES,
  ContentValidationError,
  cardFrontmatterSchema,
  chapterYmlSchema,
  estimateReadTime,
  formatZodValidationError,
  handbookYmlSchema,
  parseNumericOrder,
  stripNumericPrefix,
} from "../src/lib/schema.ts"
import type {
  Card,
  ChapterMeta,
  ContentWarning,
  HandbookBundle,
  HandbookMeta,
  LoadedHandbookData,
  SearchEntry,
} from "../src/lib/types.ts"

interface MdastNode {
  type: string
  depth?: number
  name?: string
  lang?: string | null
  value?: string
  children?: MdastNode[]
  data?: Record<string, unknown>
}

interface HastNode {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

const VIRTUAL_HANDBOOKS = "virtual:handbooks"
const VIRTUAL_LOADERS = "virtual:handbook-loaders"
const VIRTUAL_HANDBOOK_PREFIX = "virtual:handbook/"
const VIRTUAL_SEARCH_PREFIX = "virtual:search/"
const RESOLVED_PREFIX = "\0"

const INITIAL_LANGS = [
  "python",
  "text",
  "plaintext",
  "bash",
  "sh",
  "json",
  "yaml",
  "sql",
  "java",
  "javascript",
  "typescript",
  "diff",
] as const

let highlighterPromise: Promise<Highlighter> | null = null

export async function getShikiHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: [...INITIAL_LANGS],
    })
  }
  return highlighterPromise
}

function getNodeText(node: MdastNode): string {
  if (typeof node.value === "string") return node.value
  if (!Array.isArray(node.children)) return ""
  return node.children.map(getNodeText).join(" ").replace(/\s+/g, " ").trim()
}

function getHastText(node: HastNode): string {
  if (typeof node.value === "string") return node.value
  if (!Array.isArray(node.children)) return ""
  return node.children.map(getHastText).join("")
}

function collectSearchText(nodes: MdastNode[]): string {
  const parts: string[] = []
  const walk = (node: MdastNode): void => {
    if (
      (node.type === "text" ||
        node.type === "inlineCode" ||
        node.type === "code" ||
        node.type === "inlineMath" ||
        node.type === "math") &&
      typeof node.value === "string"
    ) {
      parts.push(node.value)
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        walk(child)
      }
    }
  }
  for (const node of nodes) {
    walk(node)
  }
  return parts.join(" ").replace(/\s+/g, " ").trim()
}

function containsNodeType(nodes: MdastNode[], targetType: string): boolean {
  for (const node of nodes) {
    if (node.type === targetType) return true
    if (
      Array.isArray(node.children) &&
      containsNodeType(node.children, targetType)
    ) {
      return true
    }
  }
  return false
}

function transformDirectivesAndValidateCode(
  root: MdastNode,
  filePath: string,
  warnings: ContentWarning[]
): void {
  const allowedSet = new Set<string>(ALLOWED_DIRECTIVES)

  const visit = (node: MdastNode): void => {
    if (
      node.type === "code" &&
      typeof node.value === "string" &&
      node.lang !== "mermaid"
    ) {
      const lineCount = node.value.split(/\r?\n/).length
      if (lineCount > 20) {
        warnings.push({
          filePath,
          field: "code",
          message: `code snippet has ${lineCount} lines (recommended <= 20 lines)`,
        })
      }
    }

    if (node.type === "containerDirective") {
      const name = node.name ?? ""
      if (!allowedSet.has(name)) {
        throw new ContentValidationError(
          filePath,
          "directive",
          `unsupported directive ":::${name}". Allowed: ${ALLOWED_DIRECTIVES.join(", ")}`
        )
      }
      const children = node.children ?? []
      let title: string | undefined
      const filteredChildren: MdastNode[] = []
      for (const child of children) {
        if (child.data?.directiveLabel === true && title === undefined) {
          title = getNodeText(child)
        } else {
          filteredChildren.push(child)
        }
      }
      node.children = filteredChildren
      node.data = {
        ...node.data,
        hName: "div",
        hProperties: {
          "data-callout": name,
          ...(title ? { "data-callout-title": title } : {}),
        },
      }
    } else if (node.type === "textDirective") {
      const name = node.name ?? ""
      if (name !== "kbd") {
        throw new ContentValidationError(
          filePath,
          "directive",
          `unsupported inline directive ":${name}". Only :kbd[...] is supported`
        )
      }
      node.data = {
        ...node.data,
        hName: "kbd",
        hProperties: {
          "data-kbd": "",
        },
      }
    } else if (node.type === "leafDirective") {
      throw new ContentValidationError(
        filePath,
        "directive",
        `unsupported leaf directive "::${node.name ?? ""}"`
      )
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        visit(child)
      }
    }
  }

  visit(root)
}

function rehypeShikiBlocks(highlighter: Highlighter) {
  const loadedLangs = new Set(highlighter.getLoadedLanguages())

  return () => (tree: HastNode) => {
    const visitChildren = (parent: HastNode): void => {
      if (!Array.isArray(parent.children)) return
      parent.children = parent.children.map((child) => {
        if (
          child.type === "element" &&
          child.tagName === "pre" &&
          Array.isArray(child.children) &&
          child.children.length === 1 &&
          child.children[0]?.tagName === "code"
        ) {
          const codeNode = child.children[0]
          const classNames = Array.isArray(codeNode.properties?.className)
            ? (codeNode.properties.className as unknown[]).map(String)
            : []
          if (
            classNames.includes("math-display") ||
            classNames.includes("math-inline")
          ) {
            visitChildren(child)
            return child
          }
          const langClass = classNames.find((c) => c.startsWith("language-"))
          const rawLang = langClass
            ? langClass.slice("language-".length)
            : "text"
          const rawCode = getHastText(codeNode).replace(/\n$/, "")

          if (rawLang === "mermaid") {
            return {
              type: "element",
              tagName: "div",
              properties: {
                "data-mermaid-diagram": "",
                "data-code": rawCode,
              },
              children: [{ type: "text", value: rawCode }],
            }
          }

          const safeLang = loadedLangs.has(rawLang) ? rawLang : "text"
          const lineCount =
            rawCode.length === 0 ? 0 : rawCode.split(/\r?\n/).length

          const highlighted = highlighter.codeToHast(rawCode, {
            lang: safeLang,
            themes: {
              dark: "github-dark",
              light: "github-light",
            },
            defaultColor: false,
          }) as unknown as HastNode

          return {
            type: "element",
            tagName: "div",
            properties: {
              "data-code-block": "",
              "data-lang": rawLang,
              "data-lines": String(lineCount),
            },
            children: highlighted.children ?? [],
          }
        }

        visitChildren(child)
        return child
      })
    }

    visitChildren(tree)
  }
}

function findKatexError(node: HastNode): string | null {
  if (node.type === "element") {
    const classNames = node.properties?.className
    const classes = Array.isArray(classNames)
      ? classNames.map(String)
      : typeof classNames === "string"
        ? classNames.split(/\s+/)
        : []
    if (classes.includes("katex-error")) {
      const title = node.properties?.title
      return typeof title === "string" && title.length > 0
        ? title
        : "invalid KaTeX math expression"
    }
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const found = findKatexError(child)
      if (found) return found
    }
  }
  return null
}

function renderMdastNodes(
  nodes: MdastNode[],
  highlighter: Highlighter,
  filePath = "content"
): string {
  if (nodes.length === 0) return ""
  const processor = unified()
    .use(remarkRehype)
    .use(rehypeKatex, { strict: false })
    .use(rehypeShikiBlocks(highlighter))
    .use(rehypeStringify)

  try {
    const hast = processor.runSync({
      type: "root",
      children: nodes,
    } as Parameters<typeof processor.runSync>[0])

    const katexError = findKatexError(hast as unknown as HastNode)
    if (katexError) {
      throw new ContentValidationError(filePath, "math", katexError)
    }

    return String(
      processor.stringify(hast as Parameters<typeof processor.stringify>[0])
    ).trim()
  } catch (err) {
    if (err instanceof ContentValidationError) throw err
    throw new ContentValidationError(
      filePath,
      "math",
      err instanceof Error ? err.message : "failed to render markdown/math"
    )
  }
}

function splitAtH2(
  nodes: MdastNode[],
  filePath: string
): {
  intro: MdastNode[]
  headings: Array<{ title: string; normalized: string; nodes: MdastNode[] }>
} {
  const intro: MdastNode[] = []
  const headings: Array<{
    title: string
    normalized: string
    nodes: MdastNode[]
  }> = []
  const seen = new Set<string>()
  let current: {
    title: string
    normalized: string
    nodes: MdastNode[]
  } | null = null

  for (const node of nodes) {
    if (node.type === "heading" && node.depth === 2) {
      const title = getNodeText(node)
      const normalized = title.toLowerCase().trim()
      if (seen.has(normalized)) {
        throw new ContentValidationError(
          filePath,
          "sections",
          `duplicate H2 section "## ${title}"`
        )
      }
      seen.add(normalized)
      current = { title, normalized, nodes: [] }
      headings.push(current)
    } else if (current) {
      current.nodes.push(node)
    } else {
      intro.push(node)
    }
  }

  return { intro, headings }
}

function extractSectionsAndMeta(
  type: Card["type"],
  root: MdastNode,
  highlighter: Highlighter,
  filePath: string,
  warnings: ContentWarning[]
): {
  sections: Record<string, string>
  extraMeta: Record<string, unknown>
} {
  const allNodes = root.children ?? []
  const render = (nodesToRender: MdastNode[]): string =>
    renderMdastNodes(nodesToRender, highlighter, filePath)

  if (type === "concept") {
    const html = render(allNodes)
    if (!html) {
      throw new ContentValidationError(
        filePath,
        "body",
        "concept card body cannot be empty"
      )
    }
    const wordCount = collectSearchText(allNodes)
      .split(/\s+/)
      .filter(Boolean).length
    if (wordCount > 250) {
      warnings.push({
        filePath,
        field: "body",
        message: `concept card has ${wordCount} words (recommended <= 250 words)`,
      })
    }
    return { sections: { body: html }, extraMeta: {} }
  }

  const { intro, headings } = splitAtH2(allNodes, filePath)
  const headingMap = new Map(headings.map((h) => [h.normalized, h]))
  const sections: Record<string, string> = {}
  const extraMeta: Record<string, unknown> = {}

  const assertAllowedHeadings = (allowed: Record<string, string>): void => {
    for (const h of headings) {
      if (!(h.normalized in allowed)) {
        throw new ContentValidationError(
          filePath,
          "sections",
          `unexpected H2 heading "## ${h.title}" for card type "${type}". Allowed: ${Object.keys(allowed).join(", ")}`
        )
      }
    }
  }

  if (type === "question") {
    const allowed: Record<string, string> = {
      answer: "answer",
      "why interviewers ask": "why",
      "follow-ups": "followUps",
      code: "code",
    }
    assertAllowedHeadings(allowed)

    const answerHeading = headingMap.get("answer")
    if (!answerHeading || answerHeading.nodes.length === 0) {
      throw new ContentValidationError(
        filePath,
        "sections.Answer",
        'question card requires a non-empty "## Answer" section'
      )
    }

    for (const h of headings) {
      const key = allowed[h.normalized]
      const rendered = render(h.nodes)
      if (rendered) {
        sections[key] = rendered
      }
    }
    return { sections, extraMeta }
  }

  if (type === "predict") {
    const allowed: Record<string, string> = {
      output: "output",
      explanation: "explanation",
    }
    assertAllowedHeadings(allowed)

    const firstCodeIdx = intro.findIndex((n) => n.type === "code")
    if (firstCodeIdx === -1) {
      throw new ContentValidationError(
        filePath,
        "sections.code",
        "predict card must start with a fenced code block before ## Output"
      )
    }

    const codeNode = intro[firstCodeIdx]
    sections.code = render([codeNode])
    const remainingIntro = intro.filter((_, idx) => idx !== firstCodeIdx)
    const introHtml = render(remainingIntro)
    if (introHtml) {
      sections.intro = introHtml
    }

    const outputHeading = headingMap.get("output")
    if (!outputHeading || outputHeading.nodes.length === 0) {
      throw new ContentValidationError(
        filePath,
        "sections.Output",
        'predict card requires a non-empty "## Output" section'
      )
    }
    const outputCodeNode = outputHeading.nodes.find((n) => n.type === "code")
    if (!outputCodeNode) {
      throw new ContentValidationError(
        filePath,
        "sections.Output",
        '"## Output" section in predict card must contain a fenced text/code block'
      )
    }
    extraMeta.outputText = outputCodeNode.value ?? ""
    sections.output = render(outputHeading.nodes)

    const explanationHeading = headingMap.get("explanation")
    if (!explanationHeading || explanationHeading.nodes.length === 0) {
      throw new ContentValidationError(
        filePath,
        "sections.Explanation",
        'predict card requires a non-empty "## Explanation" section'
      )
    }
    sections.explanation = render(explanationHeading.nodes)

    return { sections, extraMeta }
  }

  if (type === "compare") {
    const allowed: Record<string, string> = {
      verdict: "verdict",
    }
    assertAllowedHeadings(allowed)

    const tableNode = intro.find((n) => n.type === "table")
    if (!tableNode || !Array.isArray(tableNode.children)) {
      throw new ContentValidationError(
        filePath,
        "sections.table",
        "compare card must include a GFM comparison table"
      )
    }

    sections.table = render([tableNode])
    const introRemainder = intro.filter((n) => n !== tableNode)
    const introHtml = render(introRemainder)
    if (introHtml) {
      sections.intro = introHtml
    }

    const tableRows = tableNode.children
      .filter((r) => r.type === "tableRow")
      .map((row) =>
        (row.children ?? []).map((cell) =>
          render([{ type: "paragraph", children: cell.children ?? [] }])
        )
      )
    if (tableRows.length > 0) {
      extraMeta.tableHeaders = tableRows[0]
      extraMeta.tableRows = tableRows.slice(1)
    }

    const verdictHeading = headingMap.get("verdict")
    if (verdictHeading) {
      const verdictHtml = render(verdictHeading.nodes)
      if (verdictHtml) {
        sections.verdict = verdictHtml
      }
    }

    return { sections, extraMeta }
  }

  if (type === "pitfall") {
    const allowed: Record<string, string> = {
      "the trap": "trap",
      "the fix": "fix",
      "why it happens": "why",
    }
    assertAllowedHeadings(allowed)

    const trapHeading = headingMap.get("the trap")
    if (!trapHeading || !containsNodeType(trapHeading.nodes, "code")) {
      throw new ContentValidationError(
        filePath,
        "sections.The trap",
        'pitfall card requires "## The trap" with a fenced code block'
      )
    }
    sections.trap = render(trapHeading.nodes)

    const fixHeading = headingMap.get("the fix")
    if (!fixHeading || !containsNodeType(fixHeading.nodes, "code")) {
      throw new ContentValidationError(
        filePath,
        "sections.The fix",
        'pitfall card requires "## The fix" with a fenced code block'
      )
    }
    sections.fix = render(fixHeading.nodes)

    const whyHeading = headingMap.get("why it happens")
    if (!whyHeading || whyHeading.nodes.length === 0) {
      throw new ContentValidationError(
        filePath,
        "sections.Why it happens",
        'pitfall card requires a non-empty "## Why it happens" section'
      )
    }
    sections.why = render(whyHeading.nodes)

    return { sections, extraMeta }
  }

  // problem
  const allowed: Record<string, string> = {
    problem: "problem",
    hint: "hint",
    solution: "solution",
    walkthrough: "walkthrough",
  }
  assertAllowedHeadings(allowed)

  const problemHeading = headingMap.get("problem")
  if (!problemHeading || problemHeading.nodes.length === 0) {
    throw new ContentValidationError(
      filePath,
      "sections.Problem",
      'problem card requires a non-empty "## Problem" section'
    )
  }
  sections.problem = render(problemHeading.nodes)

  const hintHeading = headingMap.get("hint")
  if (hintHeading && hintHeading.nodes.length > 0) {
    sections.hint = render(hintHeading.nodes)
    const hintList = hintHeading.nodes.find((n) => n.type === "list")
    if (hintList && Array.isArray(hintList.children)) {
      extraMeta.hints = hintList.children.map((item) =>
        render(item.children ?? [])
      )
    } else {
      extraMeta.hints = hintHeading.nodes.map((node) => render([node]))
    }
  }

  const solutionHeading = headingMap.get("solution")
  if (!solutionHeading || solutionHeading.nodes.length === 0) {
    throw new ContentValidationError(
      filePath,
      "sections.Solution",
      'problem card requires a non-empty "## Solution" section'
    )
  }
  sections.solution = render(solutionHeading.nodes)

  const walkthroughHeading = headingMap.get("walkthrough")
  if (walkthroughHeading && walkthroughHeading.nodes.length > 0) {
    sections.walkthrough = render(walkthroughHeading.nodes)
  }

  return { sections, extraMeta }
}

function readYamlFile<T>(
  filePath: string,
  schema: {
    safeParse: (
      v: unknown
    ) =>
      | { success: true; data: T }
      | { success: false; error: import("zod").ZodError }
  }
): T {
  let raw: string
  try {
    raw = fs.readFileSync(filePath, "utf8")
  } catch (err) {
    throw new ContentValidationError(
      filePath,
      "file",
      err instanceof Error ? err.message : "cannot read YAML file"
    )
  }

  let parsed: unknown
  try {
    parsed = loadYaml(raw)
  } catch (err) {
    throw new ContentValidationError(
      filePath,
      "yaml",
      err instanceof Error ? err.message : "invalid YAML syntax"
    )
  }

  const result = schema.safeParse(parsed)
  if (!result.success) {
    throw formatZodValidationError(filePath, result.error)
  }
  return result.data
}

export async function loadAllHandbooks(
  contentRoot: string,
  options?: { singleHandbook?: string }
): Promise<LoadedHandbookData> {
  if (!fs.existsSync(contentRoot)) {
    return { handbooks: [], bundles: {}, search: {}, warnings: [] }
  }

  const highlighter = await getShikiHighlighter()
  const warnings: ContentWarning[] = []
  const handbooks: HandbookMeta[] = []
  const bundles: Record<string, HandbookBundle> = {}
  const search: Record<string, SearchEntry[]> = {}

  const allCardIds = new Map<string, string>()
  const relatedChecks: Array<{
    filePath: string
    relatedIds: string[]
  }> = []

  const handbookDirs = fs
    .readdirSync(contentRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  for (const dirName of handbookDirs) {
    const hbDir = path.join(contentRoot, dirName)
    const hbYmlPath = path.join(hbDir, "handbook.yml")
    if (!fs.existsSync(hbYmlPath)) {
      throw new ContentValidationError(
        hbYmlPath,
        "handbook.yml",
        `missing handbook.yml in directory ${hbDir}`
      )
    }

    const hbConfig = readYamlFile(hbYmlPath, handbookYmlSchema)
    if (hbConfig.id !== dirName) {
      throw new ContentValidationError(
        hbYmlPath,
        "id",
        `handbook id "${hbConfig.id}" must match folder name "${dirName}"`
      )
    }

    const chaptersMeta: ChapterMeta[] = []
    const cards: Card[] = []

    for (let chIndex = 0; chIndex < hbConfig.chapters.length; chIndex++) {
      const chapterDirName = hbConfig.chapters[chIndex]
      const chapterDir = path.join(hbDir, chapterDirName)
      const chapterYmlPath = path.join(chapterDir, "chapter.yml")

      if (
        !fs.existsSync(chapterDir) ||
        !fs.statSync(chapterDir).isDirectory()
      ) {
        throw new ContentValidationError(
          hbYmlPath,
          "chapters",
          `chapter folder "${chapterDirName}" does not exist`
        )
      }
      if (!fs.existsSync(chapterYmlPath)) {
        throw new ContentValidationError(
          chapterYmlPath,
          "chapter.yml",
          `missing chapter.yml in "${chapterDirName}"`
        )
      }

      const chapterConfig = readYamlFile(chapterYmlPath, chapterYmlSchema)
      const chapterSlug = stripNumericPrefix(chapterDirName)
      const chapterOrder = parseNumericOrder(chapterDirName, chIndex + 1)

      const cardFiles = fs
        .readdirSync(chapterDir, { withFileTypes: true })
        .filter((f) => f.isFile() && f.name.endsWith(".md"))
        .map((f) => f.name)
        .sort()

      if (cardFiles.length === 0) {
        throw new ContentValidationError(
          chapterDir,
          "cards",
          `chapter "${chapterDirName}" contains no markdown card files`
        )
      }

      for (let cardIndex = 0; cardIndex < cardFiles.length; cardIndex++) {
        const fileName = cardFiles[cardIndex]
        const cardFilePath = path.join(chapterDir, fileName)
        const rawFile = fs.readFileSync(cardFilePath, "utf8")

        let parsedMatter: matter.GrayMatterFile<string>
        try {
          parsedMatter = matter(rawFile)
        } catch (err) {
          throw new ContentValidationError(
            cardFilePath,
            "frontmatter",
            err instanceof Error ? err.message : "invalid frontmatter YAML"
          )
        }

        const fmResult = cardFrontmatterSchema.safeParse(parsedMatter.data)
        if (!fmResult.success) {
          throw formatZodValidationError(cardFilePath, fmResult.error)
        }
        const fm = fmResult.data

        const fileSlug = stripNumericPrefix(fileName)
        const cardId = `${hbConfig.id}.${chapterSlug}.${fileSlug}`
        const existingPath = allCardIds.get(cardId)
        if (existingPath) {
          throw new ContentValidationError(
            cardFilePath,
            "id",
            `duplicate card id "${cardId}" (already defined in ${existingPath})`
          )
        }
        allCardIds.set(cardId, cardFilePath)

        if (fm.mostAsked && fm.revision.length === 0) {
          warnings.push({
            filePath: cardFilePath,
            field: "revision",
            message: "mostAsked card is missing revision lines",
          })
        }

        const mdParser = unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkMath)
          .use(remarkDirective)
        const mdast = mdParser.parse(
          parsedMatter.content
        ) as unknown as MdastNode

        transformDirectivesAndValidateCode(mdast, cardFilePath, warnings)
        const searchText = collectSearchText(mdast.children ?? [])
        const { sections, extraMeta } = extractSectionsAndMeta(
          fm.type,
          mdast,
          highlighter,
          cardFilePath,
          warnings
        )

        const meta: Record<string, unknown> = { ...extraMeta }
        if (fm.type === "predict") {
          if (fm.options) meta.options = fm.options
          if (fm.answer !== undefined) meta.answer = fm.answer
        } else if (fm.type === "compare") {
          meta.left = fm.left
          meta.right = fm.right
        } else if (fm.type === "problem") {
          meta.complexity = fm.complexity
          meta.approach = fm.approach
        }

        const card: Card = {
          id: cardId,
          handbook: hbConfig.id,
          chapter: chapterSlug,
          order: parseNumericOrder(fileName, cardIndex + 1),
          type: fm.type,
          title: fm.title,
          difficulty: fm.difficulty,
          tags: fm.tags,
          mostAsked: fm.mostAsked,
          readTime: fm.readTime ?? estimateReadTime(searchText),
          related: fm.related,
          revision: fm.revision,
          sections,
          meta,
          searchText,
        }

        if (fm.related.length > 0) {
          relatedChecks.push({ filePath: cardFilePath, relatedIds: fm.related })
        }

        cards.push(card)
        const searchList = (search[hbConfig.id] ??= [])
        searchList.push({
          id: card.id,
          title: card.title,
          tags: card.tags,
          searchText: card.searchText,
          chapter: chapterSlug,
          chapterTitle: chapterConfig.title,
          type: card.type,
          difficulty: card.difficulty,
          mostAsked: card.mostAsked,
        })
      }

      chaptersMeta.push({
        slug: chapterSlug,
        dirName: chapterDirName,
        order: chapterOrder,
        title: chapterConfig.title,
        emoji: chapterConfig.emoji,
        description: chapterConfig.description,
        cardCount: cardFiles.length,
      })
    }

    const handbookMeta: HandbookMeta = {
      id: hbConfig.id,
      name: hbConfig.name,
      tagline: hbConfig.tagline,
      icon: hbConfig.icon,
      accent: hbConfig.accent,
      accent2: hbConfig.accent2,
      version: hbConfig.version,
      chapterCount: chaptersMeta.length,
      cardCount: cards.length,
      chapters: chaptersMeta,
    }

    handbooks.push(handbookMeta)
    bundles[hbConfig.id] = { handbook: handbookMeta, cards }
  }

  for (const check of relatedChecks) {
    for (const relId of check.relatedIds) {
      if (!allCardIds.has(relId)) {
        throw new ContentValidationError(
          check.filePath,
          "related",
          `related card id "${relId}" does not exist`
        )
      }
    }
  }

  if (options?.singleHandbook) {
    const selected = options.singleHandbook
    if (!bundles[selected]) {
      throw new ContentValidationError(
        path.join(contentRoot, selected),
        "HANDBOOK",
        `selected single handbook "${selected}" was not found. Available: ${handbooks.map((h) => h.id).join(", ")}`
      )
    }
    return {
      handbooks: handbooks.filter((h) => h.id === selected),
      bundles: { [selected]: bundles[selected] },
      search: { [selected]: search[selected] ?? [] },
      warnings,
    }
  }

  return { handbooks, bundles, search, warnings }
}

export interface HandbookContentPluginOptions {
  contentDir?: string
  singleHandbook?: string
}

export function handbookContentPlugin(
  options: HandbookContentPluginOptions = {}
): Plugin {
  let rootDir = process.cwd()
  let contentDir = options.contentDir ?? path.resolve(rootDir, "content")
  let isSingleMode = false
  let cached: LoadedHandbookData | null = null
  let loadingPromise: Promise<LoadedHandbookData> | null = null

  const getData = async (): Promise<LoadedHandbookData> => {
    if (cached) return cached
    if (!loadingPromise) {
      loadingPromise = loadAllHandbooks(contentDir, {
        singleHandbook: isSingleMode
          ? options.singleHandbook || process.env.HANDBOOK || undefined
          : undefined,
      })
        .then((data) => {
          for (const w of data.warnings) {
            console.warn(
              `[handbook-content] Warning in ${w.filePath} [${w.field}]: ${w.message}`
            )
          }
          cached = data
          return data
        })
        .finally(() => {
          loadingPromise = null
        })
    }
    return loadingPromise
  }

  const invalidateCache = (): void => {
    cached = null
  }

  return {
    name: "handbook-content",
    configResolved(config) {
      rootDir = config.root
      contentDir = options.contentDir ?? path.resolve(rootDir, "content")
      isSingleMode = config.mode === "single"
    },
    async buildStart() {
      // Eagerly parse and validate all content during build startup
      await getData()
    },
    configureServer(server) {
      if (fs.existsSync(contentDir)) {
        server.watcher.add(contentDir)
      }
      const onFsEvent = (changedFile: string): void => {
        const normalizedChanged = path.resolve(changedFile)
        const normalizedContent = path.resolve(contentDir)
        if (
          normalizedChanged.startsWith(normalizedContent + path.sep) &&
          (normalizedChanged.endsWith(".md") ||
            normalizedChanged.endsWith(".yml") ||
            normalizedChanged.endsWith(".yaml"))
        ) {
          invalidateCache()
        }
      }
      server.watcher.on("add", onFsEvent)
      server.watcher.on("unlink", onFsEvent)
    },
    async hotUpdate({ file }) {
      const normalizedFile = path.resolve(file)
      const normalizedContent = path.resolve(contentDir)
      if (!normalizedFile.startsWith(normalizedContent + path.sep)) {
        return
      }
      invalidateCache()

      const env: DevEnvironment = this.environment
      const targets: EnvironmentModuleNode[] = []

      const collectVirtual = (virtualId: string): void => {
        const mod = env.moduleGraph.getModuleById(RESOLVED_PREFIX + virtualId)
        if (mod) {
          env.moduleGraph.invalidateModule(mod)
          targets.push(mod)
        }
      }

      collectVirtual(VIRTUAL_HANDBOOKS)
      collectVirtual(VIRTUAL_LOADERS)

      const data = await getData()
      for (const hb of data.handbooks) {
        collectVirtual(VIRTUAL_HANDBOOK_PREFIX + hb.id)
        collectVirtual(VIRTUAL_SEARCH_PREFIX + hb.id)
      }

      return targets
    },
    resolveId(id) {
      if (
        id === VIRTUAL_HANDBOOKS ||
        id === VIRTUAL_LOADERS ||
        id.startsWith(VIRTUAL_HANDBOOK_PREFIX) ||
        id.startsWith(VIRTUAL_SEARCH_PREFIX)
      ) {
        return RESOLVED_PREFIX + id
      }
      return undefined
    },
    async load(id) {
      if (!id.startsWith(RESOLVED_PREFIX)) return undefined
      const virtualId = id.slice(RESOLVED_PREFIX.length)
      const data = await getData()

      if (virtualId === VIRTUAL_HANDBOOKS) {
        return `export const handbooks = ${JSON.stringify(data.handbooks)};\nexport default handbooks;\n`
      }

      if (virtualId === VIRTUAL_LOADERS) {
        if (isSingleMode) {
          const imports: string[] = []
          const hbEntries: string[] = []
          const searchEntries: string[] = []
          for (const hb of data.handbooks) {
            const safeVar = hb.id.replace(/[^a-zA-Z0-9_]/g, "_")
            imports.push(
              `import __hb_${safeVar} from "${VIRTUAL_HANDBOOK_PREFIX}${hb.id}";`
            )
            imports.push(
              `import __sr_${safeVar} from "${VIRTUAL_SEARCH_PREFIX}${hb.id}";`
            )
            hbEntries.push(
              `${JSON.stringify(hb.id)}: () => Promise.resolve(__hb_${safeVar})`
            )
            searchEntries.push(
              `${JSON.stringify(hb.id)}: () => Promise.resolve({ entries: __sr_${safeVar} })`
            )
          }
          return [
            ...imports,
            `export const handbookLoaders = { ${hbEntries.join(", ")} };`,
            `export const searchLoaders = { ${searchEntries.join(", ")} };`,
          ].join("\n")
        }

        const hbEntries = data.handbooks.map(
          (hb) =>
            `${JSON.stringify(hb.id)}: () => import("${VIRTUAL_HANDBOOK_PREFIX}${hb.id}").then((m) => m.default)`
        )
        const searchEntries = data.handbooks.map(
          (hb) =>
            `${JSON.stringify(hb.id)}: () => import("${VIRTUAL_SEARCH_PREFIX}${hb.id}")`
        )
        return [
          `export const handbookLoaders = { ${hbEntries.join(", ")} };`,
          `export const searchLoaders = { ${searchEntries.join(", ")} };`,
        ].join("\n")
      }

      if (virtualId.startsWith(VIRTUAL_HANDBOOK_PREFIX)) {
        const hbId = virtualId.slice(VIRTUAL_HANDBOOK_PREFIX.length)
        const bundle = data.bundles[hbId]
        if (!bundle) {
          throw new ContentValidationError(
            path.join(contentDir, hbId),
            "handbook",
            `unknown handbook "${hbId}"`
          )
        }
        return [
          `export const handbook = ${JSON.stringify(bundle.handbook)};`,
          `export const cards = ${JSON.stringify(bundle.cards)};`,
          `const bundle = { handbook, cards };`,
          `export default bundle;`,
          `if (import.meta.hot) {`,
          `  import.meta.hot.accept((newMod) => {`,
          `    if (newMod) {`,
          `      window.dispatchEvent(new CustomEvent("ihb:handbook-hmr", { detail: { id: ${JSON.stringify(hbId)}, bundle: newMod.default } }));`,
          `    }`,
          `  });`,
          `}`,
        ].join("\n")
      }

      if (virtualId.startsWith(VIRTUAL_SEARCH_PREFIX)) {
        const hbId = virtualId.slice(VIRTUAL_SEARCH_PREFIX.length)
        const entries = data.search[hbId]
        if (!entries) {
          throw new ContentValidationError(
            path.join(contentDir, hbId),
            "search",
            `unknown handbook "${hbId}" for search index`
          )
        }
        return `export const entries = ${JSON.stringify(entries)};\nexport default entries;\n`
      }

      return undefined
    },
  }
}
