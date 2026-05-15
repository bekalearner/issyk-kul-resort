import { doubleCsrf } from 'csrf-csrf';
import { env } from '../config/env';

const csrfUtils = doubleCsrf({
  getSecret: () => env.CSRF_SECRET,
  getSessionIdentifier: (req) => (req as unknown as { sessionID?: string }).sessionID ?? '',
  cookieName: env.NODE_ENV === 'production' ? '__Host-resort.csrf' : 'resort.csrf',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getCsrfTokenFromRequest: (req) => {
    const body = (req as { body?: Record<string, unknown> }).body;
    const headers = (req as { headers?: Record<string, string | string[] | undefined> }).headers;
    return (body?._csrf as string) || (headers?.['x-csrf-token'] as string) || '';
  },
});

export const doubleCsrfProtection = csrfUtils.doubleCsrfProtection;
export const generateCsrfToken = csrfUtils.generateCsrfToken;
export const invalidCsrfTokenError = csrfUtils.invalidCsrfTokenError;
