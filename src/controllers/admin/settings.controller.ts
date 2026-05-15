import type { Request, Response } from 'express';
import { getSettings, updateSettings } from '../../services/settings.service';
import { settingsSchema } from '../../schemas/index.schemas';
import { zodToFieldErrors, summary } from '../../utils/formErrors';

function buildFormData(settings: Awaited<ReturnType<typeof getSettings>>): Record<string, unknown> {
  return {
    ...settings,
    workingHours: JSON.stringify(settings.workingHours, null, 2),
    lakeStats: JSON.stringify(settings.lakeStats, null, 2),
    socialLinks: JSON.stringify(settings.socialLinks, null, 2),
    transportInfo: JSON.stringify(settings.transportInfo, null, 2),
  };
}

export async function editForm(_req: Request, res: Response): Promise<void> {
  const settings = await getSettings();
  res.render('admin/settings', {
    title: 'Настройки сайта',
    layout: 'layouts/admin',
    settings,
    formData: buildFormData(settings),
    errors: {},
  });
}

export async function update(req: Request, res: Response): Promise<void> {
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = zodToFieldErrors(parsed.error);
    req.flash('error', summary(errors));
    const settings = await getSettings();
    res.status(422).render('admin/settings', {
      title: 'Настройки сайта',
      layout: 'layouts/admin',
      settings,
      formData: req.body as Record<string, unknown>,
      errors,
    });
    return;
  }
  await updateSettings(parsed.data);
  req.flash('success', 'Настройки сохранены');
  const settings = await getSettings();
  res.render('admin/settings', {
    title: 'Настройки сайта',
    layout: 'layouts/admin',
    settings,
    formData: buildFormData(settings),
    errors: {},
  });
}
