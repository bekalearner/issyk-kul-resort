import path from 'node:path';
import fs from 'node:fs/promises';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { nanoid } from 'nanoid';
import {
  UPLOADS_LARGE_DIR,
  UPLOADS_ORIGINALS_DIR,
  UPLOADS_THUMB_DIR,
} from '../config/paths';
import { ValidationError } from '../utils/errors';

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await fs.mkdir(UPLOADS_ORIGINALS_DIR, { recursive: true });
    cb(null, UPLOADS_ORIGINALS_DIR);
  },
  filename: (_req, file, cb) => {
    const id = nanoid(12);
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${id}${ext}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new ValidationError('Загружать можно только изображения'));
      return;
    }
    cb(null, true);
  },
});

export async function processUploadedImage(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.file) {
      next();
      return;
    }
    await fs.mkdir(UPLOADS_LARGE_DIR, { recursive: true });
    await fs.mkdir(UPLOADS_THUMB_DIR, { recursive: true });

    const baseName = path.basename(req.file.filename, path.extname(req.file.filename));
    const webpName = `${baseName}.webp`;

    const largePath = path.join(UPLOADS_LARGE_DIR, webpName);
    const thumbPath = path.join(UPLOADS_THUMB_DIR, webpName);

    await sharp(req.file.path)
      .resize({ width: 1600, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(largePath);

    await sharp(req.file.path)
      .resize({ width: 600, height: 600, fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(thumbPath);

    req.processedImage = {
      path: `/uploads/large/${webpName}`,
      alt: typeof req.body?.alt === 'string' ? req.body.alt : undefined,
    };

    next();
  } catch (err) {
    next(err);
  }
}
