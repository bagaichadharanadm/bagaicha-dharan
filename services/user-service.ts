import prisma from '@/db';
import { User } from '@prisma/client';

/**
 * Retrieves a user by their unique ID.
 * @param {string} id - The unique ID of the user.
 * @returns {Promise<User | null>} A promise that resolves to the user object if found, or null otherwise.
 */
export async function getUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}

/**
 * Retrieves a user by their email.
 * @param {string} email - The email of the user.
 * @returns {Promise<User | null>} A promise that resolves to the user object if found, or null otherwise.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email } });
}

/**
 * Retrieves a user by either their name or email.
 * @param {Object} params - An object containing the name and email of the user.
 * @param {string} params.name - The name of the user.
 * @param {string} params.email - The email of the user.
 * @returns {Promise<User | null>} A promise that resolves to the user object if found, or null otherwise.
 */
export async function getUserByNameOrEmail({ name, email }: { name: string; email: string }): Promise<User | null> {
  return await prisma.user.findFirst({
    where: {
      OR: [{ name }, { email }],
    },
  });
}

/**
 * Creates a new user with the specified details.
 * @param {Object} params - An object containing the details of the user to be created.
 * @param {string} params.name - The name of the user.
 * @param {string} params.email - The email of the user.
 * @param {string} params.hashedPassword - The hashed password of the user.
 * @returns {Promise<User>} A promise that resolves to the created user object.
 */
export async function createUser({
  name,
  email,
  hashedPassword,
}: {
  name: string;
  email: string;
  hashedPassword: string;
}): Promise<User> {
  return await prisma.user.create({ data: { name, email, password: hashedPassword } });
}
