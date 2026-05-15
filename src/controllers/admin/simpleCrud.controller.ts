import { buildCrudController } from './crudFactory';
import {
  awardSchema,
  bookingConditionSchema,
  faqSchema,
  featureSchema,
  serviceSchema,
  testimonialSchema,
} from '../../schemas/index.schemas';
import * as testimonialService from '../../services/testimonial.service';
import * as serviceService from '../../services/service.service';
import * as featureService from '../../services/feature.service';
import * as awardService from '../../services/award.service';
import * as faqService from '../../services/faq.service';
import * as bookingConditionService from '../../services/bookingCondition.service';

export const testimonials = buildCrudController({
  resourceName: 'Отзывы',
  resourcePath: '/admin/testimonials',
  viewDir: 'admin/testimonials',
  list: () => testimonialService.listTestimonials(),
  findById: (id) => testimonialService.findTestimonialById(id),
  create: (data) => testimonialService.createTestimonial(data),
  update: (id, data) => testimonialService.updateTestimonial(id, data),
  remove: (id) => testimonialService.deleteTestimonial(id),
  schema: testimonialSchema,
  emptyForm: { rating: 5, featured: false, order: 0 },
  itemTitle: (item) => item.author,
});

export const services = buildCrudController({
  resourceName: 'Услуги',
  resourcePath: '/admin/services',
  viewDir: 'admin/services',
  list: () => serviceService.listServices(),
  findById: (id) => serviceService.findServiceById(id),
  create: (data) => serviceService.createService(data),
  update: (id, data) => serviceService.updateService(id, data),
  remove: (id) => serviceService.deleteService(id),
  schema: serviceSchema,
  emptyForm: { icon: 'fa-star', order: 0 },
  itemTitle: (item) => item.name,
});

export const features = buildCrudController({
  resourceName: 'Преимущества',
  resourcePath: '/admin/features',
  viewDir: 'admin/features',
  list: () => featureService.listFeatures(),
  findById: (id) => featureService.findFeatureById(id),
  create: (data) => featureService.createFeature(data),
  update: (id, data) => featureService.updateFeature(id, data),
  remove: (id) => featureService.deleteFeature(id),
  schema: featureSchema,
  emptyForm: { icon: 'fa-star', order: 0 },
  itemTitle: (item) => item.title,
});

export const awards = buildCrudController({
  resourceName: 'Награды',
  resourcePath: '/admin/awards',
  viewDir: 'admin/awards',
  list: () => awardService.listAwards(),
  findById: (id) => awardService.findAwardById(id),
  create: (data) => awardService.createAward(data),
  update: (id, data) => awardService.updateAward(id, data),
  remove: (id) => awardService.deleteAward(id),
  schema: awardSchema,
  emptyForm: { icon: 'fa-trophy', order: 0 },
  itemTitle: (item) => item.title,
});

export const faqs = buildCrudController({
  resourceName: 'FAQ',
  resourcePath: '/admin/faqs',
  viewDir: 'admin/faqs',
  list: () => faqService.listFaqs(),
  findById: (id) => faqService.findFaqById(id),
  create: (data) => faqService.createFaq(data),
  update: (id, data) => faqService.updateFaq(id, data),
  remove: (id) => faqService.deleteFaq(id),
  schema: faqSchema,
  emptyForm: { active: true, order: 0 },
  itemTitle: (item) => item.question,
});

export const bookingConditions = buildCrudController({
  resourceName: 'Условия бронирования',
  resourcePath: '/admin/booking-conditions',
  viewDir: 'admin/booking-conditions',
  list: () => bookingConditionService.listBookingConditions(),
  findById: (id) => bookingConditionService.findBookingConditionById(id),
  create: (data) => bookingConditionService.createBookingCondition(data),
  update: (id, data) => bookingConditionService.updateBookingCondition(id, data),
  remove: (id) => bookingConditionService.deleteBookingCondition(id),
  schema: bookingConditionSchema,
  emptyForm: { icon: 'fa-info-circle', order: 0 },
  itemTitle: (item) => item.title,
});
