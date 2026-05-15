import type { Request, Response } from 'express';
import { countRooms } from '../../services/room.service';
import { countGallery } from '../../services/gallery.service';
import { countUnread, recentUnread } from '../../services/contactMessage.service';

export async function index(_req: Request, res: Response): Promise<void> {
  const [rooms, gallery, unread, latest] = await Promise.all([
    countRooms(),
    countGallery(),
    countUnread(),
    recentUnread(5),
  ]);

  res.render('admin/dashboard', {
    title: 'Панель управления',
    layout: 'layouts/admin',
    stats: { rooms, gallery, unread },
    latest,
  });
}
