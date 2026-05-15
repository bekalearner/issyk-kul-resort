import { PrismaClient, RoomCategory, GalleryCategory } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function main(): Promise<void> {
  console.log('Seeding database…');

  // ---------- Admin user ----------
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.adminUser.upsert({
    where: { username: ADMIN_USERNAME },
    update: { passwordHash },
    create: { username: ADMIN_USERNAME, passwordHash },
  });
  console.log(`✓ Admin user: ${ADMIN_USERNAME}`);

  // ---------- Site settings ----------
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
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
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
      aboutPreviewTitle: 'Райский уголок на Иссык-Куле',
      aboutPreviewText:
        'Наш центр отдыха расположен на живописном берегу озера Иссык-Куль — одного из крупнейших и красивейших горных озёр в мире. Здесь вы найдёте идеальное сочетание комфорта, природной красоты и гостеприимства.\nМы предлагаем современные номера с видом на озеро и горы, разнообразные развлечения для всей семьи и возможность насладиться кристально чистым воздухом и целебной водой Иссык-Куля.',
      aboutHistory:
        'Центр отдыха «Иссык-Куль Резорт» был основан в 2015 году с целью создать уникальное место, где каждый гость может почувствовать гармонию с природой и насладиться настоящим киргизским гостеприимством.\nРасположенный на северном берегу легендарного озера Иссык-Куль в городе Чолпон-Ата, наш курорт стал домом вдали от дома для тысяч туристов из Кыргызстана, Казахстана, России и других стран.\nЗа годы работы мы создали современную инфраструктуру, сохранив при этом аутентичность и связь с природой. Каждый элемент нашего курорта продуман до мелочей, чтобы обеспечить максимальный комфорт и незабываемые впечатления.',
      lakeText:
        'Иссык-Куль — второе по величине горное озеро в мире после Титикаки. Его название переводится как «горячее озеро» — вода здесь не замерзает даже зимой благодаря слабой минерализации и геотермальным источникам.',
      lakeStats: [
        { label: 'Высота над уровнем моря', value: '1607 метров' },
        { label: 'Глубина', value: 'до 668 метров' },
        { label: 'Площадь', value: '6236 км²' },
        { label: 'Прозрачность воды', value: 'до 20 метров' },
        { label: 'Целебные свойства', value: 'минеральная вода с лечебным эффектом' },
      ],
      socialLinks: {
        facebook: 'https://facebook.com/issykkul-resort',
        instagram: 'https://instagram.com/issykkul-resort',
        whatsapp: 'https://wa.me/996555123456',
        telegram: 'https://t.me/issykkul-resort',
      },
      mapEmbedSrc:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95273.04470938982!2d76.97947567253903!3d42.64784282611988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389cf9e39befc3bb%3A0x753f2a6767ff6b22!2z0KfQvtC70L_QvtC9LdCQ0YLQsA!5e0!3m2!1sru!2skg!4v1234567890',
      footerAboutText:
        'Центр отдыха «Иссык-Куль Резорт» — ваш идеальный выбор для незабываемого отдыха на берегу горного озера.',
      transportInfo: [
        { label: 'Из Бишкека', text: '250 км, около 4 часов на авто' },
        { label: 'Из Алматы', text: '400 км, около 6 часов' },
        { label: 'Трансфер', text: 'Организуем встречу в аэропорту Манас' },
        { label: 'Маршрутка', text: 'От Западного автовокзала Бишкека' },
      ],
    },
  });
  console.log('✓ Site settings');

  // ---------- Features ----------
  await prisma.feature.deleteMany();
  await prisma.feature.createMany({
    data: [
      { title: 'Собственный пляж', description: 'Прямой доступ к чистейшему горному озеру с обустроенной зоной отдыха', icon: 'fa-umbrella-beach', order: 0 },
      { title: 'Ресторан', description: 'Блюда национальной и европейской кухни из свежих продуктов', icon: 'fa-utensils', order: 1 },
      { title: 'Горные виды', description: 'Потрясающие панорамы Тянь-Шаня из каждого номера', icon: 'fa-mountain', order: 2 },
      { title: 'Активный отдых', description: 'Рыбалка, катание на лошадях, экскурсии по окрестностям', icon: 'fa-hiking', order: 3 },
      { title: 'Спа и массаж', description: 'Релаксация и оздоровительные процедуры для полного восстановления', icon: 'fa-spa', order: 4 },
      { title: 'Трансфер', description: 'Удобный трансфер из аэропорта и обратно', icon: 'fa-car', order: 5 },
    ],
  });
  console.log('✓ 6 features');

  // ---------- Services ----------
  await prisma.service.deleteMany();
  await prisma.service.createMany({
    data: [
      { name: 'Размещение', description: 'Комфортабельные номера различных категорий: от стандартных до люксов и коттеджей', icon: 'fa-hotel', order: 0 },
      { name: 'Питание', description: 'Ресторан с национальной и европейской кухней, шведский стол на завтрак', icon: 'fa-utensils', order: 1 },
      { name: 'Пляж', description: 'Благоустроенный частный пляж с шезлонгами, зонтиками и пляжным баром', icon: 'fa-umbrella-beach', order: 2 },
      { name: 'Спа-центр', description: 'Массаж, сауна, хамам, косметические процедуры', icon: 'fa-spa', order: 3 },
      { name: 'Развлечения', description: 'Бильярд, настольный теннис, детская площадка, анимация', icon: 'fa-gamepad', order: 4 },
      { name: 'Активности', description: 'Прокат велосипедов, катамаранов, экскурсии, конные прогулки', icon: 'fa-bicycle', order: 5 },
      { name: 'Мероприятия', description: 'Организация свадеб, корпоративов, семейных торжеств', icon: 'fa-glass-cheers', order: 6 },
      { name: 'Трансфер', description: 'Организация встречи и проводов в аэропорту Манас', icon: 'fa-taxi', order: 7 },
    ],
  });
  console.log('✓ 8 services');

  // ---------- Team ----------
  await prisma.teamMember.deleteMany();
  await prisma.teamMember.createMany({
    data: [
      {
        name: 'Азамат Исмаилов',
        role: 'Директор',
        imagePath: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
        order: 0,
      },
      {
        name: 'Гульнара Токтомаева',
        role: 'Старший администратор',
        imagePath: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
        order: 1,
      },
      {
        name: 'Владимир Петров',
        role: 'Шеф-повар',
        imagePath: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=400&h=400&fit=crop&crop=face',
        order: 2,
      },
    ],
  });
  console.log('✓ 3 team members');

  // ---------- Awards ----------
  await prisma.award.deleteMany();
  await prisma.award.createMany({
    data: [
      { title: 'Лучший курорт 2024', description: 'По версии Travel Awards Kyrgyzstan', icon: 'fa-trophy', order: 0 },
      { title: 'Сертификат качества', description: 'Международный стандарт обслуживания', icon: 'fa-star', order: 1 },
      { title: 'Эко-сертификат', description: 'Экологически чистый курорт', icon: 'fa-leaf', order: 2 },
    ],
  });
  console.log('✓ 3 awards');

  // ---------- Testimonials ----------
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        text: 'Прекрасное место для семейного отдыха! Чистые номера, вкусная еда и потрясающие виды. Обязательно вернёмся!',
        author: 'Айгуль',
        city: 'Бишкек',
        rating: 5,
        featured: true,
        order: 0,
      },
      {
        text: 'Отдыхали в июле, всё понравилось. Особенно порадовал персонал — очень внимательные и гостеприимные люди.',
        author: 'Дмитрий',
        city: 'Алматы',
        rating: 5,
        featured: true,
        order: 1,
      },
      {
        text: 'Идеальное место для восстановления сил. Тишина, горы, озеро — что ещё нужно для счастья?',
        author: 'Наталья',
        city: 'Москва',
        rating: 5,
        featured: true,
        order: 2,
      },
    ],
  });
  console.log('✓ 3 testimonials');

  // ---------- FAQ ----------
  await prisma.faq.deleteMany();
  await prisma.faq.createMany({
    data: [
      {
        question: 'Какие документы нужны для заселения?',
        answer: 'Для граждан Кыргызстана — паспорт или ID-карта. Для иностранных граждан — загранпаспорт. Для детей — свидетельство о рождении.',
        order: 0,
        active: true,
      },
      {
        question: 'Есть ли бесплатная парковка?',
        answer: 'Да, для всех гостей доступна бесплатная охраняемая парковка на территории курорта.',
        order: 1,
        active: true,
      },
      {
        question: 'Можно ли с домашними животными?',
        answer: 'Размещение с питомцами возможно в отдельных номерах и коттеджах по предварительному согласованию. Дополнительная плата — 500 сом/сутки.',
        order: 2,
        active: true,
      },
      {
        question: 'Включён ли завтрак в стоимость?',
        answer: 'Да, во все тарифы включён завтрак-шведский стол с 07:00 до 11:00.',
        order: 3,
        active: true,
      },
      {
        question: 'Есть ли трансфер из аэропорта?',
        answer: 'Да, мы организуем трансфер из аэропорта Манас. Стоимость — 4000 сом за автомобиль (до 4 человек). Бронировать нужно заранее.',
        order: 4,
        active: true,
      },
      {
        question: 'Какой сезон лучше для отдыха?',
        answer: 'Пляжный сезон — с июня по сентябрь. Температура воды летом +18-22°C. Весной и осенью отличные условия для экскурсий и прогулок.',
        order: 5,
        active: true,
      },
    ],
  });
  console.log('✓ 6 FAQ');

  // ---------- Booking Conditions ----------
  await prisma.bookingCondition.deleteMany();
  await prisma.bookingCondition.createMany({
    data: [
      { title: 'Заезд / Выезд', content: 'Заезд: с 14:00\nВыезд: до 12:00\nРанний заезд и поздний выезд по договорённости', icon: 'fa-clock', order: 0 },
      { title: 'Отмена бронирования', content: 'Бесплатная отмена за 7 дней до заезда\nПри отмене менее чем за 7 дней — оплата 50%', icon: 'fa-ban', order: 1 },
      { title: 'Питание', content: 'Завтрак включён в стоимость\nОбед и ужин — по меню ресторана\nВозможен заказ полного пансиона', icon: 'fa-utensils', order: 2 },
      { title: 'Дополнительно', content: 'Дети до 6 лет — бесплатно\nДополнительное место — 1000 сом/ночь\nПитомцы размещаются по согласованию', icon: 'fa-plus-circle', order: 3 },
    ],
  });
  console.log('✓ 4 booking conditions');

  // ---------- Rooms ----------
  await prisma.room.deleteMany();
  const roomsData: Array<{
    slug: string;
    name: string;
    category: RoomCategory;
    description: string;
    shortDescription: string;
    priceSom: number;
    areaSqm: number;
    capacityMin: number;
    capacityMax: number;
    badge: string | null;
    featured: boolean;
    order: number;
    imageUrl: string;
    amenities: string[];
  }> = [
    {
      slug: 'standartnyj-nomer',
      name: 'Стандартный номер',
      category: 'STANDARD',
      description:
        'Уютный номер площадью 25 м² с современным ремонтом и всеми удобствами. Идеально подходит для пары или небольшой семьи.',
      shortDescription: 'Уютный номер с видом на горы, двуспальная кровать, Wi-Fi, кондиционер',
      priceSom: 3500,
      areaSqm: 25,
      capacityMin: 1,
      capacityMax: 2,
      badge: 'Популярный',
      featured: true,
      order: 0,
      imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&h=600&fit=crop',
      amenities: [
        'Двуспальная кровать или две односпальные',
        'Кондиционер',
        'Wi-Fi',
        'Телевизор со спутниковыми каналами',
        'Мини-холодильник',
        'Санузел с душевой кабиной',
        'Фен и косметические принадлежности',
        'Балкон с видом на горы',
      ],
    },
    {
      slug: 'standart-plus',
      name: 'Стандарт плюс',
      category: 'STANDARD',
      description:
        'Просторный номер 30 м² с улучшенной мебелью и дополнительными удобствами. Прекрасный выбор для комфортного проживания.',
      shortDescription: 'Просторный номер с улучшенной мебелью и дополнительными удобствами',
      priceSom: 4500,
      areaSqm: 30,
      capacityMin: 2,
      capacityMax: 3,
      badge: null,
      featured: false,
      order: 1,
      imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=900&h=600&fit=crop',
      amenities: [
        'Большая двуспальная кровать',
        'Кондиционер и обогреватель',
        'Wi-Fi высокой скорости',
        'LED телевизор 43"',
        'Мини-бар',
        'Сейф',
        'Санузел с ванной',
        'Халаты и тапочки',
        'Просторный балкон с креслами',
      ],
    },
    {
      slug: 'lyuks-s-vidom-na-ozero',
      name: 'Люкс с видом на озеро',
      category: 'DELUXE',
      description:
        'Премиальный номер 40 м² с панорамным видом на Иссык-Куль. Современный дизайн и максимальный комфорт для самых взыскательных гостей.',
      shortDescription: 'Просторный номер с панорамным видом на Иссык-Куль, балкон, мини-бар',
      priceSom: 6500,
      areaSqm: 40,
      capacityMin: 2,
      capacityMax: 3,
      badge: 'Лучший вид',
      featured: true,
      order: 2,
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&h=600&fit=crop',
      amenities: [
        'King-size кровать премиум класса',
        'Климат-контроль',
        'Зона отдыха с диваном',
        'Рабочий стол',
        'Smart TV 55"',
        'Мини-бар с напитками',
        'Кофемашина Nespresso',
        'Джакузи и отдельная душевая',
        'Премиум косметика',
        'Большой балкон с шезлонгами',
      ],
    },
    {
      slug: 'prezidentskij-lyuks',
      name: 'Президентский люкс',
      category: 'DELUXE',
      description:
        'Роскошные апартаменты 65 м² с двумя комнатами и эксклюзивным дизайном. Для тех, кто привык к лучшему.',
      shortDescription: 'Роскошные апартаменты с двумя комнатами и эксклюзивным дизайном',
      priceSom: 15000,
      areaSqm: 65,
      capacityMin: 4,
      capacityMax: 6,
      badge: 'VIP',
      featured: false,
      order: 3,
      imageUrl: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=900&h=600&fit=crop',
      amenities: [
        'Две спальни с King-size кроватями',
        'Гостиная с камином',
        'Кухонный уголок',
        'Столовая зона на 6 персон',
        '2 санузла с премиум сантехникой',
        'Домашний кинотеатр',
        'Личный сейф',
        'Бар с алкогольными напитками',
        'Огромная терраса 20 м²',
        'Услуги личного консьержа',
      ],
    },
    {
      slug: 'semejnyj-kottedzh',
      name: 'Семейный коттедж',
      category: 'COTTAGE',
      description:
        'Отдельный двухэтажный коттедж 80 м² с тремя спальнями. Идеальный вариант для семейного отдыха или компании друзей.',
      shortDescription: 'Отдельный коттедж на 6-8 человек с кухней и террасой',
      priceSom: 12000,
      areaSqm: 80,
      capacityMin: 6,
      capacityMax: 8,
      badge: 'Для семьи',
      featured: true,
      order: 4,
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&h=600&fit=crop',
      amenities: [
        '3 спальни с комфортными кроватями',
        'Просторная гостиная',
        'Полностью оборудованная кухня',
        'Столовая на 8 персон',
        '2 санузла',
        'Стиральная машина',
        '2 телевизора',
        'Wi-Fi роутер',
        'Терраса с мангалом',
        'Частная парковка',
      ],
    },
    {
      slug: 'vip-kottedzh-u-ozera',
      name: 'VIP коттедж у озера',
      category: 'COTTAGE',
      description:
        'Эксклюзивный коттедж 120 м² в 10 метрах от озера с собственным пляжем. Максимальная приватность и роскошь.',
      shortDescription: 'Эксклюзивный коттедж в 10 метрах от озера с собственным пляжем',
      priceSom: 25000,
      areaSqm: 120,
      capacityMin: 8,
      capacityMax: 10,
      badge: 'Премиум',
      featured: false,
      order: 5,
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=600&fit=crop',
      amenities: [
        '4 спальни с дизайнерским ремонтом',
        'Гостиная 40 м²',
        'Современная кухня с техникой',
        'Винный погреб',
        '3 санузла с люксовой сантехникой',
        'Частная сауна',
        'Бильярдная',
        'Кинозал',
        'Бассейн с подогревом',
        'Собственный причал',
        'Услуги повара и горничной',
      ],
    },
  ];

  for (const r of roomsData) {
    await prisma.room.create({
      data: {
        slug: r.slug,
        name: r.name,
        category: r.category,
        description: r.description,
        shortDescription: r.shortDescription,
        priceSom: r.priceSom,
        areaSqm: r.areaSqm,
        capacityMin: r.capacityMin,
        capacityMax: r.capacityMax,
        badge: r.badge,
        featured: r.featured,
        order: r.order,
        amenities: { create: r.amenities.map((text, i) => ({ text, order: i })) },
        images: { create: [{ path: r.imageUrl, alt: r.name, isPrimary: true, order: 0 }] },
      },
    });
  }
  console.log(`✓ ${roomsData.length} rooms`);

  // ---------- Gallery ----------
  await prisma.galleryItem.deleteMany();
  const galleryData: Array<{ title: string; category: GalleryCategory; url: string }> = [
    { title: 'Иссык-Куль на рассвете', category: 'LAKE', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
    { title: 'Панорама Тянь-Шаня', category: 'LAKE', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop' },
    { title: 'Закат на пляже', category: 'LAKE', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop' },
    { title: 'Чистейшая вода озера', category: 'LAKE', url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop' },
    { title: 'Горные пейзажи', category: 'LAKE', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop' },
    { title: 'Первозданная природа', category: 'LAKE', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop' },
    { title: 'Стандартный номер', category: 'ROOMS', url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop' },
    { title: 'Люкс с видом на озеро', category: 'ROOMS', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop' },
    { title: 'Президентский люкс', category: 'ROOMS', url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&fit=crop' },
    { title: 'Семейный коттедж', category: 'ROOMS', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop' },
    { title: 'Уютный интерьер', category: 'ROOMS', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=600&fit=crop' },
    { title: 'VIP коттедж', category: 'ROOMS', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop' },
    { title: 'Наш ресторан', category: 'FOOD', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop' },
    { title: 'Изысканные блюда', category: 'FOOD', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop' },
    { title: 'Завтрак на террасе', category: 'FOOD', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop' },
    { title: 'Национальная кухня', category: 'FOOD', url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop' },
    { title: 'Бассейн с видом', category: 'ACTIVITIES', url: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=800&h=600&fit=crop' },
    { title: 'Спа-процедуры', category: 'ACTIVITIES', url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop' },
    { title: 'Наш пляж', category: 'ACTIVITIES', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop' },
    { title: 'Конные прогулки', category: 'ACTIVITIES', url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop' },
    { title: 'Йога на природе', category: 'ACTIVITIES', url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop' },
    { title: 'Водные развлечения', category: 'ACTIVITIES', url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop' },
    { title: 'Пешие походы', category: 'ACTIVITIES', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop' },
  ];
  await prisma.galleryItem.createMany({
    data: galleryData.map((g, i) => ({
      title: g.title,
      category: g.category,
      imagePath: g.url,
      alt: g.title,
      order: i,
    })),
  });
  console.log(`✓ ${galleryData.length} gallery items`);

  console.log('\n✅ Seeding complete!');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
