import {UserNotificationTypes} from '../actions/UserNotificationActions';
export interface UserNotificationReducerState {
  postStatus: {
    loading: boolean;
    error: boolean;
    message: string;
  };
  notifs: Array<any>;
  notifLoadMoreAvailable: boolean;
  notifLoadMoreIsLoading: boolean;
}
const initialstate: UserNotificationReducerState = {
  postStatus: {
    loading: false,
    error: false,
    message: '',
  },
  notifLoadMoreAvailable: true,
  notifLoadMoreIsLoading: false,
  notifs: [],
};

export const UserNotificationReducer = (
  state = initialstate,
  action: any,
): UserNotificationReducerState => {
  switch (action.type) {
    case UserNotificationTypes.SERVER_STATUS:
      return {
        ...state,
        postStatus: action.payload.status,
        notifLoadMoreIsLoading: action.payload.atEnd
          ? action.payload.status
          : false,
      };
    case UserNotificationTypes.USER_NOTIFICATIONS_RECIEVED:
      return {
        ...state,
        postStatus: initialstate.postStatus,
        notifLoadMoreAvailable: action.payload.isAvailable,
        notifs: action.payload.atEnd
          ? [...state.notifs, ...action.payload.data]
          : action.payload.data,
        notifLoadMoreIsLoading: false,
      };
    default:
      return state;
  }
};
