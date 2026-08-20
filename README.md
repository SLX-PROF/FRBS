# FORBSA — корпоративный сайт

B2B-сайт производителя автоматических дверных порогов: каталог 10 моделей,
дилерские заявки, документация, админ-панель управления контентом без программиста.

## Стек
Next.js + TypeScript + Tailwind CSS + Payload CMS 3 + PostgreSQL (Docker)

## Локальный запуск (разработка)
1. Docker Desktop → `docker start forbsa-db`
   (если контейнера нет: `docker run -d --name forbsa-db -e POSTGRES_USER=forbsa -e POSTGRES_PASSWORD=forbsa_dev_password -e POSTGRES_DB=forbsa -p 5432:5432 postgres:16`)
2. `npm install`
3. `cp .env.example .env`
4. `npm run dev` → http://localhost:3000, админка: /admin

## Запуск в контейнерах (staging/prod)
`docker compose up --build`
Сайт: http://localhost:3000. База создаётся автоматически;
при первом заходе на /admin зарегистрируйте администратора.

## Деплой на сервер компании
1. `git clone` проекта на сервер
2. Настроить `.env` (продакшен-секреты)
3. `docker compose up -d --build`
4. Домен и SSL — реверс-прокси (nginx) перед портом 3000

## Структура
- `src/app` — страницы сайта и API-маршруты
- `src/collections` — коллекции CMS (Товары, Заявки, Документы, Медиа, Пользователи)
- `src/components` — компоненты (шапка, подвал, формы, поиск)
- `src/lib` — хелперы (запросы к CMS, маска телефона, Метрика)

## Фаза 2 (дорожная карта)
Личный кабинет дилера, BIM-модели, калькулятор подбора, RU/EN, интеграция с 1С.