import {getEnvVariable} from '../../environment';
import {Http} from '../http';

export class UserProfileApi {
  // @User based API
  // @AUTH needed
  static getUser(id: string, token: string) {
    return Http.get(
      getEnvVariable().base_api_url + 'user-management/user/' + id,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(res => res.data);
  }

  static updateUser(userData: any, id: string, token: string) {
    return Http.post(
      getEnvVariable().base_api_url + 'user-management/user/update',
      {userData, id},
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(res => res.data);
  }

  static getClientGroups(id: string, token: string) {
    return Http.get(
      getEnvVariable().base_api_url +
        'user-management/user/subscribeClientGroup/' +
        id,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(res => res.data);
  }

  static addFollower(
    userId: string,
    followerId: string,
    addfollower: boolean,
    token: string,
  ) {
    return Http.post(
      getEnvVariable().base_api_url + 'user-management/user/follower',
      {userId, followerId, addfollower},
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(res => res.data);
  }

  static getFollowers(id: string, skip: number, token: string) {
    return Http.get(
      getEnvVariable().base_api_url +
        'user-management/user/followers/' +
        id +
        '@' +
        skip,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(res => res.data);
  }

  static getFollowing(id: string, skip: number, token: string) {
    return Http.get(
      getEnvVariable().base_api_url +
        'user-management/user/following/' +
        id +
        '@' +
        skip,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(res => res.data);
  }
  static async getLeaderboard(skip: number, token: string) {
    return Http.get(
      getEnvVariable().base_api_url +
        'user-management/analyst/leaderboard/' +
        skip,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(res => res.data);
  }

  static saveDeviceInfo(userId: string, deviceToken: string, token: string) {
    return Http.post(
      getEnvVariable().base_api_url + 'user-management/user/savedeviceinfo',
      {userId, deviceToken},
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );
  }
  static analystSignalReport(userId: string, token: string, timeframe?: Date) {
    return Http.post(
      getEnvVariable().base_api_url +
        'user-management/user/report/signalReport',
      {userId, timeframe},
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
