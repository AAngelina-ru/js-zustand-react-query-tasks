import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import App from '../src/components/App.jsx';
import { useSettingsStore } from '../src/stores/settingsStore.js';

beforeEach(() => {
  localStorage.clear();
  useSettingsStore.setState({ theme: 'light' });
});

test('toggles theme and persists to localStorage', async () => {
  render(<App />);

  expect(screen.getByTestId('theme')).toHaveTextContent('light');
  expect(screen.getByTestId('theme-box')).toHaveAttribute('data-theme', 'light');

  await userEvent.click(screen.getByTestId('toggle'));
  expect(screen.getByTestId('theme')).toHaveTextContent('dark');

  await waitFor(() => {
    const raw = localStorage.getItem('settings-storage');
    expect(raw).toBeTruthy();
    expect(raw).toContain('dark');
  });
});
// src/stores/settingsStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(persist((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}), {
  name: 'settings-storage',
}));
