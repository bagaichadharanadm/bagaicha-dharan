'use server';

import { signOut } from '@/auth';
import { redirect } from 'next/navigation';

export async function logout() {
  try {
    await signOut();
  } catch (error) {}
  redirect('/auth/login');
}
