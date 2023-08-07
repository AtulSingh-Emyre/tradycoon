import AsyncStorage from '@react-native-async-storage/async-storage';
export class AsyncStorageService {
  private static readonly USER = 'user';
  private static readonly DARK_THEME = 'theme';

  static setUser(data: object | null) {
    return AsyncStorage.setItem(AsyncStorageService.USER, JSON.stringify(data));
  }

  static setDarkTheme(data: any | null) {
    return AsyncStorage.setItem(
      AsyncStorageService.DARK_THEME,
      JSON.stringify(data),
    );
  }

  static async checkIfDarkTheme() {
    try {
      const response: any = await AsyncStorage.getItem(
        AsyncStorageService.DARK_THEME,
      );
      return JSON.parse(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async getUser() {
    try {
      const response: any = await AsyncStorage.getItem(
        AsyncStorageService.USER,
      );
      return JSON.parse(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  static async clearAppData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
    } catch (error:any) {
      console.error('Error clearing app data.');
    }
  }
}
