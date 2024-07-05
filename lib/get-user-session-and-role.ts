import { auth } from '@/auth';
import { UserRole as UserRoleEnum } from '@prisma/client';

export default async function getUserSessionAndRole(): Promise<{
  userId: string | null;
  isSignedIn: boolean;
  role: UserRoleEnum | null;
}> {
  const session = await auth();

  if (!session) {
    return {
      userId: null,
      isSignedIn: false,
      role: null,
    };
  }

  const {
    user: { id, role },
  } = session;

  return {
    userId: id,
    isSignedIn: true,
    role,
  };
}
