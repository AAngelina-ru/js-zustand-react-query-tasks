# Базовый store Zustand

В этом задании нужно создать простой store счётчика на Zustand — без Provider и без dispatch.

## src/stores/counterStore.js

Создайте store `useCounterStore` с помощью `create` из `zustand`:

- `value` — начальное значение `0`;
- `increment` — увеличивает `value` на 1;
- `decrement` — уменьшает `value` на 1;
- `reset` — сбрасывает `value` в `0`.

Используйте `set` для обновления состояния. Для `increment` / `decrement` удобнее функциональная форма:

```js
set((state) => ({ value: state.value + 1 }))
```
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  value: 0,
  increment: () => set((state) => ({ value: state.value + 1 })),
  decrement: () => set((state) => ({ value: state.value - 1 })),
  reset: () => set({ value: 0 }),
}));

export default useCounterStore;

## Подсказки

- Provider не нужен — компоненты подписываются через хук `useCounterStore`.
- В `Counter.jsx` уже используются селекторы `(state) => state.value` и т.п. — реализуйте поля с теми же именами.
