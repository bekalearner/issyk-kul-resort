export function parseBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value === '1' || value.toLowerCase() === 'true' || value === 'on';
  }
  return false;
}

export function nl2br(input: string | null | undefined): string {
  if (!input) return '';
  return String(input).replace(/\n/g, '<br>');
}

export function escapeHtml(input: string | null | undefined): string {
  if (!input) return '';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
