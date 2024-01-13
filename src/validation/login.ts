import * as z from "zod";

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export interface ILogin extends z.infer<typeof LoginSchema> {}
