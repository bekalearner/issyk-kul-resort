import type { Request, Response } from 'express';
import type { GalleryCategory } from '@prisma/client';
import { getSettings } from '../../services/settings.service';
import { listGallery } from '../../services/gallery.service';

const VALID_CATEGORIES: GalleryCategory[] = ['LAKE', 'ROOMS', 'FOOD', 'ACTIVITIES'];

export async function index(req: Request, res: Response): Promise<void> {
  const rawCategory = typeof req.query.category === 'string' ? req.query.category.toUpperCase() : '';
  const category = (VALID_CATEGORIES as string[]).includes(rawCategory)
    ? (rawCategory as GalleryCategory)
    : undefined;

  const [settings, items] = await Promise.all([getSettings(), listGallery(category)]);

  res.render('public/gallery', {
    title: 'Фотогалерея — Иссык-Куль Резорт',
    settings,
    items,
    activeCategory: category?.toLowerCase() ?? 'all',
  });
}
