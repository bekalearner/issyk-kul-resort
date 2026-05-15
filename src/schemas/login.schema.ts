import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Введите логин').max(120),
  password: z.string().min(1, 'Введите пароль').max(200),
});

export type LoginInput = z.infer<typeof loginSchema>;
