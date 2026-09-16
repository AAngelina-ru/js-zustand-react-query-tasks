# Middleware persist

Тема оформления — клиентское состояние, которое удобно сохранять между перезагрузками. В Zustand для этого есть middleware `persist`.

## src/stores/settingsStore.js

Создайте store `useSettingsStore` с middleware `persist`:

- `theme` — изначально `'light'`;
- `setTheme(theme)` — обновляет тему (`'light'` или `'dark'`).

Оберните creator в `persist(..., { name: 'settings-storage' })`.

Пример из теории:

```js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'settings-storage' },
  ),
);
```
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'settings-storage', // ключ в localStorage
      storage: window.localStorage, // явно указываем localStorage (по умолчанию так и есть)
    },
  ),
);

## Подсказки

- В `ThemeSwitcher.jsx` тема читается и переключается через store.
- Ключ в `localStorage` должен быть `settings-storage`.
