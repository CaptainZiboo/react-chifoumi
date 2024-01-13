import * as z from "zod";

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Le nom d'utilisateur doit comporter au moins 3 caractères.",
    })
    .max(20, {
      message: "Le nom d'utilisateur doit comporter au plus 20 caractères.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Le mot de passe doit comporter au moins 8 caractères.",
    })
    .max(100, {
      message: "Le mot de passe doit comporter au plus 100 caractères.",
    }),
});

export interface IRegister extends z.infer<typeof RegisterSchema> {}
