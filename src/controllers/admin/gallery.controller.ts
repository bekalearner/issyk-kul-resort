import type { Request, Response } from 'express';
import { paramStr } from '../../utils/params';
import { gallerySchema } from '../../schemas/index.schemas';
import { zodToFieldErrors, summary } from '../../utils/formErrors';
import {
  createGalleryItem,
  deleteGalleryItem,
  findGalleryById,
  listGallery,
  updateGalleryItem,
} from '../../services/gallery.service';

export async function index(_req: Request, res: Response): Promise<void> {
  const items = await listGallery();
  res.render('admin/gallery/index', {
    title: 'Галерея',
    layout: 'layouts/admin',
    items,
  });
}

export function newForm(_req: Request, res: Response): void {
  res.render('admin/gallery/form', {
    title: 'Новое изображение',
    layout: 'layouts/admin',
    item: null,
    formData: { category: 'LAKE', order: 0 },
    errors: {},
  });
}

export async function create(req: Request, res: Response): Promise<void> {
  let imagePath = typeof req.body?.imagePath === 'string' ? req.body.imagePath.trim() : '';
  if (req.processedImage?.path) imagePath = req.processedImage.path;
  const parsed = gallerySchema.safeParse({ ...req.body, imagePath });
  if (!parsed.success) {
    const errors = zodToFieldErrors(parsed.error);
    req.flash('error', summary(errors));
    res.status(422).render('admin/gallery/form', {
      title: 'Новое изображение',
      layout: 'layouts/admin',
      item: null,
      formData: { ...req.body, imagePath },
      errors,
    });
    return;
  }
  await createGalleryItem({
    title: parsed.data.title,
    category: parsed.data.category,
    imagePath: parsed.data.imagePath,
    alt: parsed.data.alt ?? null,
    order: parsed.data.order,
  });
  req.flash('success', 'Изображение добавлено');
  res.redirect(303, '/admin/gallery');
}

export async function editForm(req: Request, res: Response): Promise<void> {
  const item = await findGalleryById(paramStr(req.params.id));
  res.render('admin/gallery/form', {
    title: `Редактирование: ${item.title}`,
    layout: 'layouts/admin',
    item,
    formData: item,
    errors: {},
  });
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = paramStr(req.params.id);
  let imagePath = typeof req.body?.imagePath === 'string' ? req.body.imagePath.trim() : '';
  if (req.processedImage?.path) imagePath = req.processedImage.path;
  const parsed = gallerySchema.safeParse({ ...req.body, imagePath });
  if (!parsed.success) {
    const errors = zodToFieldErrors(parsed.error);
    req.flash('error', summary(errors));
    const item = await findGalleryById(id).catch(() => null);
    res.status(422).render('admin/gallery/form', {
      title: item ? `Редактирование: ${item.title}` : 'Редактирование',
      layout: 'layouts/admin',
      item,
      formData: { ...req.body, imagePath },
      errors,
    });
    return;
  }
  await updateGalleryItem(id, {
    title: parsed.data.title,
    category: parsed.data.category,
    imagePath: parsed.data.imagePath,
    alt: parsed.data.alt ?? null,
    order: parsed.data.order,
  });
  req.flash('success', 'Изображение сохранено');
  const item = await findGalleryById(id);
  res.render('admin/gallery/form', {
    title: `Редактирование: ${item.title}`,
    layout: 'layouts/admin',
    item,
    formData: item,
    errors: {},
  });
}

export async function destroy(req: Request, res: Response): Promise<void> {
  await deleteGalleryItem(paramStr(req.params.id));
  req.flash('success', 'Изображение удалено');
  res.redirect(303, '/admin/gallery');
}
