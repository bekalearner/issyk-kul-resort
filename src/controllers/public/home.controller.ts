import type { Request, Response } from 'express';
import { getSettings } from '../../services/settings.service';
import { listAll as listRooms } from '../../services/room.service';
import { listFeatures } from '../../services/feature.service';
import { listTestimonials } from '../../services/testimonial.service';

export async function index(_req: Request, res: Response): Promise<void> {
  const [settings, rooms, features, testimonials] = await Promise.all([
    getSettings(),
    listRooms({ featured: true, limit: 3 }),
    listFeatures(),
    listTestimonials({ featured: true, limit: 3 }),
  ]);

  res.render('public/index', {
    title: settings.heroTitle,
    settings,
    rooms,
    features,
    testimonials,
  });
}
