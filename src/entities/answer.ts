import { z } from "zod";

export const Answer = z.object({
  id: z.number().positive(),
  questId: z.number().positive(),
  title: z.string().min(1),
  voteCount: z.number().int().nonnegative().default(0),
  totalAmount: z.number().nonnegative().default(0),
  percent: z.number().min(0).max(100).default(0).optional(),
  isCorrect: z.boolean().nullish(),
});

export type Answer = z.infer<typeof Answer>;
