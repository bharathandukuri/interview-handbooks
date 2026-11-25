import { describe, expect, it } from "vitest"
import {
  cardFrontmatterSchema,
  chapterYmlSchema,
  estimateReadTime,
  handbookYmlSchema,
  parseNumericOrder,
  stripNumericPrefix,
} from "../src/lib/schema.ts"

describe("handbook and chapter schemas", () => {
  it("validates a valid handbook.yml", () => {
    const parsed = handbookYmlSchema.parse({
      id: "python",
      name: "Python",
      tagline: "Crack the Python interview, one card at a time",
      icon: "python",
      accent: "#4A90E2",
      accent2: "#FFD43B",
      version: 1,
      chapters: ["01-basics", "02-functions"],
    })
    expect(parsed.id).toBe("python")
  })

  it("rejects invalid hex accent and uppercase id in handbook.yml", () => {
    const res = handbookYmlSchema.safeParse({
      id: "Python_1",
      name: "Python",
      tagline: "Tagline",
      icon: "python",
      accent: "blue",
      accent2: "#FFD43B",
      version: 1,
      chapters: ["01-basics"],
    })
    expect(res.success).toBe(false)
  })

  it("validates chapter.yml and rejects empty emoji", () => {
    expect(
      chapterYmlSchema.safeParse({
        title: "Basics",
        emoji: "🧱",
        description: "Core types",
      }).success
    ).toBe(true)

    expect(
      chapterYmlSchema.safeParse({
        title: "Basics",
        emoji: "",
        description: "Core types",
      }).success
    ).toBe(false)
  })
})

describe("cardFrontmatterSchema", () => {
  it("validates all six card types", () => {
    const base = {
      title: "Sample Card",
      difficulty: "medium",
      tags: ["core"],
    }

    expect(
      cardFrontmatterSchema.parse({ ...base, type: "question" }).mostAsked
    ).toBe(false)
    expect(cardFrontmatterSchema.parse({ ...base, type: "concept" }).type).toBe(
      "concept"
    )
    expect(
      cardFrontmatterSchema.parse({
        ...base,
        type: "predict",
        options: ["A", "B"],
        answer: 1,
      }).type
    ).toBe("predict")
    expect(
      cardFrontmatterSchema.parse({
        ...base,
        type: "compare",
        left: "List",
        right: "Tuple",
      }).type
    ).toBe("compare")
    expect(cardFrontmatterSchema.parse({ ...base, type: "pitfall" }).type).toBe(
      "pitfall"
    )
    expect(
      cardFrontmatterSchema.parse({
        ...base,
        type: "problem",
        complexity: { time: "O(n)", space: "O(n)" },
        approach: "Hash map",
      }).type
    ).toBe("problem")
  })

  it("rejects invalid difficulty and missing tags", () => {
    const badDiff = cardFrontmatterSchema.safeParse({
      type: "question",
      title: "Q",
      difficulty: "extreme",
      tags: ["basics"],
    })
    expect(badDiff.success).toBe(false)

    const emptyTags = cardFrontmatterSchema.safeParse({
      type: "question",
      title: "Q",
      difficulty: "easy",
      tags: [],
    })
    expect(emptyTags.success).toBe(false)
  })

  it("rejects out-of-bounds answer index or answer without options on predict", () => {
    const missingOpts = cardFrontmatterSchema.safeParse({
      type: "predict",
      title: "P",
      difficulty: "easy",
      tags: ["basics"],
      answer: 0,
    })
    expect(missingOpts.success).toBe(false)

    const outOfBounds = cardFrontmatterSchema.safeParse({
      type: "predict",
      title: "P",
      difficulty: "easy",
      tags: ["basics"],
      options: ["One", "Two"],
      answer: 2,
    })
    expect(outOfBounds.success).toBe(false)
  })

  it("rejects compare without left/right and problem without complexity", () => {
    expect(
      cardFrontmatterSchema.safeParse({
        type: "compare",
        title: "C",
        difficulty: "easy",
        tags: ["basics"],
        left: "A",
      }).success
    ).toBe(false)

    expect(
      cardFrontmatterSchema.safeParse({
        type: "problem",
        title: "Prob",
        difficulty: "hard",
        tags: ["arrays"],
        approach: "Two pointers",
      }).success
    ).toBe(false)
  })
})

describe("id and readTime helpers", () => {
  it("strips numeric prefixes and extensions consistently", () => {
    expect(stripNumericPrefix("01-basics")).toBe("basics")
    expect(stripNumericPrefix("02-mutable-vs-immutable.md")).toBe(
      "mutable-vs-immutable"
    )
    expect(parseNumericOrder("04-internals", 1)).toBe(4)
    expect(parseNumericOrder("internals", 9)).toBe(9)
  })

  it("estimates readTime with minimum of 1 minute", () => {
    expect(estimateReadTime("short text")).toBe(1)
    expect(estimateReadTime("word ".repeat(350))).toBe(2)
  })
})
