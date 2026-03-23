# Vibecodify — Бекенд для сбора заявок

## Установка

```bash
npm install
```

## Запуск

```bash
npm start
```

Сервер запустится на `http://localhost:3000`

## Использование

- **Лендинг**: `http://localhost:3000/vibecodify.html`
- **Админка**: `http://localhost:3000/admin`

## API

### POST /api/leads
Создание заявки

```json
{
  "name": "Иван Иванов",
  "phone": "@ivan",
  "company": "ООО Компания",
  "task": "Нужен B2B портал"
}
```

### GET /api/leads
Получение всех заявок

## База данных

JSON база `leads.json` создаётся автоматически при первом запуске.

## Структура

- `server.js` — Express сервер + API
- `admin.html` — админка для просмотра заявок
- `vibecodify.html` — лендинг с формой
- `leads.db` — база данных SQLite
