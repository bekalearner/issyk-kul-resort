import type { NextFunction, Request, Response } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session?.userId) {
    next();
    return;
  }
  res.redirect('/admin/login');
}

export function requireGuest(req: Request, res: Response, next: NextFunction): void {
  if (req.session?.userId) {
    res.redirect('/admin');
    return;
  }
  next();
}
