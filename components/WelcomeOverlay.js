import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const WelcomeOverlayContext = createContext();

export const useWelcomeOverlay = () => useContext(WelcomeOverlayContext);

export function WelcomeOverlayProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('Traveler');
  const [firstTime, setFirstTime] = useState(false);

  const showOverlay = ({ preferredName, isFirstLogin }) => {
    console.log('🔔 Showing global WelcomeOverlay:', preferredName);
    setName(preferredName || 'Traveler');
    setFirstTime(isFirstLogin);
    setVisible(true);

    setTimeout(() => {
      console.log('❌ Hiding global WelcomeOverlay...');
      setVisible(false);
    }, 8000);
  };

  return (
    <WelcomeOverlayContext.Provider value={{ showOverlay }}>
      {children}
      {visible && (
        <Animatable.View animation="fadeIn" duration={800} style={styles.overlay}>
          <Text style={styles.cardText}>
            {firstTime
              ? `Welcome to AirTime, ${name}!`
              : `Welcome back, ${name}!`}
          </Text>
          <LottieView
            source={
              firstTime
                ? require('../assets/celebration.json')
                : require('../assets/toast.json')
            }
            autoPlay
            loop={false}
            style={styles.lottie}
          />
        </Animatable.View>
      )}
    </WelcomeOverlayContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height,
    width,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardText: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
});
