import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { asyncHandler } from '../utils/asyncHandler';
import { doubleCsrfProtection } from '../middleware/csrf';
import { validate } from '../middleware/validate';

import * as homeController from '../controllers/public/home.controller';
import * as aboutController from '../controllers/public/about.controller';
import * as roomsController from '../controllers/public/rooms.controller';
import * as galleryController from '../controllers/public/gallery.controller';
import * as contactsController from '../controllers/public/contacts.controller';

import { contactSchema } from '../schemas/contact.schema';

export const publicRouter = Router();

publicRouter.get('/', asyncHandler(homeController.index));
publicRouter.get('/about', asyncHandler(aboutController.index));
publicRouter.get('/rooms', asyncHandler(roomsController.index));
publicRouter.get('/rooms/:slug', asyncHandler(roomsController.show));
publicRouter.get('/gallery', asyncHandler(galleryController.index));
publicRouter.get('/contacts', asyncHandler(contactsController.index));

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Слишком много запросов. Попробуйте позже.',
});

publicRouter.post(
  '/contacts',
  contactLimiter,
  doubleCsrfProtection,
  validate(contactSchema),
  asyncHandler(contactsController.create),
);
