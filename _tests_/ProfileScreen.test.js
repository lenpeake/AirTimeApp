import React from 'react';
import { render } from '@testing-library/react-native';
import ProfileScreen from '../components/ProfileScreen';
import { PreferredNameProvider } from '../components/PreferredNameContext';
import { NavigationContainer } from '@react-navigation/native';

test('renders profile title and preferred name input', () => {
  const { getByText, getByPlaceholderText } = render(
    <NavigationContainer>
      <PreferredNameProvider>
        <ProfileScreen />
      </PreferredNameProvider>
    </NavigationContainer>
  );

  expect(getByText(/Your Profile/i)).toBeTruthy();
  expect(getByPlaceholderText(/Enter your preferred name/i)).toBeTruthy();
});
