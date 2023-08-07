import {getEnvVariable} from '../../environment';
import {ApiNameList} from '../../environment/api-name-list';
import {Http} from '../http';

export class AuthApi {
  // @Authentication API
  static async VerifyPhoneData(data: any, token: string) {
    return Http.post(
      getEnvVariable().base_api_url + ApiNameList.SEND_OTP_API,
      data,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(res => res.data);
  }
  static async verifyEmail(userMail: string, token: string) {
    return Http.post(
      getEnvVariable().base_api_url + ApiNameList.VERIFY_EMAIL_API,
      {userMail},
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(res => res.data);
  }
  static async login(data: any) {
    return Http.post(
      getEnvVariable().base_api_url + ApiNameList.LOGIN_API,
      data,
      {},
    ).then(res => res.data);
  }
  static async loginWithId(id: string, token: string) {
    return Http.post(
      getEnvVariable().base_api_url + ApiNameList.ALREADY_LOGIN_CHECK_API,
      {id, token},
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(res => res.data);
  }
}
