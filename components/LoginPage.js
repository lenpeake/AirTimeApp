import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';
import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { scheduleWaitNotification, requestNotificationPermissionOnce } from '../utils/Notifications';
import { requestPermissions } from '../utils/Permissions';

const { height } = Dimensions.get('window');

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const i18n = require('i18next');
  const navigation = useNavigation();

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [preferredName, setPreferredName] = useState('Traveler');

  const handleLogin = async () => {
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      console.log('📦 RAW LOGIN RESPONSE:', response);

      if (!response) {
        Alert.alert("Response is undefined. Supabase didn't return anything.");
        return;
      }

      const { data, error } = response;

      if (error) {
        console.error('❌ Login Error:', error);
        Alert.alert('Login Failed', error.message);
        return;
      }

      if (!data || !data.user) {
        console.error('❌ Missing user in response:', data);
        Alert.alert('Login Failed', 'No user returned from Supabase.');
        return;
      }

      console.log('✅ Logged in as user:', data.user.email);

      // Fetch preferred name from profile table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('preferred_name')
        .eq('id', data.user.id)
        .maybeSingle();

      const name = profile?.preferred_name || 'Traveler';
      setPreferredName(name);
      setShowWelcomeModal(true);

      // Auto-dismiss modal and continue after 5 seconds
      setTimeout(() => {
        setShowWelcomeModal(false);
        continuePostLoginFlow();
      }, 5000);
    } catch (err) {
      console.error('💥 Unexpected login error:', err);
      Alert.alert('Error', 'Unexpected error occurred.');
    }
  };

  const continuePostLoginFlow = async () => {
    const { notificationsGranted, locationGranted } = await requestPermissions();

    if (!notificationsGranted || !locationGranted) {
      Alert.alert(t('permissions.title'), t('permissions.message'));
      return;
    }

    await requestNotificationPermissionOnce();
    await promptWaitTimeOptIn();

    navigation.navigate('LandingPage');
  };

  const promptWaitTimeOptIn = async () => {
    Alert.alert(
      t('optin.title'),
      t('optin.message'),
      [
        {
          text: t('optin.notNow'),
          onPress: () => AsyncStorage.setItem('waitTimeOptIn', 'false'),
          style: 'cancel',
        },
        {
          text: t('optin.yes'),
          onPress: async () => {
            await AsyncStorage.setItem('waitTimeOptIn', 'true');
            const estimatedMinutes = 30;
            const airportCode = 'JFK';
            const deviceId = 'abc123-device-xyz';
            const language = i18n.language;

            await scheduleWaitNotification(estimatedMinutes, {
              airportCode,
              estimatedMinutes,
              deviceId,
              language,
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <Image
          source={require('./assets/airtime-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>{t('login.title')}</Text>

            <TextInput
              style={styles.input}
              placeholder={t('login.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder={t('login.passwordPlaceholder')}
              secureTextEntry
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>{t('login.button')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => navigation.navigate('CreateNewAccount')}
            >
              <Text style={styles.signupText}>{t('signup.button')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ✅ Welcome Modal */}
      <Modal visible={showWelcomeModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Image
              source={require('../assets/Black_N_Transparent_Logo.png')}
              style={styles.modalLogo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Welcome Back, {preferredName}!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: '90%',
    height: '60%',
    marginTop: height * 0.01,
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: height * 0.04,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    fontFamily: 'Inter_18pt',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    fontSize: 18,
  },
  signupButton: {
    alignItems: 'center',
    padding: 10,
  },
  signupText: {
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    fontSize: 15,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  modalLogo: {
    width: 250,
    height: 90,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#111827',
    textAlign: 'center',
  },
});
