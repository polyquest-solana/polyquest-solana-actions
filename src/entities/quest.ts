import { z } from "zod";

import { Answer } from "./answer";
import { Token } from "./token";

const AnswerId = z.number().positive();

export const Quest = z.object({
  id: z.number().positive(),
  title: z.string().min(1),
  description: z.string().nullish(),
  creatorAddress: z.string().min(1),
  creatorFeePercent: z.number().min(0).max(1),
  serviceFeePercent: z.number().min(0).max(1),
  tokenId: z.number().positive(),
  token: Token,
  imageUrl: z.string().url(),
  finalAnswerId: AnswerId.nullish(),
  voteCount: z.number().int().nonnegative().default(0),
  totalAmount: z.number().nonnegative().default(0),
  answers: z.array(Answer),
});

export type Quest = z.infer<typeof Quest>;
