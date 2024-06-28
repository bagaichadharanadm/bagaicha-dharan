import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(1).max(40),
});
