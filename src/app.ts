import path from 'node:path';
import express, { type Express } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import flash from 'connect-flash';
import expressEjsLayouts from 'express-ejs-layouts';
import pinoHttp from 'pino-http';

import { env } from './config/env';
import { logger } from './config/logger';
import { PUBLIC_DIR, VIEWS_DIR } from './config/paths';
import { sessionMiddleware } from './middleware/session';
import { flashLocals } from './middleware/flashLocals';
import { activeNav } from './middleware/activeNav';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { publicRouter } from './routes/public.routes';
import { adminRouter } from './routes/admin';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // View engine
  app.set('view engine', 'ejs');
  app.set('views', VIEWS_DIR);
  app.use(expressEjsLayouts);
  app.set('layout', 'layouts/main');
  app.set('layout extractScripts', false);
  app.set('layout extractStyles', false);

  // Logger
  app.use(
    pinoHttp({
      logger,
      autoLogging: { ignore: (req) => req.url === '/healthz' || req.url?.startsWith('/uploads') || req.url?.endsWith('.css') || req.url?.endsWith('.js') || req.url?.endsWith('.ico') },
    }),
  );

  // Security & perf
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'https:', 'data:', 'blob:'],
          frameSrc: ["'self'", 'https://www.google.com'],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(compression());
  app.use(cors({ origin: false }));

  // Static
  app.use(
    express.static(PUBLIC_DIR, {
      maxAge: env.NODE_ENV === 'production' ? '1d' : 0,
      etag: true,
    }),
  );

  // Healthcheck (early, no session)
  app.get('/healthz', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Body parsers
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser(env.COOKIE_SECRET));

  // Session + flash
  app.use(sessionMiddleware);
  app.use(flash());

  // Method override (PUT/DELETE via _method query or hidden field)
  app.use(methodOverride('_method'));
  app.use(
    methodOverride(((req: { body?: Record<string, unknown> }) => {
      const body = req.body;
      if (body && typeof body._method === 'string') {
        const method = body._method;
        delete body._method;
        return method;
      }
      return '';
    }) as never),
  );

  // Locals (CSRF, flash, user, active nav)
  app.use(flashLocals);
  app.use(activeNav);

  // Routes
  app.use('/admin', adminRouter);
  app.use('/', publicRouter);

  // 404
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  // Expose for path tests
  app.locals.viewsDir = path.resolve(VIEWS_DIR);

  return app;
}
