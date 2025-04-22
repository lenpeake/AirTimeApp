import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginPage from '../components/LoginPage';

test('renders email and password fields', () => {
  const { getByPlaceholderText } = render(<LoginPage />);
  expect(getByPlaceholderText(/Email/i)).toBeTruthy();
  expect(getByPlaceholderText(/Password/i)).toBeTruthy();
});

test('has a login button', () => {
  const { getByText } = render(<LoginPage />);
  expect(getByText(/Login/i)).toBeTruthy();
});
