import React from 'react';
import { render } from '@testing-library/react-native';
import LandingPage from '../components/LandingPage';

test('renders hero title', () => {
  const { getByText } = render(<LandingPage />);
  expect(getByText(/Know Your Wait/i)).toBeTruthy();
});
