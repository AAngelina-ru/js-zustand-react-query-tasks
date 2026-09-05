import '@testing-library/jest-dom';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'whatwg-fetch';
import nock from 'nock';

import App from '../src/components/App.jsx';
import { createUser, deleteUser } from '../src/api/users.js';

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
};

test('creates and deletes users with cache invalidation', async () => {
  const items = [
    { id: '1', name: 'Ann' },
    { id: '2', name: 'Bob' },
  ];
  const newUser = { id: '3', name: 'Cid' };

  nock('http://localhost').get('/api/users').reply(200, items);
  nock('http://localhost').post('/api/users').reply(201, newUser);
  nock('http://localhost').get('/api/users').reply(200, [...items, newUser]);
  nock('http://localhost').delete(`/api/users/${newUser.id}`).reply(204);
  nock('http://localhost').get('/api/users').reply(200, items);

  renderApp();

  await waitFor(() => expect(screen.getByText('Ann')).toBeInTheDocument());

  await userEvent.type(screen.getByTestId('input'), 'Cid');
  await userEvent.click(screen.getByTestId('submit'));

  expect(await screen.findByText('Cid')).toBeInTheDocument();

  await userEvent.click(screen.getByText('Cid'));
  await waitFor(() => expect(screen.queryByText('Cid')).not.toBeInTheDocument());
  expect(screen.getByText('Ann')).toBeInTheDocument();
});

test('rejects mutation HTTP errors', async () => {
  nock('http://localhost').post('/api/users').reply(422, {
    message: 'Invalid user',
  });
  nock('http://localhost').delete('/api/users/1').reply(500, {
    message: 'Server error',
  });

  await expect(createUser({ name: '' })).rejects.toThrow('HTTP 422');
  await expect(deleteUser('1')).rejects.toThrow('HTTP 500');
});
