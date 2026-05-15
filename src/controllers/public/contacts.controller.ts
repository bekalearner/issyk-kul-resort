import type { Request, Response } from 'express';
import { getSettings } from '../../services/settings.service';
import { listFaqs } from '../../services/faq.service';
import { createContactMessage } from '../../services/contactMessage.service';
import type { ContactInput } from '../../schemas/contact.schema';

export async function index(_req: Request, res: Response): Promise<void> {
  const [settings, faqs] = await Promise.all([getSettings(), listFaqs({ activeOnly: true })]);

  res.render('public/contacts', {
    title: 'Контакты — Иссык-Куль Резорт',
    settings,
    faqs,
  });
}

export async function create(req: Request, res: Response): Promise<void> {
  const body = req.body as ContactInput;
  await createContactMessage({
    name: body.name,
    phone: body.phone,
    email: body.email ?? null,
    guestCount: body.guestCount ?? null,
    checkIn: body.checkIn ?? null,
    checkOut: body.checkOut ?? null,
    message: body.message,
  });

  req.flash('success', 'Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
  res.redirect(303, '/contacts#contact-form');
}
