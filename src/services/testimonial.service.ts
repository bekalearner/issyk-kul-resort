import type { Testimonial } from '@prisma/client';
import { prisma } from '../config/db';
import { NotFoundError } from '../utils/errors';

export async function listTestimonials(opts: { featured?: boolean; limit?: number } = {}): Promise<Testimonial[]> {
  return prisma.testimonial.findMany({
    where: opts.featured !== undefined ? { featured: opts.featured } : undefined,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    take: opts.limit,
  });
}

export async function findTestimonialById(id: string): Promise<Testimonial> {
  const item = await prisma.testimonial.findUnique({ where: { id } });
  if (!item) throw new NotFoundError('Отзыв не найден');
  return item;
}

export interface TestimonialInput {
  text: string;
  author: string;
  city: string;
  rating: number;
  featured: boolean;
  order: number;
}

export async function createTestimonial(data: TestimonialInput): Promise<Testimonial> {
  return prisma.testimonial.create({ data });
}

export async function updateTestimonial(id: string, data: TestimonialInput): Promise<Testimonial> {
  return prisma.testimonial.update({ where: { id }, data });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await findTestimonialById(id);
  await prisma.testimonial.delete({ where: { id } });
}
