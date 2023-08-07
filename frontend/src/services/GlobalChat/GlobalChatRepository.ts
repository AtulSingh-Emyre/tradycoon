import {GlobalChatActions} from '../../redux/actions/GlobalChatActions';
import {AsyncStorageService} from '../AsyncStorage';
import {GlobalChatApi} from './GlobalChatApi';
export class GlobalChatRepository {
  static async postChat(
    user: {id: string; name: string; avatar: string},
    message: string,
  ) {
    return async (dispatch: any) => {
      try {
        dispatch(GlobalChatActions.chatPostStatusAction(false, true, ''));
        const token = await AsyncStorageService.getUser().then(async user => {
          return user.token;
        });
        const response = await GlobalChatApi.postChat(user, message, token);
        dispatch(GlobalChatActions.chatPostStatusAction(false, false, ''));
      } catch (error) {
        dispatch(
          GlobalChatActions.chatPostStatusAction(
            true,
            false,
            'message failed to deliver',
          ),
        );
      }
    };
  }
  static async getChat(skip: number, limit: number) {
    return async (dispatch: any) => {
      try {
        dispatch(
          GlobalChatActions.chatStatusAction({
            error: false,
            loading: true,
            message: '',
          }),
        );
        const token = await AsyncStorageService.getUser().then(async user => {
          return user.token;
        });
        const response = await GlobalChatApi.getChat(skip, limit, token);
        dispatch(GlobalChatActions.chatResponseAction(response));
        dispatch(
          GlobalChatActions.chatStatusAction({
            error: false,
            loading: false,
            message: '',
          }),
        );
      } catch (error) {
        dispatch(
          GlobalChatActions.chatStatusAction({
            error: true,
            loading: false,
            message: 'messages failed to load',
          }),
        );
      }
    };
  }
  static async recievedChat(mssg: any) {
    return async (dispatch: any) => {
      try {
        dispatch(GlobalChatActions.chatNewMessageAction(mssg));
      } catch (err) {
        dispatch(
          GlobalChatActions.chatStatusAction({
            error: true,
            loading: false,
            message: 'messages failed to load',
          }),
        );
      }
    };
  }
}
