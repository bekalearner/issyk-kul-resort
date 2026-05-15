import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodType } from 'zod';
import { ValidationError } from '../utils/errors';

type Source = 'body' | 'query' | 'params';

export function validate<T>(schema: ZodType<T>, source: Source = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const flat = flattenZodError(result.error);
      next(new ValidationError('Проверьте правильность заполнения формы', flat));
      return;
    }
    (req as unknown as Record<Source, unknown>)[source] = result.data;
    next();
  };
}

function flattenZodError(error: ZodError): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    fields[key] ??= [];
    fields[key].push(issue.message);
  }
  return fields;
}
