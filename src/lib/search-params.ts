import { z } from "zod"

export const cardFilterSearchSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]).optional().catch(undefined),
  tag: z.string().trim().min(1).optional().catch(undefined),
  status: z
    .enum(["all", "untouched", "revisit", "known"])
    .optional()
    .catch(undefined),
  mostAsked: z
    .preprocess(
      (val) =>
        val === 1 || val === "1" || val === true || val === "true"
          ? true
          : undefined,
      z.literal(true).optional()
    )
    .catch(undefined),
  sort: z.enum(["order", "difficulty", "alpha"]).optional().catch(undefined),
})

export type CardFilterSearch = z.infer<typeof cardFilterSearchSchema>
