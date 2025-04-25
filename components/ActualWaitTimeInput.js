import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { submitWaitTime } from '../utils/Backend';
import ScreenWithHeaderFooter from '../components/ScreenWithHeaderFooter';

export default function ActualWaitTimeInput() {
  const [actualMinutes, setActualMinutes] = useState('');
  const [lineType, setLineType] = useState('regular'); // new state for picker
  const [submitting, setSubmitting] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const route = useRoute();
  const navigation = useNavigation();
  const { airportCode = 'UNKNOWN', estimatedMinutes = null, deviceId = null } = route.params || {};
  const { t, i18n } = useTranslation();

  const handleSubmit = async () => {
    if (!actualMinutes || isNaN(actualMinutes)) {
      Alert.alert(t('input.invalidTitle'), t('input.invalidMessage'));
      return;
    }

    setSubmitting(true);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await submitWaitTime(
        airportCode,
        parseInt(actualMinutes),
        estimatedMinutes,
        i18n.language,
        deviceId,
        lineType // include selected line type
      );
<<<<<<< HEAD
      navigation.navigate('ThankYouScreen');
=======
      navigation.navigate('ThankYou');
>>>>>>> 694cb3ef9322a5a6dfc6a290f12298295a3edd6f
    } catch (error) {
      console.error(error);
      Alert.alert(t('error.title'), t('error.message'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/security-background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScreenWithHeaderFooter navigation={navigation}>
        <KeyboardAvoidingView
          style={styles.keyboardWrapper}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.centerWrapper}>
            <View style={styles.overlay}>
              <Text style={styles.title}>{t('input.title')}</Text>
              <Text style={styles.label}>{t('input.label')}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={actualMinutes}
                onChangeText={setActualMinutes}
                placeholder="e.g. 25"
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.label}>{t('input.lineTypeLabel') || 'Line Type'}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={lineType}
                  onValueChange={(itemValue) => setLineType(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Regular TSA Line" value="regular" />
<<<<<<< HEAD
                  <Picker.Item label="TSA Pre✓" value="precheck" />
=======
                  <Picker.Item label="TSA PreCheck" value="precheck" />
>>>>>>> 694cb3ef9322a5a6dfc6a290f12298295a3edd6f
                  <Picker.Item label="CLEAR" value="clear" />
                </Picker>
              </View>

              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
                  <Text style={styles.buttonText}>{t('input.button')}</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScreenWithHeaderFooter>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  keyboardWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(243, 244, 246, 0.65)',
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 26,
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 20,
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    fontFamily: 'Inter_18pt',
    fontSize: 18,
    backgroundColor: 'white',
    borderColor: '#1e40af',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#111827',
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: '#1e40af',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 24,
  },
  picker: {
    height: 48,
    width: '100%',
    color: '#111827',
  },
  button: {
    backgroundColor: '#1e40af',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
  },
});
