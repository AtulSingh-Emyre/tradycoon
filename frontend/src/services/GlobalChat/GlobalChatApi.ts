import {getEnvVariable} from '../../environment';
import {Http} from '../http';

export class GlobalChatApi {
  // @Global Chat Api
  static async postChat(user: any, mssg: string, token: string) {
    try {
      return Http.post(
        getEnvVariable().auth_url + 'global-chat/chat',
        {user, mssg},
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
  static async getChat(skip: number, limit: number, token: string) {
    try {
      return await Http.post(
        getEnvVariable().auth_url + 'global-chat/get/chat',
        {
          skip,
          limit,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => res.data);
    } catch (err) {
      Promise.reject(err);
    }
  }
}
