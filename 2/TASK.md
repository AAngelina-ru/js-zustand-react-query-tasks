# UI-store и селекторы

Серверные данные пользователей в этом задании уже есть (статический список). В Zustand нужно хранить только UI-состояние: строку поиска и выбранного пользователя.

## src/stores/usersUiStore.js

Создайте store `useUsersUiStore`:

- `search` — строка, изначально `''`;
- `selectedUserId` — `null` или id пользователя;
- `setSearch(search)` — обновляет `search`;
- `selectUser(selectedUserId)` — обновляет `selectedUserId`;
- `clearSelection()` — сбрасывает `selectedUserId` в `null`.

## Подсказки

- Селекторы в компонентах уже написаны: `useUsersUiStore((state) => state.search)` и т.д.
- Фильтрация списка по `search` выполняется в `UsersPage.jsx` — store только хранит строку поиска.
