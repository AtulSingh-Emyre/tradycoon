import {AsyncStorageService} from '../AsyncStorage';
import {Http} from '../http';

export class AdminRepository {
  static async postNotification(notif: any) {
    return async (dispatch: any) => {
      try {
        const token = await AsyncStorageService.getUser().then(async user => {
          return user.token;
        });
      } catch (error: any) {
        Http.handleErrors({});
      }
    };
  }
}
