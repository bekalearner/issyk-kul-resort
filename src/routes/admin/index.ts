import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth, requireGuest } from '../../middleware/requireAuth';
import { doubleCsrfProtection } from '../../middleware/csrf';
import { uploadImage, processUploadedImage } from '../../middleware/upload';

import * as authController from '../../controllers/admin/auth.controller';
import * as dashboardController from '../../controllers/admin/dashboard.controller';
import * as roomsController from '../../controllers/admin/rooms.controller';
import * as galleryController from '../../controllers/admin/gallery.controller';
import * as teamController from '../../controllers/admin/team.controller';
import * as messagesController from '../../controllers/admin/messages.controller';
import * as settingsController from '../../controllers/admin/settings.controller';
import * as simpleCrud from '../../controllers/admin/simpleCrud.controller';

export const adminRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Слишком много попыток входа. Попробуйте через 15 минут.',
});

// Auth (public sub-routes)
adminRouter.get('/login', requireGuest, authController.loginForm);
adminRouter.post(
  '/login',
  requireGuest,
  loginLimiter,
  doubleCsrfProtection,
  asyncHandler(authController.login),
);
adminRouter.post('/logout', requireAuth, doubleCsrfProtection, authController.logout);

// Everything below requires auth
adminRouter.use(requireAuth);

// Dashboard
adminRouter.get('/', asyncHandler(dashboardController.index));

// Rooms (manual controller, includes amenities + images)
adminRouter.get('/rooms', asyncHandler(roomsController.index));
adminRouter.get('/rooms/new', roomsController.newForm);
adminRouter.post('/rooms', doubleCsrfProtection, asyncHandler(roomsController.create));
adminRouter.get('/rooms/:id/edit', asyncHandler(roomsController.editForm));
adminRouter.put('/rooms/:id', doubleCsrfProtection, asyncHandler(roomsController.update));
adminRouter.delete('/rooms/:id', doubleCsrfProtection, asyncHandler(roomsController.destroy));
adminRouter.post(
  '/rooms/:id/images',
  uploadImage.single('image'),
  processUploadedImage,
  doubleCsrfProtection,
  asyncHandler(roomsController.uploadImage),
);
adminRouter.delete(
  '/rooms/:id/images/:imageId',
  doubleCsrfProtection,
  asyncHandler(roomsController.removeImage),
);
adminRouter.post(
  '/rooms/:id/images/:imageId/primary',
  doubleCsrfProtection,
  asyncHandler(roomsController.makePrimaryImage),
);

// Gallery (with optional upload)
adminRouter.get('/gallery', asyncHandler(galleryController.index));
adminRouter.get('/gallery/new', galleryController.newForm);
adminRouter.post(
  '/gallery',
  uploadImage.single('image'),
  processUploadedImage,
  doubleCsrfProtection,
  asyncHandler(galleryController.create),
);
adminRouter.get('/gallery/:id/edit', asyncHandler(galleryController.editForm));
adminRouter.put(
  '/gallery/:id',
  uploadImage.single('image'),
  processUploadedImage,
  doubleCsrfProtection,
  asyncHandler(galleryController.update),
);
adminRouter.delete('/gallery/:id', doubleCsrfProtection, asyncHandler(galleryController.destroy));

// Team (with upload)
adminRouter.get('/team', asyncHandler(teamController.index));
adminRouter.get('/team/new', teamController.newForm);
adminRouter.post(
  '/team',
  uploadImage.single('image'),
  processUploadedImage,
  doubleCsrfProtection,
  asyncHandler(teamController.create),
);
adminRouter.get('/team/:id/edit', asyncHandler(teamController.editForm));
adminRouter.put(
  '/team/:id',
  uploadImage.single('image'),
  processUploadedImage,
  doubleCsrfProtection,
  asyncHandler(teamController.update),
);
adminRouter.delete('/team/:id', doubleCsrfProtection, asyncHandler(teamController.destroy));

// Simple CRUD
type SimpleResource =
  | 'testimonials'
  | 'services'
  | 'features'
  | 'awards'
  | 'faqs'
  | 'booking-conditions';

const SIMPLE_RESOURCES: Array<{ path: SimpleResource; ctrl: typeof simpleCrud.testimonials }> = [
  { path: 'testimonials', ctrl: simpleCrud.testimonials },
  { path: 'services', ctrl: simpleCrud.services },
  { path: 'features', ctrl: simpleCrud.features },
  { path: 'awards', ctrl: simpleCrud.awards },
  { path: 'faqs', ctrl: simpleCrud.faqs },
  { path: 'booking-conditions', ctrl: simpleCrud.bookingConditions },
];

for (const { path, ctrl } of SIMPLE_RESOURCES) {
  adminRouter.get(`/${path}`, asyncHandler(ctrl.index));
  adminRouter.get(`/${path}/new`, ctrl.newForm);
  adminRouter.post(`/${path}`, doubleCsrfProtection, asyncHandler(ctrl.create));
  adminRouter.get(`/${path}/:id/edit`, asyncHandler(ctrl.editForm));
  adminRouter.put(`/${path}/:id`, doubleCsrfProtection, asyncHandler(ctrl.update));
  adminRouter.delete(`/${path}/:id`, doubleCsrfProtection, asyncHandler(ctrl.destroy));
}

// Messages
adminRouter.get('/messages', asyncHandler(messagesController.index));
adminRouter.get('/messages/:id', asyncHandler(messagesController.show));
adminRouter.delete('/messages/:id', doubleCsrfProtection, asyncHandler(messagesController.destroy));

// Settings
adminRouter.get('/settings', asyncHandler(settingsController.editForm));
adminRouter.put('/settings', doubleCsrfProtection, asyncHandler(settingsController.update));
