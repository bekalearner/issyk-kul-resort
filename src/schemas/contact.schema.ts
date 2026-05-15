import { z } from 'zod';

const optionalString = z
  .string()
  .trim()
  .transform((v) => (v ? v : null))
  .nullable()
  .optional();

const optionalDate = z
  .string()
  .trim()
  .transform((v) => (v ? new Date(v) : null))
  .nullable()
  .optional();

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, 'Имя должно быть не короче 2 символов').max(120),
    phone: z
      .string()
      .trim()
      .min(9, 'Введите корректный номер телефона')
      .max(40),
    email: z
      .string()
      .trim()
      .email('Введите корректный email')
      .or(z.literal('').transform(() => null))
      .nullable()
      .optional(),
    guestCount: optionalString,
    checkIn: optionalDate,
    checkOut: optionalDate,
    message: z.string().trim().min(10, 'Сообщение должно быть не короче 10 символов').max(2000),
  })
  .refine(
    (data) => {
      if (data.checkIn && data.checkOut) {
        return data.checkOut > data.checkIn;
      }
      return true;
    },
    { message: 'Дата выезда должна быть позже даты заезда', path: ['checkOut'] },
  );

export type ContactInput = z.infer<typeof contactSchema>;
