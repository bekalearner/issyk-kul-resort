import type { BookingCondition } from '@prisma/client';
import { prisma } from '../config/db';
import { NotFoundError } from '../utils/errors';

export async function listBookingConditions(): Promise<BookingCondition[]> {
  return prisma.bookingCondition.findMany({ orderBy: { order: 'asc' } });
}

export async function findBookingConditionById(id: string): Promise<BookingCondition> {
  const item = await prisma.bookingCondition.findUnique({ where: { id } });
  if (!item) throw new NotFoundError('Условие не найдено');
  return item;
}

export interface BookingConditionInput {
  title: string;
  content: string;
  icon: string;
  order: number;
}

export async function createBookingCondition(data: BookingConditionInput): Promise<BookingCondition> {
  return prisma.bookingCondition.create({ data });
}

export async function updateBookingCondition(id: string, data: BookingConditionInput): Promise<BookingCondition> {
  return prisma.bookingCondition.update({ where: { id }, data });
}

export async function deleteBookingCondition(id: string): Promise<void> {
  await findBookingConditionById(id);
  await prisma.bookingCondition.delete({ where: { id } });
}
