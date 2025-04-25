// UserReports.js — with animated title and large logo
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ScreenWithHeaderFooter from './ScreenWithHeaderFooter';
import * as Animatable from 'react-native-animatable';

export default function UserReports() {
  return (
    <ScreenWithHeaderFooter>
      <View style={styles.container}>
        <Animatable.Image
          source={require('../assets/Black_N_Transparent_Logo.png')}
          animation="zoomIn"
          duration={1200}
          delay={200}
          style={styles.logo}
          resizeMode="contain"
        />

        <Animatable.Text
          animation="fadeInDown"
          delay={600}
          duration={1000}
          style={styles.title}
        >
          📡 User Reports
        </Animatable.Text>

        <Animatable.Text
          animation="fadeInUp"
          delay={1000}
          duration={1200}
          style={styles.description}
        >
          This feature is currently under construction.
        </Animatable.Text>

        <Animatable.Text
          animation={{
            0: { opacity: 0, translateY: 0 },
            0.5: { opacity: 1, translateY: -4 },
            1: { opacity: 0, translateY: 0 },
          }}
          iterationCount="infinite"
          duration={3000}
          style={styles.soon}
        >
          ✨ Coming Soon ✨
        </Animatable.Text>
      </View>
    </ScreenWithHeaderFooter>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 244, 246, 0.65)',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1e40af',
    fontFamily: 'PlayfairDisplay-Bold',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(37, 99, 235, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Inter_18pt',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  soon: {
    fontSize: 22,
    color: '#1e40af',
    fontFamily: 'CormorantGaramond-Regular',
    textAlign: 'center',
  },
});
