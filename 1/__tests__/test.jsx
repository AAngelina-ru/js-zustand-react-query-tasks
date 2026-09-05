import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import App from '../src/components/App.jsx';
import { useCounterStore } from '../src/stores/counterStore.js';

beforeEach(() => {
  useCounterStore.setState({ value: 0 });
});

test('increment, decrement and reset', async () => {
  render(<App />);

  expect(screen.getByTestId('value')).toHaveTextContent('0');

  await userEvent.click(screen.getByTestId('increment'));
  expect(screen.getByTestId('value')).toHaveTextContent('1');

  await userEvent.click(screen.getByTestId('increment'));
  expect(screen.getByTestId('value')).toHaveTextContent('2');

  await userEvent.click(screen.getByTestId('decrement'));
  expect(screen.getByTestId('value')).toHaveTextContent('1');

  await userEvent.click(screen.getByTestId('reset'));
  expect(screen.getByTestId('value')).toHaveTextContent('0');
});
