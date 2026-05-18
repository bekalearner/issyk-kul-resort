npm install
cp .env.example .env
npm run docker:dev                                                                          # сборка без кэша + up
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npx prisma migrate deploy   # миграции
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npm run seed                 # данные
