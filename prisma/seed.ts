// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';

// const prismaClientSingleton = () => {
//   return new PrismaClient({
//     log: [
//       {
//         emit: 'stdout',
//         level: 'query',
//       },
//       {
//         emit: 'stdout',
//         level: 'error',
//       },
//       {
//         emit: 'stdout',
//         level: 'info',
//       },
//       {
//         emit: 'stdout',
//         level: 'warn',
//       },
//     ],
//   });
// };

// declare const global: typeof globalThis & {
//   prismaGlobal?: ReturnType<typeof prismaClientSingleton>;
// };

// const prisma = global.prismaGlobal ?? prismaClientSingleton();

// if (process.env.NODE_ENV !== 'production') {
//   global.prismaGlobal = prisma;
// }

// async function main() {
//   const adminName = process.env.ADMIN_NAME;
//   const adminEmail = process.env.ADMIN_EMAIL;
//   const adminPassword = process.env.ADMIN_PASSWORD;

//   if (!adminName || !adminEmail || !adminPassword) {
//     console.error('Missing environment variables for admin credentials.');
//     return;
//   }

//   const hashedPassword = await bcrypt.hash(adminPassword, 10);

//   // Create the admin user
//   const adminUser = await prisma.user.upsert({
//     where: { email: adminEmail }, // Unique identifier to check if user already exists
//     update: {
//       name: adminName,
//       password: hashedPassword,
//       role: 'ADMIN', // Assuming 'ADMIN' is the enum value for admin role
//     },
//     create: {
//       name: adminName,
//       email: adminEmail,
//       password: hashedPassword,
//       role: 'ADMIN', // Assuming 'ADMIN' is the enum value for admin role
//     },
//   });
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
