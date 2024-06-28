'use server';

import { LoginSchema } from '@/schemas/login-schema';
import { z } from 'zod';

export async function login(formData: z.infer<typeof LoginSchema>) {
  console.log(formData);
}
