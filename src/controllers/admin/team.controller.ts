import type { Request, Response } from 'express';
import { paramStr } from '../../utils/params';
import { teamSchema } from '../../schemas/index.schemas';
import { zodToFieldErrors, summary } from '../../utils/formErrors';
import {
  createTeamMember,
  deleteTeamMember,
  findTeamMemberById,
  listTeam,
  updateTeamMember,
} from '../../services/team.service';

export async function index(_req: Request, res: Response): Promise<void> {
  const items = await listTeam();
  res.render('admin/team/index', {
    title: 'Команда',
    layout: 'layouts/admin',
    items,
  });
}

export function newForm(_req: Request, res: Response): void {
  res.render('admin/team/form', {
    title: 'Новый сотрудник',
    layout: 'layouts/admin',
    item: null,
    formData: { order: 0 },
    errors: {},
  });
}

export async function create(req: Request, res: Response): Promise<void> {
  let imagePath = typeof req.body?.imagePath === 'string' ? req.body.imagePath.trim() : '';
  if (req.processedImage?.path) imagePath = req.processedImage.path;
  const parsed = teamSchema.safeParse({ ...req.body, imagePath });
  if (!parsed.success) {
    const errors = zodToFieldErrors(parsed.error);
    req.flash('error', summary(errors));
    res.status(422).render('admin/team/form', {
      title: 'Новый сотрудник',
      layout: 'layouts/admin',
      item: null,
      formData: { ...req.body, imagePath },
      errors,
    });
    return;
  }
  await createTeamMember({
    name: parsed.data.name,
    role: parsed.data.role,
    bio: parsed.data.bio ?? null,
    imagePath: parsed.data.imagePath,
    order: parsed.data.order,
  });
  req.flash('success', 'Сотрудник добавлен');
  res.redirect(303, '/admin/team');
}

export async function editForm(req: Request, res: Response): Promise<void> {
  const item = await findTeamMemberById(paramStr(req.params.id));
  res.render('admin/team/form', {
    title: `Редактирование: ${item.name}`,
    layout: 'layouts/admin',
    item,
    formData: item,
    errors: {},
  });
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = paramStr(req.params.id);
  let imagePath = typeof req.body?.imagePath === 'string' ? req.body.imagePath.trim() : '';
  if (req.processedImage?.path) imagePath = req.processedImage.path;
  const parsed = teamSchema.safeParse({ ...req.body, imagePath });
  if (!parsed.success) {
    const errors = zodToFieldErrors(parsed.error);
    req.flash('error', summary(errors));
    const item = await findTeamMemberById(id).catch(() => null);
    res.status(422).render('admin/team/form', {
      title: item ? `Редактирование: ${item.name}` : 'Редактирование сотрудника',
      layout: 'layouts/admin',
      item,
      formData: { ...req.body, imagePath },
      errors,
    });
    return;
  }
  await updateTeamMember(id, {
    name: parsed.data.name,
    role: parsed.data.role,
    bio: parsed.data.bio ?? null,
    imagePath: parsed.data.imagePath,
    order: parsed.data.order,
  });
  req.flash('success', 'Сотрудник сохранён');
  const item = await findTeamMemberById(id);
  res.render('admin/team/form', {
    title: `Редактирование: ${item.name}`,
    layout: 'layouts/admin',
    item,
    formData: item,
    errors: {},
  });
}

export async function destroy(req: Request, res: Response): Promise<void> {
  await deleteTeamMember(paramStr(req.params.id));
  req.flash('success', 'Сотрудник удалён');
  res.redirect(303, '/admin/team');
}
