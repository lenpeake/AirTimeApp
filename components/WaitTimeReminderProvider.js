
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WaitTimeReminderContext = createContext();

export const WaitTimeReminderProvider = ({ children }) => {
  const [reminderData, setReminderData] = useState(null);
  const timerRef = useRef(null);
  const reminderTimeoutRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (!reminderData) return;

    const { startTime, estimatedMinutes } = reminderData;
    const elapsed = Date.now() - new Date(startTime).getTime();
    const delay = Math.max(0, estimatedMinutes * 60 * 1000 - elapsed);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      showPrompt();
    }, delay);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(reminderTimeoutRef.current);
    };
  }, [reminderData]);

  const showPrompt = () => {
    Alert.alert(
      'Are you through security?',
      'What was your actual wait time?',
      [
        {
          text: 'Ask in 5 minutes',
          onPress: () => {
            reminderTimeoutRef.current = setTimeout(() => {
              showPrompt();
            }, 5 * 60 * 1000);
          },
          style: 'cancel',
        },
        {
          text: 'Submit Time',
          onPress: () => {
            const { airportCode, estimatedMinutes, deviceId } = reminderData || {};
            navigation.navigate('ActualWaitTimeInput', {
              airportCode,
              estimatedMinutes,
              deviceId,
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const startReminder = ({ airportCode, estimatedMinutes, deviceId }) => {
    setReminderData({
      airportCode,
      estimatedMinutes,
      deviceId,
      startTime: new Date().toISOString(),
    });
  };

  return (
    <WaitTimeReminderContext.Provider value={{ startReminder }}>
      {children}
    </WaitTimeReminderContext.Provider>
  );
};

export const useWaitTimeReminder = () => useContext(WaitTimeReminderContext);
