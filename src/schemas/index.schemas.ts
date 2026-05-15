import { z } from 'zod';
import { getAllIconValues } from '../services/reference.service';

const checkbox = z
  .union([z.literal('on'), z.literal('true'), z.literal('1'), z.literal(true), z.undefined()])
  .transform((v) => v === 'on' || v === 'true' || v === '1' || v === true);

const iconField = z
  .string()
  .trim()
  .min(2, 'Выберите иконку')
  .refine((v) => getAllIconValues().includes(v), { message: 'Иконка не из справочника' });

export const gallerySchema = z.object({
  title: z.string().trim().min(2, 'Минимум 2 символа').max(200, 'Максимум 200 символов'),
  category: z.enum(['LAKE', 'ROOMS', 'FOOD', 'ACTIVITIES'], { message: 'Выберите категорию' }),
  imagePath: z.string().trim().min(1, 'Укажите ссылку или загрузите файл'),
  alt: z
    .string()
    .trim()
    .max(200, 'Максимум 200 символов')
    .transform((v) => (v ? v : null))
    .nullable()
    .optional(),
  order: z.coerce.number().int('Только целые числа').default(0),
});

export const testimonialSchema = z.object({
  text: z
    .string()
    .trim()
    .min(10, 'Минимум 10 символов')
    .max(2000, 'Максимум 2000 символов'),
  author: z.string().trim().min(2, 'Минимум 2 символа').max(120, 'Максимум 120 символов'),
  city: z.string().trim().min(2, 'Минимум 2 символа').max(120, 'Максимум 120 символов'),
  rating: z.coerce
    .number({ message: 'Выберите рейтинг' })
    .int('Рейтинг — целое число')
    .min(1, 'Минимум 1')
    .max(5, 'Максимум 5'),
  featured: checkbox,
  order: z.coerce.number().int().default(0),
});

export const serviceSchema = z.object({
  name: z.string().trim().min(2, 'Минимум 2 символа').max(200, 'Максимум 200 символов'),
  description: z
    .string()
    .trim()
    .min(5, 'Минимум 5 символов')
    .max(1000, 'Максимум 1000 символов'),
  icon: iconField,
  order: z.coerce.number().int().default(0),
});

export const teamSchema = z.object({
  name: z.string().trim().min(2, 'Минимум 2 символа').max(200, 'Максимум 200 символов'),
  role: z.string().trim().min(2, 'Минимум 2 символа').max(200, 'Максимум 200 символов'),
  bio: z
    .string()
    .trim()
    .max(2000, 'Максимум 2000 символов')
    .transform((v) => (v ? v : null))
    .nullable()
    .optional(),
  imagePath: z.string().trim().min(1, 'Загрузите фото или укажите URL'),
  order: z.coerce.number().int().default(0),
});

export const featureSchema = z.object({
  title: z.string().trim().min(2, 'Минимум 2 символа').max(200, 'Максимум 200 символов'),
  description: z
    .string()
    .trim()
    .min(5, 'Минимум 5 символов')
    .max(1000, 'Максимум 1000 символов'),
  icon: iconField,
  order: z.coerce.number().int().default(0),
});

export const awardSchema = z.object({
  title: z.string().trim().min(2, 'Минимум 2 символа').max(200, 'Максимум 200 символов'),
  description: z
    .string()
    .trim()
    .min(5, 'Минимум 5 символов')
    .max(1000, 'Максимум 1000 символов'),
  icon: iconField,
  order: z.coerce.number().int().default(0),
});

export const faqSchema = z.object({
  question: z.string().trim().min(5, 'Минимум 5 символов').max(500, 'Максимум 500 символов'),
  answer: z.string().trim().min(5, 'Минимум 5 символов').max(2000, 'Максимум 2000 символов'),
  order: z.coerce.number().int().default(0),
  active: checkbox,
});

export const bookingConditionSchema = z.object({
  title: z.string().trim().min(2, 'Минимум 2 символа').max(200, 'Максимум 200 символов'),
  content: z
    .string()
    .trim()
    .min(5, 'Минимум 5 символов')
    .max(2000, 'Максимум 2000 символов'),
  icon: iconField,
  order: z.coerce.number().int().default(0),
});

const jsonField = z
  .string()
  .trim()
  .transform((v, ctx) => {
    if (!v) return null;
    try {
      return JSON.parse(v);
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Невалидный JSON' });
      return z.NEVER;
    }
  });

export const settingsSchema = z.object({
  phonePrimary: z.string().trim().min(1, 'Обязательное поле').max(80),
  phoneSecondary: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((v) => v || null),
  emailPrimary: z.email('Введите корректный email').trim().max(200),
  emailSecondary: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => v || null),
  addressLine1: z.string().trim().min(1, 'Обязательное поле').max(400),
  addressLine2: z.string().trim().min(1, 'Обязательное поле').max(400),
  addressNote: z
    .string()
    .trim()
    .max(400)
    .optional()
    .transform((v) => v || null),
  heroTitle: z.string().trim().min(1, 'Обязательное поле').max(400),
  heroSubtitle: z.string().trim().min(1, 'Обязательное поле').max(400),
  heroImageUrl: z.string().trim().min(1, 'Обязательное поле').max(800),
  aboutPreviewTitle: z.string().trim().min(1, 'Обязательное поле').max(400),
  aboutPreviewText: z.string().trim().min(1, 'Обязательное поле').max(4000),
  aboutHistory: z.string().trim().min(1, 'Обязательное поле').max(8000),
  lakeText: z.string().trim().min(1, 'Обязательное поле').max(4000),
  mapEmbedSrc: z.string().trim().min(1, 'Обязательное поле'),
  footerAboutText: z.string().trim().min(1, 'Обязательное поле').max(1000),
  workingHours: jsonField,
  lakeStats: jsonField,
  socialLinks: jsonField,
  transportInfo: jsonField,
});
