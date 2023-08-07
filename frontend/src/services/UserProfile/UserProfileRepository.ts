import {FollowerActions} from '../../redux/actions/TertiaryUserDetails/FollowerActions';
import {AuthOtpActions} from '../../redux/actions/auth-actions/AuthOtpAction';
import {UserActions} from '../../redux/actions/UserAction';
import {UserProfileViewActions} from '../../redux/actions/UserProfileViewActions';
import {AsyncStorageService} from '../AsyncStorage';
import {UserProfileApi} from './UserProfileApi';
import {UserReportActions} from '../../redux/actions/TertiaryUserDetails/AnalystReportActions';
import {Http} from '../http';
import {IDeviceInfo} from '../../models/user/UserAuth';

export class UserProfileRepository {
  static async getUserProfileById(id: string) {
    return async (dispatch: any) => {
      try {
        dispatch(UserProfileViewActions.UserProfileViewRequestAction());
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        const response = await UserProfileApi.getUser(id, token);
        dispatch(
          UserProfileViewActions.UserProfileViewSuccessAction(response, id),
        );
      } catch (error: any) {
        dispatch(
          UserProfileViewActions.UserProfileViewErrorAction(
            true,
            false,
            500,
            error,
          ),
        );
      }
    };
  }
  static async dismiss() {
    return async (dispatch: any) => {
      try {
        dispatch(
          UserActions.UserProfileUpdateErrorAction(false, false, 200, ''),
        );
        dispatch(AuthOtpActions.OtpFailedToLoad(200, '', false));
      } catch (error: any) {}
    };
  }
  static async getUserClientGroupDetails(id: string) {
    return async (dispatch: any) => {
      try {
        const token = await AsyncStorageService.getUser().then(user => {
          return {token: user.token, id: user.user.id};
        });
        const response = await UserProfileApi.getClientGroups(id, token.token);
        dispatch(
          await UserProfileViewActions.UserProfileViewClientGroupDataResponseAction(
            response,
          ),
        );
        return {success: true};
      } catch (error: any) {
        return {success: false, error};
      }
    };
  }
  static async updateUserDetails(updateDetails: any, id: string) {
    return async (dispatch: any) => {
      try {
        dispatch(UserActions.UserProfileUpdateRequestAction());
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        const response = await UserProfileApi.updateUser(
          updateDetails,
          id,
          await token,
        );

        await dispatch(UserActions.UserDetailsUpdateAction(updateDetails));
        await dispatch(
          UserProfileViewActions.UserProfileViewUpdateAction(updateDetails),
        );
      } catch (error: any) {
        await dispatch(
          UserActions.UserProfileUpdateErrorAction(true, false, 500, error),
        );
      }
    };
  }
  // Report data :
  static async analystReportData(userId: string) {
    return async (dispatch: any) => {
      try {
        await dispatch(UserReportActions.getAnalystReportRequestAction());
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        const response = await UserProfileApi.analystSignalReport(
          userId,
          token,
        );
        const result = await dispatch(
          UserReportActions.getAnalystReportDataAction(response),
        );
      } catch (error: any) {
        await dispatch(
          UserReportActions.analystReportStatusAction({
            error: true,
            loading: false,
            message: error,
          }),
        );
      }
    };
  }
  // CRUD Followers
  static async addFollower(followerId: string, followerNum:number, addFollower: boolean) {
    return async (dispatch: any) => {
      try {
        const dets = await AsyncStorageService.getUser().then(user => {
          return {token: user.token, id: user.user.id};
        });
        const response = await UserProfileApi.addFollower(
          dets.id,
          followerId,
          addFollower,
          dets.token,
        );
        const res = addFollower ? followerNum + 1 :followerNum -1;
        dispatch(
          UserActions.UserFollowerCountUpdateAction(addFollower? 1:-1),
        );
        dispatch(UserProfileViewActions.UserProfileViewFollowingupdateAction(res));
        return {success: true};
      } catch (error: any) {
        return {success: false, error};
      }
    };
  }
  static async getFollowers(userid: string, skip: number, atEnd: boolean) {
    return async (dispatch: any) => {
      try {
        await dispatch(
          FollowerActions.getFollowerDataStatusAction(false, true, '', atEnd),
        );
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });

        const response: any[] = (
          (await UserProfileApi.getFollowers(userid, skip, token)) as any[]
        ).filter(item => item != null);
        await dispatch(
          FollowerActions.getFollowerDataStatusAction(false, false, '', atEnd),
        );
        if (response.length < 20 && atEnd)
          dispatch(FollowerActions.setFollowerLoadMoreAction(false));
        if (!atEnd) dispatch(FollowerActions.getFollowerDataAction(response));
        else dispatch(FollowerActions.getFollowerDataUpdateAction(response));
      } catch (error: any) {
        await dispatch(
          FollowerActions.getFollowerDataStatusAction(false, false, '', atEnd),
        );
        Http.handleErrors({});
      }
    };
  }
  static async getFollowing(userid: string, skip: number, atEnd: boolean) {
    return async (dispatch: any) => {
      try {
        await dispatch(
          FollowerActions.getFollowingDataStatusAction(false, true, '', atEnd),
        );
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        const response = (
          (await UserProfileApi.getFollowing(userid, skip, token)) as any[]
        ).filter(item => item != null);
        await dispatch(
          FollowerActions.getFollowingDataStatusAction(false, false, '', atEnd),
        );
        if (!atEnd) dispatch(FollowerActions.getFollowingDataAction(response));
        else dispatch(FollowerActions.getFollowingDataUpdateAction(response));
      } catch (error: any) {
        await dispatch(
          FollowerActions.getFollowingDataStatusAction(false, false, '', atEnd),
        );
        Http.handleErrors({});
      }
    };
  }

  static async getLeaderboard(skip: number, atEnd: boolean) {
    return async (dispatch: any) => {
      try {
        await dispatch(
          UserProfileViewActions.AnalystLeaderboardRequestAction(atEnd),
        );
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        const response = (
          (await UserProfileApi.getLeaderboard(skip, token)) as any[]
        ).filter(item => item != null);

        if (!atEnd)
          await dispatch(
            UserProfileViewActions.AnalystLeaderboardSuccessAction(response),
          );
        else
          await dispatch(
            UserProfileViewActions.AnalystLeaderboardUpdateSuccessAction(
              response,
            ),
          );
      } catch (error: any) {
        await dispatch(
          UserProfileViewActions.AnalystLeaderboardRequestStatus({
            error: true,
            message: error,
            loading: false,
          }),
        );
        Http.handleErrors({});
      }
    };
  }

  static async saveDeviceToken(data: IDeviceInfo) {
    try {
      const token = await AsyncStorageService.getUser().then(user => {
        return user.token;
      });
      const deviceToken = await UserProfileApi.saveDeviceInfo(
        data.user_id,
        data.deviceToken,
        token,
      );

      // return deviceToken;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
