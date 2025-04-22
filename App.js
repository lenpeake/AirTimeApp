import './i18n-setup'; // Language support
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';

import { AuthProvider } from './components/AuthContext';
import { PreferredNameProvider } from './components/PreferredNameContext';
import { WelcomeOverlayProvider } from './components/WelcomeOverlay';

import LandingPage from './components/LandingPage';
import AirportSelectionPage from './components/AirportSelectionPage';
import AirportWaitTimeScreen from './components/AirportWaitTimeScreen';
import AirportDetails from './components/AirportDetails';
import FutureSuggestionsScreen from './components/FutureSuggestionsPage';
import LoginPage from './components/LoginPage';
import CreateNewAccount from './components/CreateNewAccount';
import ActualWaitTimeInput from './components/ActualWaitTimeInput';
import ThankYouScreen from './components/ThankYouScreen';
import ProfileScreen from './components/ProfileScreen';

import { pollAllMonitoredAirports } from './utils/BackgroundPolling';

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

// Deep Linking Config
const linking = {
  prefixes: ['airtime://', 'https://getairtime.app'],
  config: {
    screens: {
      LandingPage: 'home',
      LoginPage: 'login',
      CreateNewAccount: 'signup',
      AirportSelectionPage: 'airports',
      AirportDetails: 'airport/:airportCode',
      AirportWaitTimeScreen: 'waittime',
      ActualWaitTimeInput: 'actualwait',
      ThankYouScreen: 'thanks',
      ProfileScreen: 'profile',
      FutureSuggestionsScreen: 'future',
    },
  },
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Font loading if needed later
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🕒 Running background TSA polling...');
      pollAllMonitoredAirports();
    }, 10 * 60 * 1000); // every 10 minutes

    return () => clearInterval(interval);
  }, []);

  if (!appIsReady) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <PreferredNameProvider>
          <WelcomeOverlayProvider>
            <NavigationContainer linking={linking}>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                  animation: 'fade',
                }}
              >
                <Stack.Screen name="LandingPage" component={LandingPage} />
                <Stack.Screen name="AirportSelectionPage" component={AirportSelectionPage} />
                <Stack.Screen name="AirportWaitTimeScreen" component={AirportWaitTimeScreen} />
                <Stack.Screen name="AirportDetails" component={AirportDetails} />
                <Stack.Screen name="FutureSuggestionsScreen" component={FutureSuggestionsScreen} />
                <Stack.Screen name="LoginPage" component={LoginPage} />
                <Stack.Screen name="CreateNewAccount" component={CreateNewAccount} />
                <Stack.Screen name="ActualWaitTimeInput" component={ActualWaitTimeInput} />
                <Stack.Screen name="ThankYouScreen" component={ThankYouScreen} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </WelcomeOverlayProvider>
        </PreferredNameProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}
