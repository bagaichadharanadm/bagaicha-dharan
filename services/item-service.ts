import prisma from '@/db';
import { ItemMaster } from '@prisma/client';

export async function getAllItems(): Promise<ItemMaster[]> {
  return await prisma.itemMaster.findMany({ orderBy: { id: 'asc' } });
}

export async function getAllItemNamesAndIds() {
  const suppliers = await prisma.itemMaster.findMany({
    select: {
      id: true,
      itemDesc_EN: true,
    },
    orderBy: { id: 'asc' },
  });

  return suppliers.map((supplier) => ({
    id: supplier.id,
    name: supplier.itemDesc_EN,
  }));
}

export async function getItemById(id: string): Promise<ItemMaster | null> {
  return await prisma.itemMaster.findFirst({ where: { id } });
}
