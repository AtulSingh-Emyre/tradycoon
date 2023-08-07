import {AsyncStorageService} from '../../services/AsyncStorage';
import {initialUser} from '../../models/ReducerTypes/UserReducerTypes';
import {UserActionTypes} from '../actions/UserAction';

export interface UserReducerState {
  user: any | null;
  loggedIn: boolean;
  followerCount: number;
  followingCount: number;
  firstTimeLogin: boolean;
  updationStatus: {
    error: boolean;
    loading: boolean;
    status: number;
    message: string;
  };
}

const userIAsync = AsyncStorageService.getUser();

const initialState: UserReducerState = {
  user:
    userIAsync != null ? {parsedData: userIAsync, success: true} : initialUser,
  loggedIn: false,
  firstTimeLogin: false,
  updationStatus: {error: false, loading: false, message: '', status: 200},
  followerCount: 0,
  followingCount: 0,
};

export const UserReducer = (
  state = initialState,
  action: any,
): UserReducerState => {
  switch (action.type) {
    case UserActionTypes.LOGIN_REQUEST_SUCCESS: {
      return {...state, user: action.payload, loggedIn: true};
    }
    case UserActionTypes.USER_LOGOUT: {
      return {...initialState};
    }
    case UserActionTypes.USER_FOLLOWER_COUNT_UPDATE: {
      return {...state, followerCount: state.followerCount + action.payload};
    }
    case UserActionTypes.USER_FOLLOWING_COUNT_UPDATE: {
      return {...state, followingCount: state.followingCount + action.payload};
    }

    case UserActionTypes.FOLLOWER__COUNT_INITIALIZATION: {
      return {...state, followerCount: action.payload};
    }
    case UserActionTypes.FOLLOWING__COUNT_INITIALIZATION: {
      return {...state, followingCount: action.payload};
    }
    case UserActionTypes.USER_PROFILE_UPDATE_RESPONSE: {
      state = {
        ...state,
        user: {
          ...state.user,
          parsedData: {
            ...state.user.parsedData,
            user: {
              ...state.user.parsedData.user,
              ...action.payload,
            },
          },
        },
        updationStatus: {
          error: false,
          loading: false,
          message: '',
          status: 200,
        },
      };
      return {
        ...state,
      };
    }
    case UserActionTypes.USER_PROFILE_ADD_FOLLOWER: {
      state = {
        ...state,
        user: {
          ...state.user,
          parsedData: {
            user: {
              ...state.user.parsedData.user,
              Total_followers:
                state.user.parsedData.user.Total_followers +
                parseInt(action.payload),
            },
          },
        },
        updationStatus: {
          error: false,
          loading: false,
          message: '',
          status: 200,
        },
      };
      return {
        ...state,
      };
    }
    case UserActionTypes.USER_PROFILE_UPDATE_REQUEST: {
      return {
        ...state,
        updationStatus: {
          ...state.updationStatus,
          loading: !state.updationStatus.loading,
        },
      };
    }
    case UserActionTypes.USER_PROFILE_ERROR: {
      return {...state, updationStatus: action.payload};
    }

    default: {
      return state;
    }
  }
};
