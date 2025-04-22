import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { supabase } from './supabase';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import ScreenWithHeaderFooter from './ScreenWithHeaderFooter';
import { useTranslation } from 'react-i18next';

const { height } = Dimensions.get('window');

export default function CreateNewAccount() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setLoading(false);
      Alert.alert(t('createAccount.signupError'), error.message);
      return;
    }

    const userId = data?.user?.id;

    if (!userId) {
      setLoading(false);
      Alert.alert(t('createAccount.signupError'), 'User ID not returned by Supabase.');
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        [
          {
            id: userId,
            first_name: firstName,
            last_name: lastName,
            preferred_name: preferredName,
            zipcode: zipcode,
            is_first_login: true,
          },
        ],
        { onConflict: ['id'] }
      );

    if (profileError) {
      setLoading(false);
      Alert.alert(t('createAccount.profileError'), profileError.message);
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (loginError) {
      Alert.alert(t('createAccount.loginError'), loginError.message);
    } else {
      navigation.navigate('LandingPage');
    }
  };

  if (loading) {
    return (
      <ScreenWithHeaderFooter>
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('./assets/airplane-takeoff.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.loadingText}>{t('createAccount.loading')}</Text>
        </View>
      </ScreenWithHeaderFooter>
    );
  }

  return (
    <ScreenWithHeaderFooter>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.card}>
            <Text style={styles.title}>{t('createAccount.title')}</Text>

            <TextInput
              style={styles.input}
              placeholder={t('createAccount.firstName')}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder={t('createAccount.lastName')}
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder={t('createAccount.preferredName')}
              value={preferredName}
              onChangeText={setPreferredName}
            />
            <TextInput
              style={styles.input}
              placeholder={t('createAccount.zipcode')}
              value={zipcode}
              onChangeText={setZipcode}
              keyboardType="number-pad"
            />
            <TextInput
              style={styles.input}
              placeholder={t('createAccount.email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder={t('createAccount.password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
              <Text style={styles.buttonText}>{t('createAccount.button')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
              <Text style={styles.link}>{t('createAccount.backToLogin')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenWithHeaderFooter>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 24,
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
    marginBottom: 16,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    fontSize: 18,
  },
  link: {
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  loadingText: {
    marginTop: 20,
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Inter_18pt',
  },
});
