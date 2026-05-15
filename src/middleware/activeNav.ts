import type { NextFunction, Request, Response } from 'express';

const NAV_MAP: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/rooms': 'rooms',
  '/gallery': 'gallery',
  '/contacts': 'contacts',
};

export function activeNav(req: Request, res: Response, next: NextFunction): void {
  if (req.path.startsWith('/admin')) {
    res.locals.activeNav = '';
  } else if (req.path.startsWith('/rooms')) {
    res.locals.activeNav = 'rooms';
  } else {
    res.locals.activeNav = NAV_MAP[req.path] ?? '';
  }
  next();
}
