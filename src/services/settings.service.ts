import type { Prisma, SiteSettings } from '@prisma/client';
import { prisma } from '../config/db';

const DEFAULTS: Prisma.SiteSettingsCreateInput = {
  id: 1,
  phonePrimary: '+996 555 123 456',
  phoneSecondary: '+996 312 345 678',
  emailPrimary: 'info@issykkul-resort.kg',
  emailSecondary: 'booking@issykkul-resort.kg',
  addressLine1: 'Кыргызстан, Иссык-Кульская область',
  addressLine2: 'г. Чолпон-Ата, северный берег',
  addressNote: 'Напротив горы Бозбиик',
  workingHours: { reception: '24/7', restaurant: '07:00 - 23:00', beach: '06:00 - 22:00' },
  heroTitle: 'Добро пожаловать на Иссык-Куль',
  heroSubtitle: 'Незабываемый отдых на берегу горного озера',
  heroImageUrl:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  aboutPreviewTitle: 'Райский уголок на Иссык-Куле',
  aboutPreviewText:
    'Наш курорт расположен на живописном северном берегу озера Иссык-Куль, в окружении величественных гор Тянь-Шаня. Мы предлагаем уникальную возможность насладиться чистейшим горным воздухом, целебной водой озера и потрясающими видами.\n\nСовременные номера, разнообразные развлечения и высокий уровень сервиса делают наш курорт идеальным местом для семейного отдыха, романтического путешествия или активного времяпрепровождения.',
  aboutHistory:
    'Курорт «Иссык-Куль» был основан в 2015 году с целью создать место, где гости смогут насладиться уникальной природой высокогорного озера в комфортных условиях.\n\nЗа годы работы мы приняли тысячи гостей со всего мира и стали одним из любимых мест отдыха для местных жителей и туристов.\n\nМы расположены в живописной части северного побережья озера Иссык-Куль, в городе Чолпон-Ата — туристической столице региона.',
  lakeText:
    'Озеро Иссык-Куль — жемчужина Средней Азии, второе по величине высокогорное озеро в мире после Титикаки. Его уникальные характеристики делают его поистине удивительным местом для отдыха и оздоровления.',
  lakeStats: [
    { label: 'Высота над уровнем моря', value: '1607 метров' },
    { label: 'Максимальная глубина', value: '702 метра' },
    { label: 'Площадь', value: '6236 км²' },
    { label: 'Прозрачность воды', value: 'до 47 метров' },
    { label: 'Целебные свойства', value: 'Минералы и микроэлементы' },
  ],
  socialLinks: { facebook: '#', instagram: '#', whatsapp: '#', telegram: '#' },
  mapEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23429.07!2d76.95!3d42.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDM5JzAwLjAiTiA3NsKwNTcnMDAuMCJF!5e0!3m2!1sru!2skg!4v1234567890',
  footerAboutText:
    'Лучший курорт на берегу озера Иссык-Куль. Незабываемый отдых в окружении природы.',
  transportInfo: [
    { label: 'Из Бишкека', text: '250 км, около 4 часов на авто' },
    { label: 'Из Алматы', text: '450 км, около 7 часов на авто' },
    { label: 'Аэропорт Манас', text: 'Трансфер по запросу' },
    { label: 'Местный транспорт', text: 'Маршрутки, такси' },
  ],
};

export async function getSettings(): Promise<SiteSettings> {
  return prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: DEFAULTS,
  });
}

export async function updateSettings(
  data: Partial<Prisma.SiteSettingsCreateInput>,
): Promise<SiteSettings> {
  return prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data as Prisma.SiteSettingsUpdateInput,
    create: { ...DEFAULTS, ...data },
  });
}
