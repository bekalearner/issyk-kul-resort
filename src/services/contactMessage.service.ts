import type { ContactMessage, Prisma } from '@prisma/client';
import { prisma } from '../config/db';
import { NotFoundError } from '../utils/errors';

export interface ContactMessageInput {
  name: string;
  phone: string;
  email?: string | null;
  guestCount?: string | null;
  checkIn?: Date | null;
  checkOut?: Date | null;
  message: string;
}

export async function createContactMessage(data: ContactMessageInput): Promise<ContactMessage> {
  return prisma.contactMessage.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      guestCount: data.guestCount || null,
      checkIn: data.checkIn ?? null,
      checkOut: data.checkOut ?? null,
      message: data.message,
    },
  });
}

export async function listMessages(opts: { read?: boolean; page?: number; pageSize?: number } = {}) {
  const where: Prisma.ContactMessageWhereInput = {};
  if (opts.read !== undefined) where.read = opts.read;
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 50;
  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: [{ read: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactMessage.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export async function findMessageById(id: string): Promise<ContactMessage> {
  const item = await prisma.contactMessage.findUnique({ where: { id } });
  if (!item) throw new NotFoundError('Сообщение не найдено');
  return item;
}

export async function markMessageRead(id: string): Promise<void> {
  await prisma.contactMessage.update({ where: { id }, data: { read: true } });
}

export async function deleteMessage(id: string): Promise<void> {
  await findMessageById(id);
  await prisma.contactMessage.delete({ where: { id } });
}

export async function countUnread(): Promise<number> {
  return prisma.contactMessage.count({ where: { read: false } });
}

export async function recentUnread(limit = 5): Promise<ContactMessage[]> {
  return prisma.contactMessage.findMany({
    where: { read: false },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
