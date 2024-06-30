import prisma from '@/db';

export async function getAllEmployees(): Promise<{ id: string; name: string }[]> {
  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  });

  return employees.map((employee) => ({
    id: employee.id,
    name: employee.name,
  }));
}
