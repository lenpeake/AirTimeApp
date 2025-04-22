// components/Header.js
import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { supabase } from './supabase';
import { usePreferredName } from './PreferredNameContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useAuth } from './AuthContext';

export default function Header() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const user = auth?.user;
  const logoRef = useRef(null);
  const { setPreferredName } = usePreferredName();
  const insets = useSafeAreaInsets();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogin = () => {
    navigation.navigate('LoginPage');
  };

  const handleLogout = () => {
    Alert.alert(
      t('logout.confirmTitle'),
      t('logout.confirmMessage'),
      [
        { text: t('logout.cancel'), style: 'cancel' },
        {
          text: t('logout.confirm'),
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            setPreferredName('');
            navigation.navigate('LandingPage');
          },
        },
      ]
    );
  };

  const handleLogoPress = () => {
    logoRef.current?.pulse(500);
    navigation.navigate('LandingPage');
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
      <View style={styles.left}>
        <TouchableOpacity onPress={handleLogoPress}>
          <Animatable.Image
            ref={logoRef}
            source={require('../assets/Black_N_Transparent_Logo_2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={user ? handleLogout : handleLogin}
        >
          <Text style={styles.headerButtonText}>
            {user ? t('logout.button') || 'Logout' : t('login.button') || 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerButton} onPress={toggleLanguage}>
          <Text style={styles.headerButtonText}>
            {i18n.language === 'en' ? 'Español' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    zIndex: 10,
    width: '100%',
    height: 80,
  },
  left: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 1,
  },
  logo: {
    width: 170,
    height: 70,
    flexShrink: 0,
    alignSelf: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 2, // ✅ Blue ring
    borderColor: '#2563eb', // ✅ Brand blue
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerButtonText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'Roboto',
  },
});
