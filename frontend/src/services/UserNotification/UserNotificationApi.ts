import {getEnvVariable} from '../../environment';
import {Http} from '../http';

export class UserNotificationApi {
  // @Global Chat Api
  static async getUserNotifications(
    skip: number,
    limit: number,
    userId: string,
    token: string,
  ) {
    try {
      return Http.post(
        getEnvVariable().auth_url + 'user-notif/user/notifs',
        {skip, limit, userId},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => {
        return res.data;
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
