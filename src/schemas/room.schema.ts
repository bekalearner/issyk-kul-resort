import { z } from 'zod';
import { isValidRoomBadge } from '../services/reference.service';

const checkbox = z
  .union([z.literal('on'), z.literal('true'), z.literal('1'), z.literal(true), z.undefined()])
  .transform((v) => v === 'on' || v === 'true' || v === '1' || v === true);

const amenitiesField = z
  .union([z.string(), z.array(z.string()), z.undefined()])
  .transform((v) => {
    if (!v) return [] as string[];
    if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
    return String(v)
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  });

const badgeField = z
  .string()
  .trim()
  .max(40)
  .refine((v) => isValidRoomBadge(v), { message: 'Выберите бейдж из списка' })
  .transform((v) => (v ? v : null))
  .nullable()
  .optional();

export const roomSchema = z
  .object({
    name: z.string().trim().min(2, 'Минимум 2 символа').max(200, 'Максимум 200 символов'),
    slug: z.string().trim().max(200).optional().default(''),
    category: z.enum(['STANDARD', 'DELUXE', 'COTTAGE'], { message: 'Выберите категорию' }),
    description: z.string().trim().min(10, 'Минимум 10 символов'),
    shortDescription: z
      .string()
      .trim()
      .min(5, 'Минимум 5 символов')
      .max(500, 'Максимум 500 символов'),
    priceSom: z.coerce.number().int('Только целое число').nonnegative('Цена не может быть отрицательной'),
    areaSqm: z.coerce.number().int('Только целое число').positive('Площадь больше 0'),
    capacityMin: z.coerce.number().int('Только целое число').positive('Минимум 1'),
    capacityMax: z.coerce.number().int('Только целое число').positive('Минимум 1'),
    badge: badgeField,
    featured: checkbox,
    order: z.coerce.number().int().default(0),
    amenities: amenitiesField,
  })
  .refine((data) => data.capacityMax >= data.capacityMin, {
    message: 'Максимум должен быть не меньше минимума',
    path: ['capacityMax'],
  });

export type RoomFormInput = z.infer<typeof roomSchema>;
