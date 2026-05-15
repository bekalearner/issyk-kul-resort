import type { Request, Response } from 'express';
import { paramStr } from '../../utils/params';
import {
  deleteMessage,
  findMessageById,
  listMessages,
  markMessageRead,
} from '../../services/contactMessage.service';

export async function index(req: Request, res: Response): Promise<void> {
  const filter = req.query.filter === 'unread' ? 'unread' : req.query.filter === 'read' ? 'read' : 'all';
  const read = filter === 'all' ? undefined : filter === 'read';
  const { items, total } = await listMessages({ read });
  res.render('admin/messages/index', {
    title: 'Сообщения',
    layout: 'layouts/admin',
    items,
    total,
    filter,
  });
}

export async function show(req: Request, res: Response): Promise<void> {
  const id = paramStr(req.params.id);
  const message = await findMessageById(id);
  if (!message.read) {
    await markMessageRead(id);
    message.read = true;
  }
  res.render('admin/messages/show', {
    title: `Сообщение от ${message.name}`,
    layout: 'layouts/admin',
    message,
  });
}

export async function destroy(req: Request, res: Response): Promise<void> {
  await deleteMessage(paramStr(req.params.id));
  req.flash('success', 'Сообщение удалено');
  res.redirect(303, '/admin/messages');
}
