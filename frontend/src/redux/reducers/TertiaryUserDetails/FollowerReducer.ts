import {FollowerActionTypes} from '../../actions/TertiaryUserDetails/FollowerActions';
export interface FollowerReducerState {
  followers: any;
  following: any;
  updateFollowerStatus: {
    loading: boolean;
    error: boolean;
    message: string;
  };
  getFollowerLoadMoreIsLoading: boolean;
  getFollowerStatus: {
    loading: boolean;
    error: boolean;
    message: string;
  };
  getFollowingLoadMoreIsLoading: boolean;
  getFollowingStatus: {
    loading: boolean;
    error: boolean;
    message: string;
  };
  followerUser: any;
  followerLoadMore: boolean;
  followingLoadMore: boolean;
  followingUser: any;
}
const initialstate: FollowerReducerState = {
  followers: [],
  following: [],
  updateFollowerStatus: {
    loading: false,
    error: false,
    message: '',
  },
  getFollowerLoadMoreIsLoading: false,
  getFollowingLoadMoreIsLoading: false,
  getFollowerStatus: {
    loading: false,
    error: false,
    message: '',
  },
  getFollowingStatus: {
    loading: false,
    error: false,
    message: '',
  },
  followerUser: [],
  followingUser: [],
  followerLoadMore: true,
  followingLoadMore: true,
};

export const FollowerReducer = (
  state = initialstate,
  action: any,
): FollowerReducerState => {
  switch (action.type) {
    case FollowerActionTypes.ADD_FOLLOWER_UPDATE_RESPONSE:
      return {
        ...state,
        following: [...state.following, action.payload],
        updateFollowerStatus: {
          error: false,
          loading: false,
          message: '',
        },
      };
    case FollowerActionTypes.FOLLOWER_STATUS_ACTION: {
      return {
        ...state,
        getFollowerStatus: action.payload.status,
        getFollowerLoadMoreIsLoading: action.payload.atEnd
          ? action.payload.status.loading
          : state.getFollowerLoadMoreIsLoading,
      };
    }
    case FollowerActionTypes.FOLLOWING_STATUS_ACTION: {
      return {
        ...state,
        getFollowingStatus: action.payload.status,
        getFollowingLoadMoreIsLoading: action.payload.atEnd
          ? action.payload.status.loading
          : state.getFollowingLoadMoreIsLoading,
      };
    }
    case FollowerActionTypes.REMOVE_FOLLOWER_UPDATE_RESPONSE:
      return {
        ...state,
        following: [...state.following.splice(action.payload, 1)],
        updateFollowerStatus: {
          error: false,
          loading: false,
          message: '',
        },
      };

    case FollowerActionTypes.FOLLOWER_UPDATE_ERROR:
      return {
        ...state,
        updateFollowerStatus: action.payload,
        getFollowerLoadMoreIsLoading: false,
      };
    case FollowerActionTypes.FOLLOWER_UPDATE_REQUEST:
      return {
        ...state,
        updateFollowerStatus: {error: false, loading: true, message: ''},
        getFollowerLoadMoreIsLoading: false,
      };
    case FollowerActionTypes.FOLLOWER_INITIALIZATION:
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    case FollowerActionTypes.FOLLOWER_USER_DATA:
      return {
        ...state,
        followerUser: action.payload,
        getFollowerLoadMoreIsLoading: false,
        
        followerLoadMore: true,
      };
    case FollowerActionTypes.FOLLOWER_LOAD_MORE_LOADING:
      return {
        ...state,
        followerLoadMore: action.payload
      }
    case FollowerActionTypes.FOLLOWER_USER_DATA_UPDATE:
      return {
        ...state,
        followerUser: [...state.followerUser, ...action.payload],
        followerLoadMore: action.payload.length == 0 ? false : true,
        getFollowerLoadMoreIsLoading: false,
      };
    case FollowerActionTypes.FOLLOWING_USER_DATA:
      return {
        ...state,
        followingUser: action.payload,
        getFollowerLoadMoreIsLoading: false,
        followingLoadMore: true
      };
    case FollowerActionTypes.FOLLOWING_USER_DATA_UPDATE:
      return {
        ...state,
        followingUser: [...state.followingUser, ...action.payload],
        followingLoadMore: action.payload.length == 0 ? false : true,
        getFollowerLoadMoreIsLoading: false,
      };
    default:
      return state;
  }
};
