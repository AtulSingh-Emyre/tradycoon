/* eslint-disable @typescript-eslint/no-unused-vars */

// import { SupportActions } from "../../redux/actions/SupportActions";
import {UserNotifications} from '../../redux/actions/UserNotificationActions';
import {AsyncStorageService} from '../AsyncStorage';
import {UserNotificationApi} from './UserNotificationApi';

/* eslint-disable @typescript-eslint/require-await */
export class UserNotificationRepository {
  static async getUserNotifications(
    atEnd: boolean,
    skip: number,
    limit: number,
    userId: string,
  ) {
    return async (dispatch: any) => {
      try {
        dispatch(
          UserNotifications.userNotificationStatusAction(
            false,
            true,
            '',
            atEnd,
          ),
        );
        const token = await AsyncStorageService.getUser().then(async user => {
          return user.token;
        });
        const response: Array<any> =
          await UserNotificationApi.getUserNotifications(
            skip,
            limit,
            userId,
            token,
          );
        dispatch(
          await UserNotifications.userNotificationResponseAction(
            response,
            false,
            atEnd,
          ),
        );
      } catch (error:any) {
        dispatch(
          UserNotifications.userNotificationStatusAction(
            true,
            false,
            'something went wrong please reload the page',
            false,
          ),
        );
      }
    };
  }
}
