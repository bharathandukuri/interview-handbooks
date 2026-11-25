import { z } from "zod"

export const CARD_TYPES = [
  "question",
  "concept",
  "predict",
  "compare",
  "pitfall",
  "problem",
] as const

export const DIFFICULTIES = ["easy", "medium", "hard"] as const

export const ALLOWED_DIRECTIVES = [
  "tip",
  "pitfall",
  "insight",
  "complexity",
] as const

export const cardTypeSchema = z.enum(CARD_TYPES)
export const difficultySchema = z.enum(DIFFICULTIES)

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, {
    message: "must be a valid hex color (e.g. #4A90E2)",
  })

export const handbookYmlSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, {
      message: "must contain only lowercase letters, numbers, and hyphens",
    }),
  name: z.string().trim().min(1, "cannot be empty"),
  tagline: z.string().trim().min(1, "cannot be empty"),
  icon: z.string().trim().min(1, "cannot be empty"),
  accent: hexColorSchema,
  accent2: hexColorSchema,
  version: z.number().int().positive(),
  chapters: z.array(z.string().trim().min(1)).min(1),
})

export const chapterYmlSchema = z.object({
  title: z.string().trim().min(1, "cannot be empty"),
  emoji: z.string().trim().min(1, "cannot be empty"),
  description: z.string().trim().min(1, "cannot be empty"),
})

const commonCardFields = {
  title: z.string().trim().min(1, "cannot be empty"),
  difficulty: difficultySchema,
  tags: z.array(z.string().trim().min(1)).min(1, "must include at least 1 tag"),
  mostAsked: z.boolean().optional().default(false),
  readTime: z.number().int().positive().optional(),
  related: z.array(z.string().trim().min(1)).optional().default([]),
  revision: z.array(z.string().trim().min(1)).optional().default([]),
}

const questionFrontmatterSchema = z.object({
  type: z.literal("question"),
  ...commonCardFields,
})

const conceptFrontmatterSchema = z.object({
  type: z.literal("concept"),
  ...commonCardFields,
})

const predictFrontmatterSchema = z.object({
  type: z.literal("predict"),
  ...commonCardFields,
  options: z.array(z.string().trim().min(1)).min(2).optional(),
  answer: z.number().int().nonnegative().optional(),
})

const compareFrontmatterSchema = z.object({
  type: z.literal("compare"),
  ...commonCardFields,
  left: z.string().trim().min(1, "cannot be empty"),
  right: z.string().trim().min(1, "cannot be empty"),
})

const pitfallFrontmatterSchema = z.object({
  type: z.literal("pitfall"),
  ...commonCardFields,
})

const problemFrontmatterSchema = z.object({
  type: z.literal("problem"),
  ...commonCardFields,
  complexity: z.object({
    time: z.string().trim().min(1, "cannot be empty"),
    space: z.string().trim().min(1, "cannot be empty"),
  }),
  approach: z.string().trim().min(1, "cannot be empty"),
})

export const cardFrontmatterSchema = z
  .discriminatedUnion("type", [
    questionFrontmatterSchema,
    conceptFrontmatterSchema,
    predictFrontmatterSchema,
    compareFrontmatterSchema,
    pitfallFrontmatterSchema,
    problemFrontmatterSchema,
  ])
  .superRefine((data, ctx) => {
    if (data.type === "predict" && data.answer !== undefined) {
      if (!data.options || data.options.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["options"],
          message: "must provide options when answer index is specified",
        })
      } else if (data.answer >= data.options.length) {
        ctx.addIssue({
          code: "custom",
          path: ["answer"],
          message: `answer index ${data.answer} is out of bounds for ${data.options.length} options`,
        })
      }
    }
  })

export type HandbookYml = z.infer<typeof handbookYmlSchema>
export type ChapterYml = z.infer<typeof chapterYmlSchema>
export type CardFrontmatter = z.infer<typeof cardFrontmatterSchema>

export class ContentValidationError extends Error {
  readonly filePath: string
  readonly field: string

  constructor(filePath: string, field: string, message: string) {
    super(
      `Content validation error in ${filePath} [field: ${field}]: ${message}`
    )
    this.name = "ContentValidationError"
    this.filePath = filePath
    this.field = field
  }
}

export function formatZodValidationError(
  filePath: string,
  error: z.ZodError
): ContentValidationError {
  const firstIssue = error.issues[0]
  const field =
    firstIssue && firstIssue.path.length > 0
      ? firstIssue.path.join(".")
      : "frontmatter"
  const message = firstIssue?.message ?? error.message
  return new ContentValidationError(filePath, field, message)
}

export function stripNumericPrefix(name: string): string {
  return name.replace(/\.md$/i, "").replace(/^\d+-/, "")
}

export function parseNumericOrder(name: string, fallback: number): number {
  const match = /^(\d+)-/.exec(name)
  if (!match) return fallback
  return Number.parseInt(match[1], 10)
}

export function estimateReadTime(plainText: string): number {
  const words = plainText.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
