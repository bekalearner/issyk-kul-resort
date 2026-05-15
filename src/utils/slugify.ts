import slugifyLib from 'slugify';

export function makeSlug(input: string): string {
  return slugifyLib(input, { lower: true, strict: true, locale: 'ru' });
}
