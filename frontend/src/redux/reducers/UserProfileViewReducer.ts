import {
  DefaultProfileOject,
  IUser,
  IUserProfileItem,
} from '../../models/user/UserProfile';
import {UserProfileViewActionTypes} from '../actions/UserProfileViewActions';

export interface UserProfileViewReducerTypes {
  userData: IUserProfileItem;
  userId: string;
  ProfileViewStatus: {
    error: boolean;
    loading: boolean;
    status: number;
    message: string;
  };
  analystLeaderboardLoadMoreIsLoading: boolean;
  analystLeaderboard: IUser[];
  analystLeaderboardStatus: {
    error: boolean;
    loading: boolean;
    message: string;
  };
  analystLoadMore: boolean;
  clientGroups: Array<any>;
}
const initialState: UserProfileViewReducerTypes = {
  userData: DefaultProfileOject,
  userId: '',
  analystLeaderboardLoadMoreIsLoading: false,
  ProfileViewStatus: {
    error: false,
    loading: false,
    status: 200,
    message: '',
  },
  analystLeaderboard: [],
  analystLeaderboardStatus: {
    error: false,
    loading: false,
    message: '',
  },
  analystLoadMore: true,
  clientGroups: [],
};

export const UserProfileViewReducer = (
  state = initialState,
  action: any,
): UserProfileViewReducerTypes => {
  switch (action.type) {
    case UserProfileViewActionTypes.USER_PROFILE_REQUEST: {
      return {
        ...state,
        ProfileViewStatus: {
          ...state.ProfileViewStatus,
          loading: !state.ProfileViewStatus.loading,
        },
      };
    }
    case UserProfileViewActionTypes.USER_CLIENT_GROUP_DETAILS: {
      return {
        ...state,
        clientGroups: action.payload.data,
      };
    }
    case UserProfileViewActionTypes.USER_PROFILE_FOLLOWING_COUNT_UPDATE_ACTION: {
      return {
        ...state,
        userData: {
          ...state.userData,
          followersCount: action.payload,
        },
      };
    }
    case UserProfileViewActionTypes.USER_PROFILE_RESPONSE: {
      return {
        ...state,
        ProfileViewStatus: initialState.ProfileViewStatus,
        userData: action.payload.user,
        userId: action.payload.id,
      };
    }
    case UserProfileViewActionTypes.USER_PROFILE_SET_ID: {
      return {
        ...state,
        userId: action.payload.id,
      };
    }
    case UserProfileViewActionTypes.USER_PROFILE_VIEW_UPDATE_RESPONSE: {
      return {
        ...state,
        userData: {...state.userData, ...action.payload.updates},
        ProfileViewStatus: initialState.ProfileViewStatus,
      };
    }
    case UserProfileViewActionTypes.USER_PROFILE_ERROR: {
      return {...state, ProfileViewStatus: action.payload};
    }
    case UserProfileViewActionTypes.ANALYST_LEADERBOARD_REQUEST: {
      return {
        ...state,
        analystLeaderboardStatus: {
          ...state.analystLeaderboardStatus,
          loading: true,
        },
        analystLeaderboardLoadMoreIsLoading: action.payload ? true : false,
      };
    }
    case UserProfileViewActionTypes.ANALYST_LEADERBOARD_REQUEST_SUCCESS: {
      return {
        ...state,
        analystLeaderboard: action.payload,
        analystLeaderboardStatus: {
          ...state.analystLeaderboardStatus,
          loading: false,
        },
        analystLeaderboardLoadMoreIsLoading: false,
        analystLoadMore: true,
      };
    }
    case UserProfileViewActionTypes.ANALYST_LEADERBOARD_UPDATE_REQUEST_SUCCESS: {
      return {
        ...state,
        analystLeaderboard: [...state.analystLeaderboard, ...action.payload],
        analystLeaderboardStatus: {
          ...state.analystLeaderboardStatus,
          loading: false,
        },
        analystLeaderboardLoadMoreIsLoading: false,
        analystLoadMore: action.payload.length == 0 ? false : true,
      };
    }
    case UserProfileViewActionTypes.ANALYST_LEADERBOARD_REQUEST_STATUS: {
      return {
        ...state,
        analystLeaderboardStatus: action.payload,
        analystLeaderboardLoadMoreIsLoading: false,
      };
    }
    default: {
      return state;
    }
  }
};
