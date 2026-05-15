import type { Request, Response } from 'express';
import { loginSchema } from '../../schemas/login.schema';
import { findByUsername, verifyPassword } from '../../services/adminUser.service';
import { zodToFieldErrors } from '../../utils/formErrors';

export function loginForm(_req: Request, res: Response): void {
  res.render('admin/login', {
    title: 'Вход в админ-панель',
    layout: 'layouts/admin-blank',
    formData: {},
    errors: {},
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = zodToFieldErrors(parsed.error);
    req.flash('error', 'Введите логин и пароль');
    res.status(422).render('admin/login', {
      title: 'Вход в админ-панель',
      layout: 'layouts/admin-blank',
      formData: { username: (req.body as Record<string, unknown>).username ?? '' },
      errors,
    });
    return;
  }

  const user = await findByUsername(parsed.data.username);
  if (!user) {
    req.flash('error', 'Неверный логин или пароль');
    res.status(401).render('admin/login', {
      title: 'Вход в админ-панель',
      layout: 'layouts/admin-blank',
      formData: { username: parsed.data.username },
      errors: { _: ['Неверный логин или пароль'] },
    });
    return;
  }

  const ok = await verifyPassword(user, parsed.data.password);
  if (!ok) {
    req.flash('error', 'Неверный логин или пароль');
    res.status(401).render('admin/login', {
      title: 'Вход в админ-панель',
      layout: 'layouts/admin-blank',
      formData: { username: parsed.data.username },
      errors: { _: ['Неверный логин или пароль'] },
    });
    return;
  }

  req.session.regenerate((err) => {
    if (err) {
      req.flash('error', 'Ошибка авторизации');
      res.redirect(303, '/admin/login');
      return;
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.save(() => {
      res.redirect(303, '/admin');
    });
  });
}

export function logout(req: Request, res: Response): void {
  req.session.destroy(() => {
    res.clearCookie('resort.sid');
    res.redirect(303, '/admin/login');
  });
}
