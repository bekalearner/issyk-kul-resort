import path from 'node:path';

export const ROOT_DIR = path.resolve(__dirname, '..', '..');
export const VIEWS_DIR = path.join(ROOT_DIR, 'views');
export const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
export const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
export const UPLOADS_ORIGINALS_DIR = path.join(UPLOADS_DIR, 'originals');
export const UPLOADS_LARGE_DIR = path.join(UPLOADS_DIR, 'large');
export const UPLOADS_THUMB_DIR = path.join(UPLOADS_DIR, 'thumb');
