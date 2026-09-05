import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import App from '../src/components/App.jsx';
import { useUsersUiStore } from '../src/stores/usersUiStore.js';

beforeEach(() => {
  useUsersUiStore.setState({ search: '', selectedUserId: null });
});

test('filters users by search and selects user', async () => {
  render(<App />);

  expect(screen.getByTestId('user-1')).toBeInTheDocument();
  expect(screen.getByTestId('user-2')).toBeInTheDocument();
  expect(screen.getByTestId('user-3')).toBeInTheDocument();

  await userEvent.type(screen.getByTestId('search'), 'a');
  expect(screen.getByTestId('user-1')).toBeInTheDocument();
  expect(screen.queryByTestId('user-2')).not.toBeInTheDocument();
  expect(screen.getByTestId('user-3')).toBeInTheDocument();

  await userEvent.click(screen.getByTestId('user-1'));
  expect(screen.getByTestId('selection')).toHaveTextContent('Выбран: Ann');

  await userEvent.click(screen.getByTestId('clear'));
  expect(screen.getByTestId('selection')).toHaveTextContent('Пользователь не выбран');
});
