import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { env } from '../config/env';

const PgStore = connectPgSimple(session);

export const sessionMiddleware = session({
  store: new PgStore({
    conString: env.DATABASE_URL,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  name: 'resort.sid',
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24,
  },
});
