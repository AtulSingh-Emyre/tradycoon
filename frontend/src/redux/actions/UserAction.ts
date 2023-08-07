//@Global related state

export enum UserActionTypes {
  LOGIN_REQUEST_SUCCESS = 'Login Request Success',
  USER_LOGOUT = 'User Logout',
  USER_PROFILE_UPDATE_REQUEST = 'user profile update request',
  USER_FOLLOWER_COUNT_UPDATE = 'user follower count update action',
  USER_FOLLOWING_COUNT_UPDATE = 'user following count update action',
  USER_PROFILE_ERROR = 'profile changes did not save',
  USER_PROFILE_UPDATE_RESPONSE = 'user profile update success',
  USER_PROFILE_ADD_FOLLOWER = 'added a follower',
  FOLLOWER__COUNT_INITIALIZATION = 'initialization of follower count',
  FOLLOWING__COUNT_INITIALIZATION = 'initialization of following count'

}

export class UserActions {
  static LoginRequestSuccessAction = (user: any) => ({
    type: UserActionTypes.LOGIN_REQUEST_SUCCESS,
    payload: user,
  });
  static UserLogoutAction = () => ({
    type: UserActionTypes.USER_LOGOUT,
  });
  static UserFollowerCountUpdateAction = (num: number) => ({
    type: UserActionTypes.USER_FOLLOWER_COUNT_UPDATE,
    payload: num,
  });
  static UserFollowingCountUpdateAction = (num: number) => ({
    type: UserActionTypes.USER_FOLLOWING_COUNT_UPDATE,
    payload: num,
  })
  
  static UserFollowerCountInitializationAction = (num: number) => ({
    type: UserActionTypes.FOLLOWER__COUNT_INITIALIZATION,
    payload: num,
  })
  static UserFollowingCountInitializationAction = (num: number) => ({
    type: UserActionTypes.FOLLOWING__COUNT_INITIALIZATION,
    payload: num,
  })
  static UserDetailsUpdateAction = (user: any) => ({
    type: UserActionTypes.USER_PROFILE_UPDATE_RESPONSE,
    payload: user,
  });
  static UserDetailsAddFollower = (user: number) => ({
    type: UserActionTypes.USER_PROFILE_ADD_FOLLOWER,
    payload: user,
  });
  static UserProfileUpdateRequestAction = () => ({
    type: UserActionTypes.USER_PROFILE_UPDATE_REQUEST,
  });
  static UserProfileUpdateErrorAction = (
    error: boolean,
    loading: boolean,
    status: number,
    message: string,
  ) => ({
    type: UserActionTypes.USER_PROFILE_ERROR,
    payload: {
      error,
      loading,
      status,
      message,
    },
  });
}
