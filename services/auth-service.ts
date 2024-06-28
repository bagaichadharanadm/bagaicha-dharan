import bcrypt from 'bcryptjs';

/**
 * Hashes a plain text password.
 * @param {string} password - The plain text password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Compares a plain text password with a hashed password.
 * @param {Object} params - An object containing the plain text password and the hashed password.
 * @param {string} params.password - The plain text password.
 * @param {string} params.passwordHash - The hashed password.
 * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, or false otherwise.
 */
export async function comparePasswords({
  password,
  passwordHash,
}: {
  password: string;
  passwordHash: string;
}): Promise<boolean> {
  return await bcrypt.compare(password, passwordHash);
}
