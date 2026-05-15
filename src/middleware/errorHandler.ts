import type { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import { env } from '../config/env';
import { AppError } from '../utils/errors';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = err instanceof AppError ? err.statusCode : 500;
  const isCsrf = (err as { code?: string }).code === 'EBADCSRFTOKEN';

  logger.error({ err, path: req.path, method: req.method }, err.message);

  if (req.path.startsWith('/admin') && req.session?.userId) {
    res.status(status).render('admin/error', {
      title: 'Ошибка',
      layout: 'layouts/admin',
      status,
      message: isCsrf ? 'Сессия истекла. Обновите страницу.' : err.message,
      stack: env.NODE_ENV === 'development' ? err.stack : null,
    });
    return;
  }

  res.status(status).render('public/error', {
    title: 'Ошибка',
    layout: 'layouts/main',
    activeNav: '',
    status,
    message: isCsrf
      ? 'Сессия истекла. Обновите страницу.'
      : status >= 500
        ? 'Внутренняя ошибка сервера'
        : err.message,
    stack: env.NODE_ENV === 'development' ? err.stack : null,
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).render('public/error', {
    title: 'Страница не найдена',
    layout: 'layouts/main',
    activeNav: '',
    status: 404,
    message: 'Запрашиваемая страница не найдена',
    stack: null,
  });
}
