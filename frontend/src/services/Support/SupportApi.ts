import {getEnvVariable} from '../../environment';
import {Http} from '../http';

export class SupportApi {
  // @Global Chat Api
  static async postQuery(userId: string, mssg: string, token: string) {
      return Http.post(
        getEnvVariable().auth_url + 'user-management/user/support',
        {userId, mssg},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => {
        return res.data;
      });
  }
}
