import type { Faq } from '@prisma/client';
import { prisma } from '../config/db';
import { NotFoundError } from '../utils/errors';

export async function listFaqs(opts: { activeOnly?: boolean } = {}): Promise<Faq[]> {
  return prisma.faq.findMany({
    where: opts.activeOnly ? { active: true } : undefined,
    orderBy: { order: 'asc' },
  });
}

export async function findFaqById(id: string): Promise<Faq> {
  const item = await prisma.faq.findUnique({ where: { id } });
  if (!item) throw new NotFoundError('Вопрос не найден');
  return item;
}

export interface FaqInput {
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

export async function createFaq(data: FaqInput): Promise<Faq> {
  return prisma.faq.create({ data });
}

export async function updateFaq(id: string, data: FaqInput): Promise<Faq> {
  return prisma.faq.update({ where: { id }, data });
}

export async function deleteFaq(id: string): Promise<void> {
  await findFaqById(id);
  await prisma.faq.delete({ where: { id } });
}
