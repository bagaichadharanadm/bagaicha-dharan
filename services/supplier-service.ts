import prisma from '@/db';
import { SupplierMaster } from '@prisma/client';

export async function getAllSupplierNamesAndIds(): Promise<{ id: string; name: string }[]> {
  const suppliers = await prisma.supplierMaster.findMany({
    select: {
      id: true,
      supplierName_EN: true,
    },
    orderBy: { id: 'asc' },
  });

  return suppliers.map((supplier) => ({
    id: supplier.id,
    name: supplier.supplierName_EN,
  }));
}

export async function getAllSuppliers(): Promise<SupplierMaster[]> {
  return await prisma.supplierMaster.findMany({ orderBy: { id: 'asc' } });
}

export async function getSupplierById(id: string): Promise<SupplierMaster | null> {
  return await prisma.supplierMaster.findFirst({ where: { id } });
}
