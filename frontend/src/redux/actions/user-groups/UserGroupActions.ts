export enum UserGroupActionTypes {
  INITIALIZE_GROUPS_RESPONSE = 'initialize existing groups from backend',
  INITIALIZE_GROUPS_REQUEST_STATUS = 'initializing existing group status',
  GET_USER_GROUP_CLIENT_LIST_RESPONSE = 'data of users registered under the current group',
  GET_USER_GROUP_CLIENT_LIST_REQUEST_STATUS = 'data of users registered under the current group server request status',
  ADD_GROUP = 'The group has been added successfully',
  RENAME_GROUP = 'The group has been renamed',
  REMOVE_GROUP = 'The group has been removed',
  ADD_USER_TO_GROUP = 'The user is added to the group',
  UPDATE_USER = 'user data updated',
  REMOVE_USER_FROM_GROUP = 'The user is removed from the group',
  SERVER_ERROR = 'server request failed',
}

export class UserGroupActions {
  static InitializeGroupListAction = (groups: any[]) => ({
    type: UserGroupActionTypes.INITIALIZE_GROUPS_RESPONSE,
    payload: {groups},
  });
  static InitializeGroupStatusAction = (
    error: boolean,
    loading: boolean,
    message: string,
  ) => ({
    type: UserGroupActionTypes.INITIALIZE_GROUPS_REQUEST_STATUS,
    payload: {error, loading, message},
  });
  static GetUserGroupClientDataResponseAction = (
    clients: any[],
    atEnd: boolean,
  ) => ({
    type: UserGroupActionTypes.GET_USER_GROUP_CLIENT_LIST_RESPONSE,
    payload: {clients, atEnd},
  });
  static GetUserGroupClientDataRequestStatusAction = (
    error: boolean,
    loading: boolean,
    message: string,
    atEnd: boolean,
  ) => ({
    type: UserGroupActionTypes.GET_USER_GROUP_CLIENT_LIST_REQUEST_STATUS,
    payload: {status: {error, loading, message}, atEnd},
  });
  static UserAddGroupAction = (groupData: any) => ({
    type: UserGroupActionTypes.ADD_GROUP,
    payload: {group: groupData},
  });
  static UserRenameGroupAction = (newGroupName: string, groupId: string) => ({
    type: UserGroupActionTypes.RENAME_GROUP,
    payload: {newGroupName, groupId},
  });
  static UserRemoveGroupAction = (groupId: string) => ({
    type: UserGroupActionTypes.REMOVE_GROUP,
    payload: {groupId},
  });
  static UserAddGroupUserAction = (user: any) => ({
    type: UserGroupActionTypes.ADD_USER_TO_GROUP,
    payload: {user},
  });

  static UserUpdateClientDetailsAction = (update: any, id: string) => ({
    type: UserGroupActionTypes.UPDATE_USER,
    payload: {update, id},
  });
  static UserRemoveGroupUser = (userId: string) => ({
    type: UserGroupActionTypes.REMOVE_USER_FROM_GROUP,
    payload: userId,
  });
  static ServerRequestFailedAction = (status: {
    error: boolean;
    loading: boolean;
    status: number;
    message: string;
  }) => ({
    type: UserGroupActionTypes.SERVER_ERROR,
    payload: {status},
  });
}
