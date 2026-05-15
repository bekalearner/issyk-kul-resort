import fs from 'node:fs/promises';
import path from 'node:path';
import {
  UPLOADS_LARGE_DIR,
  UPLOADS_ORIGINALS_DIR,
  UPLOADS_THUMB_DIR,
} from '../config/paths';

export async function deleteImageFiles(imagePath: string): Promise<void> {
  if (!imagePath?.startsWith('/uploads/large/')) return;
  const basename = path.basename(imagePath);
  const baseNoExt = path.basename(basename, path.extname(basename));

  const candidates = [
    path.join(UPLOADS_LARGE_DIR, basename),
    path.join(UPLOADS_THUMB_DIR, basename),
  ];

  try {
    const files = await fs.readdir(UPLOADS_ORIGINALS_DIR);
    for (const f of files) {
      if (path.basename(f, path.extname(f)) === baseNoExt) {
        candidates.push(path.join(UPLOADS_ORIGINALS_DIR, f));
      }
    }
  } catch {
    /* directory might not exist */
  }

  await Promise.all(
    candidates.map(async (p) => {
      try {
        await fs.unlink(p);
      } catch {
        /* ignore */
      }
    }),
  );
}

export function thumbPathFromLarge(imagePath: string): string {
  if (!imagePath?.startsWith('/uploads/large/')) return imagePath;
  return imagePath.replace('/uploads/large/', '/uploads/thumb/');
}
