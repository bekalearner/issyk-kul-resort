import type { Service } from '@prisma/client';
import { prisma } from '../config/db';
import { NotFoundError } from '../utils/errors';

export async function listServices(): Promise<Service[]> {
  return prisma.service.findMany({ orderBy: { order: 'asc' } });
}

export async function findServiceById(id: string): Promise<Service> {
  const item = await prisma.service.findUnique({ where: { id } });
  if (!item) throw new NotFoundError('Услуга не найдена');
  return item;
}

export interface ServiceInput {
  name: string;
  description: string;
  icon: string;
  order: number;
}

export async function createService(data: ServiceInput): Promise<Service> {
  return prisma.service.create({ data });
}

export async function updateService(id: string, data: ServiceInput): Promise<Service> {
  return prisma.service.update({ where: { id }, data });
}

export async function deleteService(id: string): Promise<void> {
  await findServiceById(id);
  await prisma.service.delete({ where: { id } });
}
