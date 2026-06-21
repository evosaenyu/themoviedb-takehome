import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders movie card', () => {
  render(<App />);
  expect(screen.getByText('Movie title')).toBeInTheDocument();
});
