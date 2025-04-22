// utils/Notifications.js
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';

/**
 * Prompt the user for notification permissions only once.
 * Call this function after login.
 */
export async function requestNotificationPermissionOnce() {
  try {
    const alreadyAsked = await AsyncStorage.getItem('notificationPermissionAsked');
    if (alreadyAsked === 'true') return;

    const { status } = await Notifications.requestPermissionsAsync();

    if (status === 'granted') {
      await Notifications.getExpoPushTokenAsync(); // Optional: can store token if needed
    }

    await AsyncStorage.setItem('notificationPermissionAsked', 'true');
  } catch (error) {
    console.warn('Error requesting notification permission:', error);
  }
}

/**
 * Schedule a notification after estimatedMinutes.
 */
export async function scheduleWaitNotification(estimatedMinutes, params = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'How long did it actually take?',
      body: 'Tap to submit your real wait time.',
      sound: true,
      data: params,
    },
    trigger: {
      seconds: estimatedMinutes * 60,
      repeats: false,
    },
  });
}

/**
 * Developer test: schedules a test notification in 5 seconds.
 */
export async function scheduleFiveSecondDevNotification(params = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🧪 Dev Test Notification',
      body: 'Tap to submit your real wait time.',
      sound: true,
      data: params,
    },
    trigger: {
      seconds: 5,
      repeats: false,
    },
  });
}

/**
 * Send a surge alert notification immediately.
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 */
export async function sendSurgeNotification(title, body) {
  if (!Device.isDevice) {
    console.warn('⚠️ Notifications only work on a physical device.');
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // Send immediately
    });
  } catch (err) {
    console.error('🚨 Failed to send surge notification:', err);
  }
}
