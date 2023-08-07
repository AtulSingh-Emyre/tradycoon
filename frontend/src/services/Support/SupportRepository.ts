import {SupportActions} from '../../redux/actions/SupportActions';
import {AsyncStorageService} from '../AsyncStorage';
import {SupportApi} from './SupportApi';

export class SupportRepository {
  static async postQuery(userid: string, message: string) {
    return async (dispatch: any) => {
      try {
        dispatch(SupportActions.supportStatusAction(false, true, ''));
        const token = await AsyncStorageService.getUser().then(async user => {
          return user.token;
        });
        const response = await SupportApi.postQuery(userid, message, token);
        dispatch(
          await SupportActions.supportStatusAction(
            true,
            false,
            'Query submitted successfully. We shall contact you soon!',
          ),
        );
      } catch (error) {
        dispatch(
          SupportActions.supportStatusAction(
            true,
            false,
            'Query failed to deliver, please check your internet and try again!',
          ),
        );
      }
    };
  }
}
