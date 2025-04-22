import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your pages
import LandingPage from '../components/LandingPage';
import AirportSelectionPage from '../components/AirportSelectionPage';
import AirportDetails from '../components/AirportDetails';
import FutureSuggestionsPage from '../components/FutureSuggestionsPage';
import LoginPage from '../components/LoginPage';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen 
          name="LandingPage" 
          component={LandingPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AirportSelection" 
          component={AirportSelectionPage} 
          options={{ title: "Select Airport" }}
        />
        <Stack.Screen 
          name="FutureSuggestions" 
          component={FutureSuggestionsPage} 
          options={{ title: "Future Suggestions" }}
        />
        <Stack.Screen 
          name="AirportDetails" 
          component={AirportDetails} 
          options={{ title: "Details" }}
        />
        <Stack.Screen
          name="Login" 
          component={LoginPage} 
          options={{ title: 'Login' }} 
        />
        <Stack.Screen
        name="firebase"
        component={firebase}
        options={{firebase}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
