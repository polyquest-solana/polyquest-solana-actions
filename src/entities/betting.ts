import { z } from "zod";
import { Answer } from "./answer";
import { Quest } from "./quest";

export const BettingSource = z.enum(["APP", "ACTIONS"]);

export const Betting = z.object({
  id: z.number().positive(),
  questId: z.number().positive(),
  quest: Quest.omit({ answers: true }),
  answerId: z.number().positive(),
  answer: Answer,
  walletAddress: z.string().min(1),
  spent: z.number().positive().max(1e6),
  reward: z.number().nonnegative().default(0),
  bettingTxn: z.string().min(1).nullish(),
  claimTxn: z.string().min(1).nullish(),
  // isValid: z.boolean().default(true),
  // isClaimed: z.boolean().default(false),
  source: BettingSource,
});

export type BettingSource = z.infer<typeof BettingSource>;
export type Betting = z.infer<typeof Betting>;
