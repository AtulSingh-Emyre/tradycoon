import {getEnvVariable} from '../../environment';
import {ApiNameList} from '../../environment/api-name-list';
import {Http} from '../http';

export class AnalystWebinarApi {
  // @Authentication API
  static async getWebinarsByQuery(data: any, token: string) {
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
  static async postWebinarsByQuery(data: any, token: string) {
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
  static async editWebinarsByQuery(data: any, token: string) {
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
  static async deleteWebinarsByQuery(data: any, token: string) {
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
}
