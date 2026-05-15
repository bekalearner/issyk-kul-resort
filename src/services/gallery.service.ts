import type { GalleryCategory, GalleryItem } from '@prisma/client';
import { prisma } from '../config/db';
import { NotFoundError } from '../utils/errors';
import { deleteImageFiles } from './image.service';

export async function listGallery(category?: GalleryCategory): Promise<GalleryItem[]> {
  return prisma.galleryItem.findMany({
    where: category ? { category } : undefined,
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function findGalleryById(id: string): Promise<GalleryItem> {
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) throw new NotFoundError('Изображение галереи не найдено');
  return item;
}

export interface GalleryInput {
  title: string;
  category: GalleryCategory;
  imagePath: string;
  alt?: string | null;
  order: number;
}

export async function createGalleryItem(data: GalleryInput): Promise<GalleryItem> {
  return prisma.galleryItem.create({ data });
}

export async function updateGalleryItem(id: string, data: Partial<GalleryInput>): Promise<GalleryItem> {
  return prisma.galleryItem.update({ where: { id }, data });
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const item = await findGalleryById(id);
  await deleteImageFiles(item.imagePath);
  await prisma.galleryItem.delete({ where: { id } });
}

export async function countGallery(): Promise<number> {
  return prisma.galleryItem.count();
}
