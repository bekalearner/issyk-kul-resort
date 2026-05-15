import type { Request, Response } from 'express';
import { getSettings } from '../../services/settings.service';
import { listServices } from '../../services/service.service';
import { listTeam } from '../../services/team.service';
import { listAwards } from '../../services/award.service';

export async function index(_req: Request, res: Response): Promise<void> {
  const [settings, services, team, awards] = await Promise.all([
    getSettings(),
    listServices(),
    listTeam(),
    listAwards(),
  ]);

  res.render('public/about', {
    title: 'О нас — Иссык-Куль Резорт',
    settings,
    services,
    team,
    awards,
  });
}
