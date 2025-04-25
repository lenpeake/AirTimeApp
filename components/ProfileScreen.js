// components/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { usePreferredName } from './PreferredNameContext';
import ToastCard from './ToastCard';
import ScreenWithHeaderFooter from './ScreenWithHeaderFooter';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { setPreferredName } = usePreferredName();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState('');
  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    zipcode: '',
    email: '',
  });
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (sessionError || !user) {
        console.warn('[DEBUG] Session error:', sessionError?.message);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, preferred_name, zipcode')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.warn('[DEBUG] Profile fetch failed:', error.message);
        setLoading(false);
        return;
      }

      const name = data?.preferred_name || '';
      setInputValue(name);
      setPreferredName(name);
      setUserProfile({
        first_name: data?.first_name || '',
        last_name: data?.last_name || '',
        zipcode: data?.zipcode || '',
        email: user.email || '',
      });

      setEmailVerified(!!user.email_confirmed_at);
      setLoading(false);
    };

    loadProfile();
  }, [setPreferredName]);

  const handleSave = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      console.warn('[DEBUG] User not logged in during save');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ preferred_name: inputValue })
      .eq('id', userId);

    if (error) {
      console.warn('[DEBUG] Save error:', error.message);
    } else {
      await AsyncStorage.setItem('preferred_name', inputValue);
      setPreferredName(inputValue);
      setShowToast(true);
    }
  };

  const handleResendVerification = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const email = sessionData?.session?.user?.email;

    if (!email) return;

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      Alert.alert('Error', 'Failed to resend verification email.');
    } else {
      Alert.alert('Success', 'Verification email resent.');
    }
  };

  return (
    <ScreenWithHeaderFooter>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{t('profile.title')}</Text>

            <View style={styles.card}>
              <Text style={styles.label}>{t('profile.email')}</Text>
              <Text style={styles.readOnlyText}>{userProfile.email}</Text>

              <View style={styles.badgeRow}>
                <Text style={emailVerified ? styles.verifiedBadge : styles.notVerifiedBadge}>
                  {emailVerified ? '✔ Email Verified' : '✖ Email Not Verified'}
                </Text>
                {!emailVerified && (
                  <TouchableOpacity onPress={handleResendVerification}>
                    <Text style={styles.resendLink}>Resend Verification</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>{t('profile.firstName')}</Text>
              <Text style={styles.readOnlyText}>{userProfile.first_name}</Text>

              <Text style={styles.label}>{t('profile.lastName')}</Text>
              <Text style={styles.readOnlyText}>{userProfile.last_name}</Text>

              <Text style={styles.label}>{t('profile.zipcode')}</Text>
              <Text style={styles.readOnlyText}>{userProfile.zipcode}</Text>

              <Text style={styles.label}>{t('profile.preferredName')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('profile.placeholder')}
                placeholderTextColor="#9ca3af"
                value={inputValue}
                onChangeText={setInputValue}
                editable={!loading}
              />

              <TouchableOpacity
                style={[styles.saveButton, loading && styles.disabledButton]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.saveText}>{t('profile.saveButton')}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ScrollView>

        {showToast && (
          <ToastCard
            message={t('profile.savedMessage', 'Thank you for updating Preferred Name')}
            onFinish={() => {
              setShowToast(false);
              navigation.navigate('LandingPage');
            }}
          />
        )}
      </KeyboardAvoidingView>
    </ScreenWithHeaderFooter>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: 30,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(243, 244, 246, 0.85)',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 20,
    color: '#1e40af',
    marginTop: 16,
    marginBottom: 4,
  },
  readOnlyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
    color: '#111827',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  saveText: {
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    fontSize: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  verifiedBadge: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 14,
    marginRight: 12,
  },
  notVerifiedBadge: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 14,
    marginRight: 12,
  },
  resendLink: {
    fontSize: 14,
    color: '#1e40af',
    textDecorationLine: 'underline',
  },
});
