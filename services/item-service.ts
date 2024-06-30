import prisma from '@/db';
import { Item } from '@prisma/client';

export async function getAllItems(): Promise<Item[]> {
  return await prisma.item.findMany({ orderBy: { id: 'asc' } });
}

export async function getAllItemNamesAndIds() {
  const suppliers = await prisma.item.findMany({
    select: {
      id: true,
      itemDesc: true,
    },
    orderBy: { id: 'asc' },
  });

  return suppliers.map((supplier) => ({
    id: supplier.id,
    name: supplier.itemDesc,
  }));
}

export async function getItemById(id: string): Promise<Item | null> {
  return await prisma.item.findFirst({ where: { id } });
}
