import type { Request, Response } from 'express';
import { getSettings } from '../../services/settings.service';
import { listAll, findBySlug } from '../../services/room.service';
import { listBookingConditions } from '../../services/bookingCondition.service';
import { paramStr } from '../../utils/params';

export async function index(_req: Request, res: Response): Promise<void> {
  const [settings, rooms, bookingConditions] = await Promise.all([
    getSettings(),
    listAll(),
    listBookingConditions(),
  ]);

  res.render('public/rooms', {
    title: 'Номера — Иссык-Куль Резорт',
    settings,
    rooms,
    bookingConditions,
  });
}

export async function show(req: Request, res: Response): Promise<void> {
  const slug = paramStr(req.params.slug);
  const [settings, room] = await Promise.all([getSettings(), findBySlug(slug)]);

  res.render('public/room-detail', {
    title: `${room.name} — Иссык-Куль Резорт`,
    settings,
    room,
  });
}
