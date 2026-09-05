import React from 'react';

import { useSettingsStore } from '../stores/settingsStore.js';

const ThemeSwitcher = () => {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);

  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <div className="col-5" data-testid="theme-box" data-theme={theme}>
      <p>
        Текущая тема:
        {' '}
        <strong data-testid="theme">{theme}</strong>
      </p>
      <button
        type="button"
        className="btn btn-primary"
        data-testid="toggle"
        onClick={() => setTheme(nextTheme)}
      >
        Переключить на
        {' '}
        {nextTheme}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
