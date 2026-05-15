import type { Feature } from '@prisma/client';
import { prisma } from '../config/db';
import { NotFoundError } from '../utils/errors';

export async function listFeatures(): Promise<Feature[]> {
  return prisma.feature.findMany({ orderBy: { order: 'asc' } });
}

export async function findFeatureById(id: string): Promise<Feature> {
  const item = await prisma.feature.findUnique({ where: { id } });
  if (!item) throw new NotFoundError('Преимущество не найдено');
  return item;
}

export interface FeatureInput {
  title: string;
  description: string;
  icon: string;
  order: number;
}

export async function createFeature(data: FeatureInput): Promise<Feature> {
  return prisma.feature.create({ data });
}

export async function updateFeature(id: string, data: FeatureInput): Promise<Feature> {
  return prisma.feature.update({ where: { id }, data });
}

export async function deleteFeature(id: string): Promise<void> {
  await findFeatureById(id);
  await prisma.feature.delete({ where: { id } });
}
