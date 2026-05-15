import type { Request, Response } from 'express';
import { paramStr } from '../../utils/params';
import { roomSchema } from '../../schemas/room.schema';
import { zodToFieldErrors, summary } from '../../utils/formErrors';
import {
  addRoomImage,
  createRoom,
  deleteRoom,
  deleteRoomImage,
  findById,
  listAll,
  setPrimaryImage,
  updateRoom,
} from '../../services/room.service';

function normalizeAmenities(input: unknown): string[] {
  if (Array.isArray(input)) return input.map((s) => String(s));
  if (typeof input === 'string') return [input];
  return [];
}

export async function index(_req: Request, res: Response): Promise<void> {
  const rooms = await listAll();
  res.render('admin/rooms/index', {
    title: 'Номера',
    layout: 'layouts/admin',
    rooms,
  });
}

export function newForm(_req: Request, res: Response): void {
  res.render('admin/rooms/form', {
    title: 'Новый номер',
    layout: 'layouts/admin',
    room: null,
    formData: {
      category: 'STANDARD',
      featured: false,
      capacityMin: 1,
      capacityMax: 2,
      areaSqm: 25,
      priceSom: 3500,
      order: 0,
      amenities: [],
      badge: '',
    },
    errors: {},
  });
}

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = roomSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = zodToFieldErrors(parsed.error);
    req.flash('error', summary(errors));
    res.status(422).render('admin/rooms/form', {
      title: 'Новый номер',
      layout: 'layouts/admin',
      room: null,
      formData: {
        ...req.body,
        featured: !!(req.body as Record<string, unknown>).featured,
        amenities: normalizeAmenities((req.body as Record<string, unknown>).amenities),
      },
      errors,
    });
    return;
  }
  const room = await createRoom({
    name: parsed.data.name,
    slug: parsed.data.slug,
    category: parsed.data.category,
    description: parsed.data.description,
    shortDescription: parsed.data.shortDescription,
    priceSom: parsed.data.priceSom,
    areaSqm: parsed.data.areaSqm,
    capacityMin: parsed.data.capacityMin,
    capacityMax: parsed.data.capacityMax,
    badge: parsed.data.badge ?? null,
    featured: parsed.data.featured,
    order: parsed.data.order,
    amenities: parsed.data.amenities,
  });
  req.flash('success', 'Номер создан');
  res.redirect(303, `/admin/rooms/${room.id}/edit`);
}

export async function editForm(req: Request, res: Response): Promise<void> {
  const room = await findById(paramStr(req.params.id));
  res.render('admin/rooms/form', {
    title: `Редактирование: ${room.name}`,
    layout: 'layouts/admin',
    room,
    formData: {
      ...room,
      amenities: room.amenities.map((a) => a.text),
      badge: room.badge ?? '',
    },
    errors: {},
  });
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = paramStr(req.params.id);
  const parsed = roomSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = zodToFieldErrors(parsed.error);
    req.flash('error', summary(errors));
    const room = await findById(id).catch(() => null);
    res.status(422).render('admin/rooms/form', {
      title: room ? `Редактирование: ${room.name}` : 'Редактирование номера',
      layout: 'layouts/admin',
      room,
      formData: {
        ...req.body,
        featured: !!(req.body as Record<string, unknown>).featured,
        amenities: normalizeAmenities((req.body as Record<string, unknown>).amenities),
      },
      errors,
    });
    return;
  }
  await updateRoom(id, {
    name: parsed.data.name,
    slug: parsed.data.slug,
    category: parsed.data.category,
    description: parsed.data.description,
    shortDescription: parsed.data.shortDescription,
    priceSom: parsed.data.priceSom,
    areaSqm: parsed.data.areaSqm,
    capacityMin: parsed.data.capacityMin,
    capacityMax: parsed.data.capacityMax,
    badge: parsed.data.badge ?? null,
    featured: parsed.data.featured,
    order: parsed.data.order,
    amenities: parsed.data.amenities,
  });
  req.flash('success', 'Номер сохранён');
  const room = await findById(id);
  res.render('admin/rooms/form', {
    title: `Редактирование: ${room.name}`,
    layout: 'layouts/admin',
    room,
    formData: {
      ...room,
      amenities: room.amenities.map((a) => a.text),
      badge: room.badge ?? '',
    },
    errors: {},
  });
}

export async function destroy(req: Request, res: Response): Promise<void> {
  await deleteRoom(paramStr(req.params.id));
  req.flash('success', 'Номер удалён');
  res.redirect(303, '/admin/rooms');
}

export async function uploadImage(req: Request, res: Response): Promise<void> {
  const id = paramStr(req.params.id);
  if (!req.processedImage) {
    req.flash('error', 'Файл не загружен');
    res.redirect(303, `/admin/rooms/${id}/edit`);
    return;
  }
  await addRoomImage(id, {
    path: req.processedImage.path,
    alt: req.processedImage.alt,
  });
  req.flash('success', 'Изображение добавлено');
  res.redirect(303, `/admin/rooms/${id}/edit`);
}

export async function removeImage(req: Request, res: Response): Promise<void> {
  const id = paramStr(req.params.id);
  const imageId = paramStr(req.params.imageId);
  await deleteRoomImage(imageId);
  req.flash('success', 'Изображение удалено');
  res.redirect(303, `/admin/rooms/${id}/edit`);
}

export async function makePrimaryImage(req: Request, res: Response): Promise<void> {
  const id = paramStr(req.params.id);
  const imageId = paramStr(req.params.imageId);
  await setPrimaryImage(id, imageId);
  req.flash('success', 'Главное изображение обновлено');
  res.redirect(303, `/admin/rooms/${id}/edit`);
}
