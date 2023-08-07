import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {AsyncStorageService} from './AsyncStorage';
import {UserProfileRepository} from './UserProfile/UserProfileRepository';

export const checkNotifactionPermisson = async () => {
  const enabled = await messaging().hasPermission();
  if (enabled) {
    const result = await getToken();
  } else {
    requestUserPermission();
  }
};

const getToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (fcmToken == null) {
    fcmToken = await messaging().getToken();
    if (fcmToken) {
      const userId = await AsyncStorageService.getUser();
      if (userId) {
        UserProfileRepository.saveDeviceToken({
          user_id: userId.user.id,
          deviceToken: fcmToken,
        });
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }
  return fcmToken;
};

// For IOS only
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
  }
};
