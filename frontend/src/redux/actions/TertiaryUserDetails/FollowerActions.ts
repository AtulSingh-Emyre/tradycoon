//@Follower-Following related state
export enum FollowerActionTypes {
  ADD_FOLLOWER_UPDATE_RESPONSE = 'Follower profile add update request',
  
  REMOVE_FOLLOWER_UPDATE_RESPONSE = 'Follower profile remove update request',
  FOLLOWER_UPDATE_ERROR = 'profile changes did not save',
  FOLLOWER_UPDATE_REQUEST = 'Follower profile update success',
  FOLLOWER_STATUS_ACTION = 'follower request status action',
  FOLLOWING_STATUS_ACTION = 'following request status action',
  FOLLOWER_INITIALIZATION = 'Loading data',
  FOLLOWER_USER_DATA = 'follower user data retrieval',
  FOLLOWER_USER_DATA_UPDATE = 'more follower user data loaded',
  FOLLOWER_LOAD_MORE_LOADING = 'load more state of follower case',
  FOLLOWING_USER_DATA = 'following user data retrieval',
  FOLLOWING_USER_DATA_UPDATE = 'more following user data loaded',
}
export class FollowerActions {
  static FollowerInitializationAction = (followers: any, following: any) => ({
    type: FollowerActionTypes.FOLLOWER_INITIALIZATION,
    payload: {followers, following},
  });
  static AddFollowerRequestSuccessAction = (Follower: any) => ({
    type: FollowerActionTypes.ADD_FOLLOWER_UPDATE_RESPONSE,
    payload: Follower,
  });
  static setFollowerLoadMoreAction = (state: boolean) => ({
    type: FollowerActionTypes.FOLLOWER_LOAD_MORE_LOADING,
    payload: state,
  });
  static getFollowerDataAction = (followerData: any) => ({
    type: FollowerActionTypes.FOLLOWER_USER_DATA,

    payload: followerData,
  });

  static getFollowerDataUpdateAction = (followerData: any) => ({
    type: FollowerActionTypes.FOLLOWER_USER_DATA_UPDATE,
    payload: followerData,
  });

  static getFollowerDataStatusAction = (
    error: boolean,
    loading: boolean,
    message: '',
    atEnd: boolean,
  ) => ({
    type: FollowerActionTypes.FOLLOWER_STATUS_ACTION,
    payload: {status: {error, loading, message}, atEnd},
  });

  static getFollowingDataStatusAction = (
    error: boolean,
    loading: boolean,
    message: '',
    atEnd: boolean,
  ) => ({
    type: FollowerActionTypes.FOLLOWING_STATUS_ACTION,
    payload: {status: {error, loading, message}, atEnd},
  });
  static getFollowingDataAction = (followingData: any) => ({
    type: FollowerActionTypes.FOLLOWING_USER_DATA,
    payload: followingData,
  });
  static getFollowingDataUpdateAction = (followingData: any) => ({
    type: FollowerActionTypes.FOLLOWING_USER_DATA_UPDATE,
    payload: followingData,
  });
  static RemoveFollowerRequestSuccessAction = (Follower: any) => ({
    type: FollowerActionTypes.REMOVE_FOLLOWER_UPDATE_RESPONSE,
    payload: Follower,
  });
  static FollowerRequestAction = () => ({
    type: FollowerActionTypes.FOLLOWER_UPDATE_REQUEST,
  });
  static FollowerUpdateErrorAction = (
    error: boolean,
    loading: boolean,
    message: string,
  ) => ({
    type: FollowerActionTypes.FOLLOWER_UPDATE_ERROR,
    payload: {
      error,
      loading,
      message,
    },
  });
}
