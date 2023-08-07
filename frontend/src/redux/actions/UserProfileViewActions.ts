//@Profile View related state
export enum UserProfileViewActionTypes {
  USER_PROFILE_REQUEST = 'user profile requested',
  USER_PROFILE_RESPONSE = 'user profile recieved',
  USER_PROFILE_SET_ID = 'user profile set Id',
  USER_PROFILE_VIEW_UPDATE_RESPONSE = 'user profile was updated',
  USER_PROFILE_ERROR = 'user profile failed to return',
  ANALYST_LEADERBOARD_REQUEST = 'Analyst leaderboard requested',
  ANALYST_LEADERBOARD_UPDATE_REQUEST_SUCCESS = 'Analyst leaderboard update request populated',
  ANALYST_LEADERBOARD_REQUEST_SUCCESS = 'Analyst leaderboard successfully retrieved',
  ANALYST_LEADERBOARD_REQUEST_STATUS = 'Analyst leaderboard request status',
  USER_CLIENT_GROUP_DETAILS = 'user client groups',
  USER_PROFILE_FOLLOWING_COUNT_UPDATE_ACTION = 'following count of selected user updated'
}

export class UserProfileViewActions {
  static UserProfileViewRequestAction = () => ({
    type: UserProfileViewActionTypes.USER_PROFILE_REQUEST,
  });
  static UserProfileViewSuccessAction = (user: any, id: string) => ({
    type: UserProfileViewActionTypes.USER_PROFILE_RESPONSE,
    payload: {id, user},
  });
  static UserProfileViewClientGroupDataResponseAction = (data: any) => ({
    type: UserProfileViewActionTypes.USER_CLIENT_GROUP_DETAILS,
    payload: {data},
  });
  static UserProfileViewFollowingupdateAction = (res: number) => ({
    type: UserProfileViewActionTypes.USER_PROFILE_FOLLOWING_COUNT_UPDATE_ACTION,
    payload: res
  });
  static UserProfileViewSetID = (id: string) => ({
    type: UserProfileViewActionTypes.USER_PROFILE_SET_ID,
    payload: {id},
  });
  static UserProfileViewUpdateAction = (updates: any) => ({
    type: UserProfileViewActionTypes.USER_PROFILE_VIEW_UPDATE_RESPONSE,
    payload: {updates},
  });
  static UserProfileViewErrorAction = (
    error: boolean,
    loading: boolean,
    status: number,
    message: string,
  ) => ({
    type: UserProfileViewActionTypes.USER_PROFILE_ERROR,
    payload: {
      error,
      loading,
      status,
      message,
    },
  });
  static AnalystLeaderboardRequestAction = (atEnd: boolean) => ({
    type: UserProfileViewActionTypes.ANALYST_LEADERBOARD_REQUEST,
    payload: atEnd,
  });
  static AnalystLeaderboardSuccessAction = (
    data: any[],
  ) => ({
    type: UserProfileViewActionTypes.ANALYST_LEADERBOARD_REQUEST_SUCCESS,
    payload: data,
  });
  static AnalystLeaderboardUpdateSuccessAction = (
    data: any[]
    ) => ({
    type: UserProfileViewActionTypes.ANALYST_LEADERBOARD_UPDATE_REQUEST_SUCCESS,
    payload: data,
  });
  static AnalystLeaderboardRequestStatus = (data: {
    error: boolean;
    loading: boolean;
    message: string;
  }) => ({
    type: UserProfileViewActionTypes.ANALYST_LEADERBOARD_REQUEST_STATUS,
    payload: data,
  });
}
