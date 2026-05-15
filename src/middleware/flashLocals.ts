import type { NextFunction, Request, Response } from 'express';
import { generateCsrfToken } from './csrf';
import { References } from '../services/reference.service';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function flashLocals(req: Request, res: Response, next: NextFunction): void {
  res.locals.user = req.session?.userId
    ? { id: req.session.userId, username: req.session.username }
    : null;
  res.locals.activeNav = '';
  res.locals.currentYear = new Date().getFullYear();
  res.locals.references = References;
  res.locals.errors = {};
  res.locals.formData = {};
  res.locals.flash = {};
  res.locals.csrfToken = '';

  // Generate CSRF token only on safe methods (page renders).
  // Unsafe methods rely on the existing cookie for validation; touching it here
  // would invalidate the token the user just submitted.
  if (SAFE_METHODS.has(req.method)) {
    try {
      res.locals.csrfToken = generateCsrfToken(req, res, {
        overwrite: false,
        validateOnReuse: false,
      });
    } catch {
      res.locals.csrfToken = '';
    }
  }

  // Read flash lazily — controllers may push to flash AFTER this middleware
  // (e.g. when rendering a form on validation error in the same request).
  // We intercept res.render so that the latest flash state is always picked up.
  const originalRender = res.render.bind(res);
  res.render = function patchedRender(view: string, locals?: object | ((err: Error, html: string) => void), callback?: (err: Error, html: string) => void) {
    if (req.flash) {
      const collected = req.flash();
      // Merge: anything already on locals.flash (rare manual override) takes precedence.
      res.locals.flash = { ...collected, ...(res.locals.flash || {}) };
    }
    // Refresh CSRF token if rendering happens on POST and we still need one for the next submit
    if (!SAFE_METHODS.has(req.method) && !res.locals.csrfToken) {
      try {
        res.locals.csrfToken = generateCsrfToken(req, res, {
          overwrite: false,
          validateOnReuse: false,
        });
      } catch {
        /* ignore */
      }
    }
    return originalRender(view, locals as object, callback as (err: Error, html: string) => void);
  } as typeof res.render;

  next();
}
