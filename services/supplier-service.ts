import prisma from '@/db';
import { Supplier } from '@prisma/client';

export async function getAllSupplierNamesAndIds(): Promise<{ id: string; name: string }[]> {
  const suppliers = await prisma.supplier.findMany({
    select: {
      id: true,
      supplierName: true,
    },
    orderBy: { id: 'asc' },
  });

  return suppliers.map((supplier) => ({
    id: supplier.id,
    name: supplier.supplierName,
  }));
}

export async function getAllSuppliers(): Promise<Supplier[]> {
  return await prisma.supplier.findMany({ orderBy: { id: 'asc' } });
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  return await prisma.supplier.findFirst({ where: { id } });
}
