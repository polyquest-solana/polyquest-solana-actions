import { z } from "zod";

export const Token = z.object({
  id: z.number().positive(),
  address: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().min(1),
  decimals: z.number().positive(),
  imageUrl: z.string().url(),
});

export type Token = z.infer<typeof Token>;
