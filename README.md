# 🏖 Issyk-Kul Resort

Информационный сайт центра отдыха «Иссык-Куль Резорт» с админ-панелью для управления контентом. Построен на Express + TypeScript + EJS + Prisma + PostgreSQL, упакован в Docker Compose.

> Публичный сайт открывается на `http://localhost:3000`, админка — на `http://localhost:3000/admin`.

---

## ✨ Возможности

### Публичная часть
- **5 страниц** с динамическим контентом из БД:
  - `/` — главная (hero, преимущества, превью «О курорте», топовые номера, отзывы)
  - `/about` — история, инфо об озере, услуги, команда, награды
  - `/rooms` — каталог номеров с фильтром по категории
  - `/rooms/:slug` — детальная страница номера
  - `/gallery` — фотогалерея с фильтром по категориям и модальным просмотром
  - `/contacts` — контакты, форма обратной связи (CSRF + zod-валидация), карта, FAQ
- Все CSS-классы и `data-*`-атрибуты сохранены из исходной вёрстки — мобильное меню, фильтры, модалка галереи и FAQ-аккордеон работают без переписывания JS
- **Toast-уведомления** для flash-сообщений сервера и клиентской валидации

### Админ-панель `/admin`
- Авторизация по логину/паролю из `.env` (сессии в PostgreSQL через `connect-pg-simple`)
- **CRUD по 9 сущностям**: Rooms, Gallery, Testimonials, Services, Team, Features, Awards, FAQs, Booking Conditions
- Просмотр сообщений из формы обратной связи (`/admin/messages`)
- Singleton-настройки сайта (`/admin/settings`): телефоны, адрес, hero-блок, тексты, social-links, карта, JSON-поля
- **Загрузка изображений** через multer + sharp с автогенерацией webp 1600px и thumb 600px (volume `uploads`)
- **Селекты из справочников**:
  - Иконки Font Awesome — сгруппированный select с превью иконки рядом
  - Бейджи номеров — фиксированный список («Популярный», «VIP», «Лучший вид», …)
  - Рейтинг отзывов — со звёздами
- **Validation UX**: на ошибке валидации форма пересобирается с сохранёнными значениями + field-level подсказками + toast с резюме ошибок
- **CSRF-защита** на всех POST/PUT/DELETE (csrf-csrf, double-submit cookie)
- Rate-limit на `/admin/login` и `POST /contacts`

---

## 🛠 Технологический стек

| Категория | Пакеты |
|---|---|
| **Runtime** | Node.js 20+, Express 5, EJS 5 (+ express-ejs-layouts) |
| **Язык** | TypeScript 6 (CommonJS), tsx (dev) |
| **БД и ORM** | PostgreSQL 18, Prisma 6 |
| **Сессии и безопасность** | express-session + connect-pg-simple, helmet 8 (CSP), csrf-csrf 4, bcrypt 6, express-rate-limit 8 |
| **Валидация** | zod 4 |
| **Шаблонизация и формы** | EJS, method-override, connect-flash |
| **Файлы и изображения** | multer 2, sharp 0.34, nanoid 3 |
| **Логирование** | pino 10 + pino-http (+ pino-pretty в dev) |
| **Утилиты** | dotenv 17, slugify 1.6, dayjs 1.11, compression, cookie-parser, cors |
| **Инфраструктура** | Docker 24+, Docker Compose v2 |

---

## 💻 Системные требования

- **Docker** ≥ 24 и **Docker Compose** v2 (`docker compose ...`, не `docker-compose`)
- (опционально, для локальной разработки без Docker) **Node.js** ≥ 20 и **npm** ≥ 10

Текущие проверенные версии: Node 24, npm 11, Docker 29, PostgreSQL 18-alpine.

---

## 🚀 Быстрый старт (production-режим)

```bash
git clone <repository-url>
cd issyk-kul-resort

# Создать .env из шаблона и заполнить секреты
cp .env.example .env
# ⚠️ Обязательно поменять: SESSION_SECRET, COOKIE_SECRET, CSRF_SECRET, ADMIN_PASSWORD
# (длина секретов — минимум 32 символа)

# Поднять стек (app + postgres) и собрать образ
docker compose up -d --build

# Загрузить начальный контент (один раз)
docker compose exec app npm run seed:prod

# Открыть http://localhost:3000
# Админка: http://localhost:3000/admin/login
```

Entrypoint app-контейнера автоматически выполняет `npx prisma migrate deploy` перед стартом сервера — миграции не нужно прогонять вручную.

---

## 🧪 Dev-режим (hot-reload)

```bash
cp .env.example .env
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npm run seed
```

Что даёт dev-стек:
- **tsx watch** перезапускает сервер при любых изменениях в `src/`
- **Bind-mounts** для `./src`, `./views`, `./public`, `./prisma` — правки видны мгновенно
- **PostgreSQL проброшен на 5433** — можно подключиться из psql/DataGrip:
  ```bash
  psql postgresql://resort:changeme@localhost:5433/resort
  ```
- `NODE_ENV=development` — cookies без флага `secure`, формы работают по HTTP

Логи:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f app
```

---

## 🌐 Production-деплой

### Что произойдёт при `docker compose up -d --build`

1. Сборка multi-stage образа (`deps` → `build` → `prod-deps` → `runtime`), финальный — без dev-зависимостей
2. Поднятие PostgreSQL 18-alpine с volume `postgres_data`
3. Healthcheck PostgreSQL → старт app-контейнера
4. App entrypoint: `npx prisma migrate deploy && node dist/server.js`

### Обязательное окружение

| Переменная | Назначение | Заметка |
|---|---|---|
| `PG_USER`, `PG_PASSWORD`, `PG_DB` | креды PostgreSQL | используются и Postgres-контейнером, и в `DATABASE_URL` |
| `SESSION_SECRET` | подпись сессионной cookie | ≥ 32 символа |
| `COOKIE_SECRET` | подпись cookies | ≥ 32 символа |
| `CSRF_SECRET` | подпись CSRF-токена | ≥ 32 символа |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | стартовый админ | создаётся при seed |
| `LOG_LEVEL` | pino log level | по умолчанию `info` |

### HTTPS обязательно

В `NODE_ENV=production` сессионная и CSRF-cookie помечены `secure: true` — отправляются браузером **только по HTTPS**. Поэтому:

- Поставьте перед app **TLS-прокси** (nginx, Caddy, Traefik, Cloudflare Tunnel)
- Прокси должен передавать `X-Forwarded-Proto: https` — Express это считывает (`trust proxy: 1`)
- Без HTTPS форма контактов и логин админки будут отбрасывать запросы как невалидные

### Volumes

- `postgres_data` — данные БД
- `uploads` — загруженные через админку картинки (`/app/public/uploads/originals|large|thumb`)

Backup обоих volumes — обязательная регулярная задача (`docker run --rm -v issyk-kul-resort_postgres_data:/data alpine tar czf - /data | gzip > backup.tar.gz`).

### Seed в проде

После первого деплоя один раз:

```bash
docker compose exec app npm run seed:prod
```

Seed идемпотентный (upsert по уникальным ключам, deleteMany + createMany для коллекций), но повторный запуск перезатрёт текущий контент списочных сущностей (Rooms, Gallery, и т.д.) — для прода лучше выполнять только один раз.

---

## 🔑 Учётные данные админки

Дефолт из `.env.example`:
- **Логин:** `admin`
- **Пароль:** `admin123`

**Обязательно поменяйте `ADMIN_PASSWORD` в `.env` перед запуском в проде.** При изменении пароля выполните seed повторно — он сделает `bcrypt.hash` нового значения и обновит запись `AdminUser`:

```bash
docker compose exec app npm run seed:prod
```

---

## 📁 Структура проекта

```
issyk-kul-resort/
├── docker/
│   └── Dockerfile               # multi-stage build
├── docker-compose.yml           # production
├── docker-compose.dev.yml       # dev override (применяется только явным флагом -f)
├── prisma/
│   ├── schema.prisma            # 13 моделей + enums
│   └── migrations/0_init/       # начальная миграция
├── src/
│   ├── app.ts, server.ts        # bootstrap
│   ├── config/                  # env (zod), db (PrismaClient), logger (pino), paths
│   ├── middleware/              # auth, csrf, session, flashLocals, validate, upload, errorHandler
│   ├── controllers/
│   │   ├── public/              # home, about, rooms, gallery, contacts
│   │   └── admin/               # auth, dashboard, rooms, gallery, team, messages, settings, simpleCrud (фабрика)
│   ├── services/                # доступ к Prisma (room, gallery, settings, …)
│   ├── routes/                  # public.routes + admin/index
│   ├── schemas/                 # zod схемы для форм
│   ├── utils/                   # asyncHandler, errors, slugify, formErrors, params
│   └── seed.ts                  # начальные данные (компилируется в dist/seed.js)
├── views/
│   ├── layouts/                 # main, admin, admin-blank
│   ├── partials/                # navbar, footer, toasts, field-error, icon-select, flash
│   ├── public/                  # 5 страниц + error
│   └── admin/                   # login, dashboard, settings + CRUD форм
├── public/                      # отдаётся express.static
│   ├── styles.css, script.js    # фронтенд оригинального сайта
│   ├── admin.css, admin.js      # стили и JS админки
│   ├── toast.js                 # глобальный window.toast API
│   └── uploads/                 # volume в docker, gitignored
├── .env.example
├── package.json, tsconfig.json, eslint.config.mjs
└── README.md
```

---

## ⚙️ npm-скрипты

| Скрипт | Описание |
|---|---|
| `npm run dev` | Запуск сервера через tsx watch (для локальной разработки без Docker) |
| `npm run build` | Компиляция TypeScript → `dist/` |
| `npm start` | Запуск собранного `dist/server.js` |
| `npm run seed` | Seed через tsx (dev) |
| `npm run seed:prod` | Seed через `node dist/seed.js` (prod-контейнер без tsx) |
| `npm run prisma:migrate` | `prisma migrate dev` — создать миграцию |
| `npm run prisma:deploy` | `prisma migrate deploy` — применить миграции в проде |
| `npm run prisma:generate` | Сгенерировать Prisma Client |
| `npm run lint` | ESLint |
| `npm run format` | Prettier для `src/**/*.ts` и `views/**/*.ejs` |

---

## 🔧 Полезные команды

```bash
# Логи приложения
docker compose logs -f app

# Подключиться к БД
docker compose exec postgres psql -U resort -d resort

# Статус миграций
docker compose exec app npx prisma migrate status

# Перезапустить только app (после правки .env)
docker compose up -d --force-recreate app

# Открыть shell в контейнере
docker compose exec app sh

# Остановить и удалить контейнеры с volume (⚠ удалит БД и загрузки!)
docker compose down -v
```

### Локальная разработка без Docker

Нужны Node 20+ и локально запущенный PostgreSQL.

```bash
npm install
# В .env прописать DATABASE_URL=postgresql://user:pass@localhost:5432/resort
npx prisma migrate dev
npm run seed
npm run dev
```

---

## 🌐 HTTP-endpoint-ы

### Публичные
| Метод | URL | Назначение |
|---|---|---|
| GET | `/` | Главная |
| GET | `/about` | О нас |
| GET | `/rooms` | Каталог номеров |
| GET | `/rooms/:slug` | Детальная страница номера |
| GET | `/gallery` (`?category=lake\|rooms\|food\|activities`) | Галерея |
| GET | `/contacts` | Контакты + форма |
| POST | `/contacts` | Отправка формы (CSRF + zod) |
| GET | `/healthz` | Health-check для Docker/k8s |

### Админские (требуют логина, префикс `/admin`)
| Метод | URL | Назначение |
|---|---|---|
| GET / POST | `/admin/login` | Вход (rate-limit 10/15мин) |
| POST | `/admin/logout` | Выход |
| GET | `/admin` | Dashboard со счётчиками |
| RESTful | `/admin/{rooms,gallery,testimonials,services,team,features,awards,faqs,booking-conditions}` | CRUD по ресурсам |
| POST | `/admin/rooms/:id/images` | Загрузка изображения номера |
| DELETE | `/admin/rooms/:id/images/:imageId` | Удаление изображения |
| POST | `/admin/rooms/:id/images/:imageId/primary` | Сделать главным |
| GET | `/admin/messages` (`?filter=unread\|read`) | Сообщения из формы |
| GET / DELETE | `/admin/messages/:id` | Просмотр / удаление |
| GET / PUT | `/admin/settings` | Настройки сайта |

---

## 🐛 Траблшутинг

| Симптом | Причина | Решение |
|---|---|---|
| `Cannot reach database server` | Postgres ещё не готов | Перезапустить с задержкой; entrypoint app ждёт healthcheck PG |
| Форма контактов возвращает 500 «invalid csrf token» | Сессия истекла / cookie не отправлена | Перезагрузить страницу |
| Логин/форма не работают в проде по HTTP | `cookie.secure=true` в проде | Поставить TLS-прокси (nginx/caddy) с `X-Forwarded-Proto: https` |
| `prisma:warn libssl/openssl` в логах | Prisma 6 на bookworm-slim | Безвредно, можно игнорировать |
| 422 при сохранении админ-формы | Ошибка валидации zod | Форма пересобирается со значениями и toast-сообщением — заполните указанные поля |
| Картинки не появляются после загрузки | Volume `uploads` примонтирован к `/app/public/uploads` | Проверьте `docker volume ls` |

---

## 📄 Лицензия

Проект разработан для центра отдыха «Иссык-Куль Резорт».
