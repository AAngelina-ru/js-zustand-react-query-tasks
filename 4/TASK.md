# useQuery — список пользователей

Переходим к серверному состоянию. Нужно загрузить список пользователей через TanStack Query.

| Метод | Маршрут   | Описание                   |
| ----- | --------- | -------------------------- |
| GET   | /api/users | Получение списка пользователей |

## src/api/users.js

Реализуйте:

- вспомогательную функцию `request(url, options)`;
- проверку `response.ok`: для HTTP 4xx/5xx выбрасывайте `Error` с текстом `HTTP <status>`;
- функцию `fetchUsers`, которая делает `GET /api/users` и возвращает JSON.

## src/components/UsersList.jsx

С помощью `useQuery`:

- `queryKey: ['users']`;
- `queryFn: fetchUsers`.

Пока идёт первая загрузка (`isPending`) покажите текст `Загрузка...`.
При ошибке (`isError`) покажите `Ошибка: ` и `error.message`.
Иначе отрисуйте список имён пользователей.

## Подсказки

- `QueryClientProvider` уже подключён в `src/index.jsx`.
- В v5 для обычного начального состояния удобно использовать `isPending`.
- `fetch` сам по себе не отклоняет Promise при HTTP 4xx/5xx.
