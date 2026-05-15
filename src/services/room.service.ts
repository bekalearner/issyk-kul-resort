import type { Prisma, Room, RoomImage } from '@prisma/client';
import { prisma } from '../config/db';
import { NotFoundError } from '../utils/errors';
import { makeSlug } from '../utils/slugify';
import { deleteImageFiles } from './image.service';

export type RoomWithRelations = Room & {
  images: RoomImage[];
  amenities: { id: string; text: string; order: number }[];
};

export async function listAll(opts: { featured?: boolean; limit?: number } = {}): Promise<RoomWithRelations[]> {
  return prisma.room.findMany({
    where: opts.featured !== undefined ? { featured: opts.featured } : undefined,
    orderBy: [{ order: 'asc' }, { priceSom: 'asc' }],
    take: opts.limit,
    include: {
      images: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
      amenities: { orderBy: { order: 'asc' } },
    },
  });
}

export async function findById(id: string): Promise<RoomWithRelations> {
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      images: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
      amenities: { orderBy: { order: 'asc' } },
    },
  });
  if (!room) throw new NotFoundError('Номер не найден');
  return room;
}

export async function findBySlug(slug: string): Promise<RoomWithRelations> {
  const room = await prisma.room.findUnique({
    where: { slug },
    include: {
      images: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
      amenities: { orderBy: { order: 'asc' } },
    },
  });
  if (!room) throw new NotFoundError('Номер не найден');
  return room;
}

export interface RoomInput {
  name: string;
  slug?: string;
  category: 'STANDARD' | 'DELUXE' | 'COTTAGE';
  description: string;
  shortDescription: string;
  priceSom: number;
  areaSqm: number;
  capacityMin: number;
  capacityMax: number;
  badge?: string | null;
  featured: boolean;
  order: number;
  amenities: string[];
}

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base || 'room';
  let counter = 1;
  while (true) {
    const existing = await prisma.room.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    counter += 1;
    candidate = `${base}-${counter}`;
  }
}

export async function createRoom(input: RoomInput): Promise<Room> {
  const baseSlug = makeSlug(input.slug || input.name);
  const slug = await ensureUniqueSlug(baseSlug);
  return prisma.room.create({
    data: {
      slug,
      name: input.name,
      category: input.category,
      description: input.description,
      shortDescription: input.shortDescription,
      priceSom: input.priceSom,
      areaSqm: input.areaSqm,
      capacityMin: input.capacityMin,
      capacityMax: input.capacityMax,
      badge: input.badge || null,
      featured: input.featured,
      order: input.order,
      amenities: {
        create: input.amenities.map((text, idx) => ({ text, order: idx })),
      },
    },
  });
}

export async function updateRoom(id: string, input: RoomInput): Promise<Room> {
  const baseSlug = makeSlug(input.slug || input.name);
  const slug = await ensureUniqueSlug(baseSlug, id);
  return prisma.$transaction(async (tx) => {
    await tx.roomAmenity.deleteMany({ where: { roomId: id } });
    return tx.room.update({
      where: { id },
      data: {
        slug,
        name: input.name,
        category: input.category,
        description: input.description,
        shortDescription: input.shortDescription,
        priceSom: input.priceSom,
        areaSqm: input.areaSqm,
        capacityMin: input.capacityMin,
        capacityMax: input.capacityMax,
        badge: input.badge || null,
        featured: input.featured,
        order: input.order,
        amenities: {
          create: input.amenities.map((text, idx) => ({ text, order: idx })),
        },
      },
    });
  });
}

export async function deleteRoom(id: string): Promise<void> {
  const room = await prisma.room.findUnique({ where: { id }, include: { images: true } });
  if (!room) throw new NotFoundError('Номер не найден');
  for (const img of room.images) {
    await deleteImageFiles(img.path);
  }
  await prisma.room.delete({ where: { id } });
}

export async function addRoomImage(
  roomId: string,
  data: { path: string; alt?: string; isPrimary?: boolean },
): Promise<RoomImage> {
  const room = await prisma.room.findUnique({ where: { id: roomId }, include: { images: true } });
  if (!room) throw new NotFoundError('Номер не найден');
  const isFirst = room.images.length === 0;
  return prisma.roomImage.create({
    data: {
      roomId,
      path: data.path,
      alt: data.alt,
      isPrimary: data.isPrimary ?? isFirst,
      order: room.images.length,
    },
  });
}

export async function deleteRoomImage(imageId: string): Promise<void> {
  const image = await prisma.roomImage.findUnique({ where: { id: imageId } });
  if (!image) throw new NotFoundError('Изображение не найдено');
  await deleteImageFiles(image.path);
  await prisma.roomImage.delete({ where: { id: imageId } });
}

export async function setPrimaryImage(roomId: string, imageId: string): Promise<void> {
  await prisma.$transaction([
    prisma.roomImage.updateMany({ where: { roomId }, data: { isPrimary: false } }),
    prisma.roomImage.update({ where: { id: imageId }, data: { isPrimary: true } }),
  ]);
}

export async function countRooms(): Promise<number> {
  return prisma.room.count();
}

export type RoomCreateInputAlias = Prisma.RoomCreateInput;
