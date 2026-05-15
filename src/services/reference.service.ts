export interface IconOption {
  value: string;
  label: string;
}

export interface IconGroup {
  label: string;
  items: IconOption[];
}

export const ICON_CATALOG: IconGroup[] = [
  {
    label: 'Размещение',
    items: [
      { value: 'fa-hotel', label: 'Отель' },
      { value: 'fa-bed', label: 'Кровать' },
      { value: 'fa-key', label: 'Ключ' },
      { value: 'fa-house', label: 'Дом' },
      { value: 'fa-door-open', label: 'Открытая дверь' },
      { value: 'fa-concierge-bell', label: 'Стойка администратора' },
      { value: 'fa-suitcase-rolling', label: 'Чемодан' },
    ],
  },
  {
    label: 'Питание',
    items: [
      { value: 'fa-utensils', label: 'Столовые приборы' },
      { value: 'fa-mug-hot', label: 'Горячий напиток' },
      { value: 'fa-glass-cheers', label: 'Бокалы' },
      { value: 'fa-wine-glass', label: 'Бокал вина' },
      { value: 'fa-pizza-slice', label: 'Пицца' },
      { value: 'fa-ice-cream', label: 'Мороженое' },
    ],
  },
  {
    label: 'Активности и спа',
    items: [
      { value: 'fa-spa', label: 'Спа' },
      { value: 'fa-hot-tub', label: 'Джакузи' },
      { value: 'fa-swimming-pool', label: 'Бассейн' },
      { value: 'fa-person-swimming', label: 'Плавание' },
      { value: 'fa-bicycle', label: 'Велосипед' },
      { value: 'fa-hiking', label: 'Поход' },
      { value: 'fa-person-skiing', label: 'Лыжи' },
      { value: 'fa-gamepad', label: 'Игры' },
      { value: 'fa-fish', label: 'Рыбалка' },
    ],
  },
  {
    label: 'Природа и пляж',
    items: [
      { value: 'fa-umbrella-beach', label: 'Пляж' },
      { value: 'fa-mountain', label: 'Горы' },
      { value: 'fa-sun', label: 'Солнце' },
      { value: 'fa-tree', label: 'Дерево' },
      { value: 'fa-leaf', label: 'Лист' },
      { value: 'fa-water', label: 'Вода' },
    ],
  },
  {
    label: 'Удобства',
    items: [
      { value: 'fa-wifi', label: 'Wi-Fi' },
      { value: 'fa-tv', label: 'Телевизор' },
      { value: 'fa-snowflake', label: 'Кондиционер' },
      { value: 'fa-shower', label: 'Душ' },
      { value: 'fa-bath', label: 'Ванна' },
      { value: 'fa-soap', label: 'Гигиена' },
      { value: 'fa-parking', label: 'Парковка' },
    ],
  },
  {
    label: 'Награды и качество',
    items: [
      { value: 'fa-trophy', label: 'Кубок' },
      { value: 'fa-star', label: 'Звезда' },
      { value: 'fa-medal', label: 'Медаль' },
      { value: 'fa-award', label: 'Награда' },
      { value: 'fa-certificate', label: 'Сертификат' },
      { value: 'fa-shield-halved', label: 'Щит' },
      { value: 'fa-heart', label: 'Сердце' },
      { value: 'fa-thumbs-up', label: 'Лайк' },
    ],
  },
  {
    label: 'Транспорт',
    items: [
      { value: 'fa-car', label: 'Автомобиль' },
      { value: 'fa-taxi', label: 'Такси' },
      { value: 'fa-shuttle-van', label: 'Микроавтобус' },
      { value: 'fa-plane', label: 'Самолёт' },
      { value: 'fa-ship', label: 'Корабль' },
    ],
  },
  {
    label: 'Сервис и информация',
    items: [
      { value: 'fa-headset', label: 'Поддержка' },
      { value: 'fa-phone', label: 'Телефон' },
      { value: 'fa-envelope', label: 'Конверт' },
      { value: 'fa-map-marker-alt', label: 'Локация' },
      { value: 'fa-clock', label: 'Часы' },
      { value: 'fa-calendar-days', label: 'Календарь' },
      { value: 'fa-info-circle', label: 'Информация' },
      { value: 'fa-question-circle', label: 'Вопрос' },
      { value: 'fa-check-circle', label: 'Галочка' },
      { value: 'fa-ban', label: 'Запрет' },
      { value: 'fa-list-check', label: 'Список' },
      { value: 'fa-plus-circle', label: 'Плюс' },
    ],
  },
];

const ALL_ICON_VALUES = new Set<string>();
for (const group of ICON_CATALOG) {
  for (const icon of group.items) {
    ALL_ICON_VALUES.add(icon.value);
  }
}

export function isValidIcon(value: string): boolean {
  return ALL_ICON_VALUES.has(value);
}

export function getAllIconValues(): string[] {
  return Array.from(ALL_ICON_VALUES);
}

export const ROOM_BADGES: IconOption[] = [
  { value: '', label: 'Без бейджа' },
  { value: 'Популярный', label: 'Популярный' },
  { value: 'Лучший вид', label: 'Лучший вид' },
  { value: 'VIP', label: 'VIP' },
  { value: 'Для семьи', label: 'Для семьи' },
  { value: 'Премиум', label: 'Премиум' },
  { value: 'Новинка', label: 'Новинка' },
];

const ALL_BADGE_VALUES = new Set(ROOM_BADGES.map((b) => b.value));

export function isValidRoomBadge(value: string): boolean {
  return ALL_BADGE_VALUES.has(value);
}

export interface RatingOption {
  value: number;
  label: string;
}

export const RATING_LEVELS: RatingOption[] = [
  { value: 5, label: '★★★★★ Отлично' },
  { value: 4, label: '★★★★☆ Хорошо' },
  { value: 3, label: '★★★☆☆ Нормально' },
  { value: 2, label: '★★☆☆☆ Плохо' },
  { value: 1, label: '★☆☆☆☆ Очень плохо' },
];

export const GUEST_COUNT_OPTIONS: IconOption[] = [
  { value: '', label: 'Выберите' },
  { value: '1', label: '1 гость' },
  { value: '2', label: '2 гостя' },
  { value: '3', label: '3 гостя' },
  { value: '4', label: '4 гостя' },
  { value: '5+', label: '5+ гостей' },
];

export const ROOM_CATEGORY_OPTIONS: IconOption[] = [
  { value: 'STANDARD', label: 'Стандарт' },
  { value: 'DELUXE', label: 'Люкс' },
  { value: 'COTTAGE', label: 'Коттедж' },
];

export const GALLERY_CATEGORY_OPTIONS: IconOption[] = [
  { value: 'LAKE', label: 'Озеро' },
  { value: 'ROOMS', label: 'Номера' },
  { value: 'FOOD', label: 'Ресторан' },
  { value: 'ACTIVITIES', label: 'Активности' },
];

export const References = {
  iconCatalog: ICON_CATALOG,
  roomBadges: ROOM_BADGES,
  ratingLevels: RATING_LEVELS,
  guestCounts: GUEST_COUNT_OPTIONS,
  roomCategories: ROOM_CATEGORY_OPTIONS,
  galleryCategories: GALLERY_CATEGORY_OPTIONS,
};
