import type { ZodError } from 'zod';

export type FieldErrors = Record<string, string[]>;

export function zodToFieldErrors(error: ZodError): FieldErrors {
  const map: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.join('.') : '_';
    (map[key] ??= []).push(issue.message);
  }
  return map;
}

export function flattenErrors(errors: FieldErrors): string[] {
  const list: string[] = [];
  for (const messages of Object.values(errors)) {
    for (const m of messages) list.push(m);
  }
  return list;
}

export function summary(errors: FieldErrors, fallback = 'Проверьте правильность заполнения формы'): string {
  const all = flattenErrors(errors);
  if (!all.length) return fallback;
  if (all.length === 1) return all[0]!;
  return `${all[0]} (и ещё ошибок: ${all.length - 1})`;
}

export function ensureArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}
