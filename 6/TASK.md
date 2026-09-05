# Связка Zustand + TanStack Query

Соберём Users API целиком: серверные данные — в TanStack Query, UI (поиск и выбор) — в Zustand.

| Метод | Маршрут         | Описание              |
| ----- | --------------- | --------------------- |
| GET   | /api/users      | Список пользователей  |
| GET   | /api/users/{id} | Один пользователь     |

## src/stores/usersUiStore.js

Реализуйте UI-store (как в задании 2): `search`, `selectedUserId`, `setSearch`, `selectUser`, `clearSelection`.

## src/api/users.js

Реализуйте:

- вспомогательную функцию `request(url, options)`;
- проверку `response.ok`: для HTTP 4xx/5xx выбрасывайте `Error` с текстом `HTTP <status>`;
- `fetchUsers` и `fetchUserById(id)` через `request`.

## src/components/UsersPage.jsx

1. Загрузите список через `useQuery` с ключом `['users']`.
2. Отфильтруйте список по `search` из Zustand.
3. По клику вызывайте `selectUser`.
4. Для деталей используйте второй `useQuery` с ключом `['users', selectedUserId]`, `enabled: Boolean(selectedUserId)`.
5. Обработайте загрузку и ошибки списка и деталей.

Разметка должна содержать:

- поле поиска с `data-testid="search"`;
- список с `data-testid="users-list"`;
- кнопку каждого пользователя с `data-testid="user-{id}"`;
- блок деталей с `data-testid="details"`;
- имя выбранного пользователя с `data-testid="selected-name"`;
- кнопку `Сбросить` с `data-testid="clear"`, вызывающую `clearSelection`.

Состояния интерфейса:

- при первой загрузке списка — `Загрузка...`;
- при ошибке списка — `Ошибка списка: ` и `error.message`;
- без выбранного пользователя — `Пользователь не выбран`;
- при загрузке деталей — `Загрузка...`;
- при ошибке деталей — `Ошибка деталей: ` и `error.message`.

## Подсказки

- Не кладите список пользователей в Zustand — это серверное состояние.
- `fetch` сам по себе не отклоняет Promise при HTTP 4xx/5xx.
- Проверяйте `isPending` и `isError` отдельно для списка и деталей.
