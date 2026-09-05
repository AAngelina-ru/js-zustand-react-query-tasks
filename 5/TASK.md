# useMutation и invalidateQueries

Список пользователей уже загружается через `useQuery`. Нужно добавить создание и удаление с инвалидацией кэша.

| Метод  | Маршрут          | Описание                |
| ------ | ---------------- | ----------------------- |
| GET    | /api/users       | Список пользователей    |
| POST   | /api/users       | Создание пользователя   |
| DELETE | /api/users/{id}  | Удаление пользователя   |

Тело `POST`:

```json
{ "name": "Ann" }
```

## src/api/users.js

Допишите функции `createUser(user)` и `deleteUser(id)` (помимо уже готового `fetchUsers`).

- Для всех запросов используйте готовую функцию `request`, которая проверяет `response.ok`.
- В `POST` передайте JSON-тело и заголовок `Content-Type: application/json`.
- `deleteUser(id)` должен отправлять `DELETE /api/users/{id}`.

## src/components/UsersBox.jsx

1. Подключите `useMutation` для создания и удаления.
2. После успешной мутации вызывайте `queryClient.invalidateQueries({ queryKey: ['users'] })`.
3. В обработчиках формы и удаления вызовите `mutate`.

## Подсказки

- `useQueryClient()` даёт доступ к клиенту для инвалидации.
- Пока `isPending` у запроса списка — покажите `Загрузка...`.
