import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(3).max(60),
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(40),
});
