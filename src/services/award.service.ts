import type { Award } from '@prisma/client';
import { prisma } from '../config/db';
import { NotFoundError } from '../utils/errors';

export async function listAwards(): Promise<Award[]> {
  return prisma.award.findMany({ orderBy: { order: 'asc' } });
}

export async function findAwardById(id: string): Promise<Award> {
  const item = await prisma.award.findUnique({ where: { id } });
  if (!item) throw new NotFoundError('Награда не найдена');
  return item;
}

export interface AwardInput {
  title: string;
  description: string;
  icon: string;
  order: number;
}

export async function createAward(data: AwardInput): Promise<Award> {
  return prisma.award.create({ data });
}

export async function updateAward(id: string, data: AwardInput): Promise<Award> {
  return prisma.award.update({ where: { id }, data });
}

export async function deleteAward(id: string): Promise<void> {
  await findAwardById(id);
  await prisma.award.delete({ where: { id } });
}
