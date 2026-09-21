import '@testing-library/jest-dom';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'whatwg-fetch';
import nock from 'nock';

import App from '../src/components/App.jsx';
import { useUsersUiStore } from '../src/stores/usersUiStore.js';

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  useUsersUiStore.setState({ search: '', selectedUserId: null });
});

test('filters server users and loads details by id', async () => {
  const users = [
    { id: '1', name: 'Ann' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Alice' },
  ];

  nock('http://localhost').get('/api/users').reply(200, users);
  nock('http://localhost').get('/api/users/1').reply(200, users[0]);

  renderApp();

  await waitFor(() => expect(screen.getByText('Ann')).toBeInTheDocument());

  await userEvent.type(screen.getByTestId('search'), 'a');
  expect(screen.getByTestId('user-1')).toBeInTheDocument();
  expect(screen.queryByTestId('user-2')).not.toBeInTheDocument();
  expect(screen.getByTestId('user-3')).toBeInTheDocument();

  await userEvent.click(screen.getByTestId('user-1'));
  expect(await screen.findByTestId('selected-name')).toHaveTextContent('Ann');

  await userEvent.click(screen.getByTestId('clear'));
  expect(screen.getByTestId('details')).toHaveTextContent('Пользователь не выбран');
});

test('shows an HTTP error while loading the list', async () => {
  nock('http://localhost').get('/api/users').reply(500, {
    message: 'Server error',
  });

  renderApp();

  expect(await screen.findByText('Ошибка списка: HTTP 500')).toBeInTheDocument();
});

test('shows an HTTP error while loading user details', async () => {
  const users = [{ id: '404', name: 'Ghost' }];

  nock('http://localhost').get('/api/users').reply(200, users);
  nock('http://localhost').get('/api/users/404').reply(404, {
    message: 'Not found',
  });

  renderApp();

  await userEvent.click(await screen.findByTestId('user-404'));
  expect(await screen.findByText('Ошибка деталей: HTTP 404')).toBeInTheDocument();
});
afterEach(() => {
  nock.cleanAll();
});
