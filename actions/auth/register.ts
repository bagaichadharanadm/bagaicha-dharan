'use server';

import { RegisterSchema } from '@/schemas/register-schema';
import { z } from 'zod';

export async function login(formData: z.infer<typeof RegisterSchema>) {}
