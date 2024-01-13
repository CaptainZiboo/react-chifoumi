import * as z from "zod";

export const MoveSchema = z.object({
  move: z.enum(["rock", "paper", "scissors"]),
});

export type IMove = z.infer<typeof MoveSchema>;
