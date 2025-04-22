// utils/Permissions.js
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

export async function requestPermissions() {
  const notification = await Notifications.requestPermissionsAsync();
  const location = await Location.requestForegroundPermissionsAsync();

  return {
    notificationsGranted: notification.status === 'granted',
    locationGranted: location.status === 'granted',
  };
}
