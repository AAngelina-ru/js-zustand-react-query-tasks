import '@testing-library/jest-dom';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import 'whatwg-fetch';
import nock from 'nock';

import App from '../src/components/App.jsx';

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

test('loads users list', async () => {
  const users = [
    { id: '1', name: 'Ann' },
    { id: '2', name: 'Bob' },
  ];
  nock('http://localhost').get('/api/users').reply(200, users);

  renderApp();

  expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('Ann')).toBeInTheDocument());
  expect(screen.getByText('Bob')).toBeInTheDocument();
});

test('shows an HTTP error', async () => {
  nock('http://localhost').get('/api/users').reply(500, {
    message: 'Server error',
  });

  renderApp();

  expect(await screen.findByText('Ошибка: HTTP 500')).toBeInTheDocument();
});
