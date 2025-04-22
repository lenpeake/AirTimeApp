// components/ScreenWithHeaderFooter.js
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';

export default function ScreenWithHeaderFooter({ children }) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleProtectedNavigation = (screen) => {
    if (!user) {
      Alert.alert(t('login.errorTitle'), t('logout.confirmMessage'));
    } else {
      navigation.navigate(screen);
    }
  };

  const getButtonStyle = (enabled) => ({
    color: enabled ? '#1f2937' : '#9ca3af',
  });

  return (
    <ImageBackground
      source={{ uri: 'https://imagizer.imageshack.com/img924/5425/VvhhzS.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animatable.View
            animation="fadeIn"
            duration={700}
            delay={150}
            useNativeDriver
            style={styles.animatedContainer}
          >
            {children}
          </Animatable.View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerNav}>
            {/* Home (Always Available) */}
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('LandingPage')}
            >
              <FontAwesome name="home" size={16} style={[styles.icon, getButtonStyle(true)]} />
              <Text style={[styles.footerButton, getButtonStyle(true)]}>
                {t('footer.home')}
              </Text>
            </TouchableOpacity>

            {/* Airport (Protected) */}
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => handleProtectedNavigation('AirportSelectionPage')}
            >
              <FontAwesome name="plane" size={16} style={[styles.icon, getButtonStyle(!!user)]} />
              <Text style={[styles.footerButton, getButtonStyle(!!user)]}>
                {t('footer.airport')}
              </Text>
            </TouchableOpacity>

            {/* Profile (Protected) */}
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => handleProtectedNavigation('ProfileScreen')}
            >
              <FontAwesome name="user-circle" size={16} style={[styles.icon, getButtonStyle(!!user)]} />
              <Text style={[styles.footerButton, getButtonStyle(!!user)]}>
                {t('footer.profile')}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(243,244,246,0.50)',
  },
  animatedContainer: {
    flex: 1,
  },
  footer: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 6,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  footerButton: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 12,
    color: '#374151',
    fontStyle: 'italic',
  },
});
