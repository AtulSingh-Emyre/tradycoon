import {clientManagementErrors} from '../../error/ClientManagement/ClientManagementErrors';
import {UserGroupActions} from '../../redux/actions/user-groups/UserGroupActions';
import {AsyncStorageService} from '../AsyncStorage';
import {UserGroupApi} from './UserGroupApi';

export class UserGroupRepositry {
  static async getGroupDetails() {
    return async (dispatch: any) => {
      try {
        // getting the user group details
        dispatch(UserGroupActions.InitializeGroupStatusAction(false, true, ''));
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        const id = await AsyncStorageService.getUser().then(user => {
          return user.user.id;
        });
        const response = await UserGroupApi.ClientGroupDetails(id, token);
        dispatch(UserGroupActions.InitializeGroupListAction(response));
      } catch (error: any) {
        dispatch(
          UserGroupActions.InitializeGroupStatusAction(
            true,
            false,
            error.message.toString(),
          ),
        );
      }
    };
  }

  static async getClientDetails(groupId: string, skip: number, atEnd: boolean) {
    return async (dispatch: any) => {
      try {
        if (!groupId || groupId == undefined) return;
        // getting the user group details
        await dispatch(
          UserGroupActions.GetUserGroupClientDataRequestStatusAction(
            false,
            true,
            '',
            atEnd,
          ),
        );

        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        const response = await UserGroupApi.ClientGroupUserDetails(
          groupId,
          token,
          skip,
        );
        await dispatch(
          await UserGroupActions.GetUserGroupClientDataResponseAction(
            response,
            atEnd,
          ),
        );
      } catch (error: any) {
        dispatch(
          UserGroupActions.GetUserGroupClientDataRequestStatusAction(
            true,
            false,
            'something went wrong, please reload the page',
            atEnd,
          ),
        );
      }
    };
  }

  static async addNewGroup(data: string) {
    return async (dispatch: any) => {
      try {
        dispatch(
          UserGroupActions.ServerRequestFailedAction({
            error: false,
            loading: true,
            message: '',
            status: 200,
          }),
        );
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        const id = await AsyncStorageService.getUser().then(user => {
          return user.user.id;
        });
        const newGroupData = await UserGroupApi.addClientGroup(
          data,
          await id,
          await token,
        );
        if (!newGroupData)
          throw new Error(
            'The group name already exists, please try adding with a different name',
          );
        await dispatch(UserGroupActions.UserAddGroupAction(newGroupData));
        return {error: false};
      } catch (error: any) {
        await dispatch(
          UserGroupActions.ServerRequestFailedAction({
            error: true,
            loading: false,
            status: 400,
            message: error.message,
          }),
        );
        return {error: true, message: error.message.toString()};
      }
    };
  }

  static async addNewClient(query: string, groupId: string, date: Date) {
    return async (dispatch: any) => {
      try {
        dispatch(
          UserGroupActions.ServerRequestFailedAction({
            error: false,
            loading: true,
            message: '',
            status: 200,
          }),
        );
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        const queryObj = {
          phone: '',
          email: '',
          validTill: date,
          groupId,
        };
        if (/^\d+$/.test(query)) {
          queryObj.phone = query;
        } else {
          queryObj.email = query;
        }
        const response: any = await UserGroupApi.addClientToGroup(
          queryObj,
          await token,
        );
        const reqObj = {
          _id: response.clientUserLists._id,
          created_at: response.clientUserLists.created_at,
          group_id: response.clientUserLists.group_id,
          user_id: {
            _id: response.user._id,
            avatar: response.user.avatar,
            name: response.user.name,
            phone: response.user.phone,
            work_mail: response.user.work_mail,
          },
          valid_at: response.clientUserLists.valid_at,
        };
        dispatch(UserGroupActions.UserAddGroupUserAction(reqObj));
        return {error: false};
      } catch (error: any) {
        dispatch(
          UserGroupActions.ServerRequestFailedAction({
            error: true,
            loading: false,
            status: 400,
            message: error.message.toString(),
          }),
        );
        return {error: true, message: error.message.toString()};
      }
    };
  }

  static async editClient(clientId: string, update: any, groupId: string) {
    return async (dispatch: any) => {
      try {
        dispatch(
          UserGroupActions.ServerRequestFailedAction({
            error: false,
            loading: true,
            message: '',
            status: 200,
          }),
        );
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });

        await UserGroupApi.editClient(groupId, clientId, update, token);
        await dispatch(
          UserGroupActions.UserUpdateClientDetailsAction(update, clientId),
        );
        return {error: false};
      } catch (error: any) {
        await UserGroupActions.ServerRequestFailedAction({
          error: true,
          loading: false,
          status: 200,
          message: clientManagementErrors.SERVER_ERROR,
        });
        return {error: true, message: error.message.toString()};
      }
    };
  }

  static async removeClient(clientId: string) {
    return async (dispatch: any) => {
      try {
        dispatch(
          UserGroupActions.ServerRequestFailedAction({
            error: false,
            loading: true,
            message: '',
            status: 200,
          }),
        );
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        const resp = await UserGroupApi.removeClient(clientId, token);
        await dispatch(UserGroupActions.UserRemoveGroupUser(clientId));
        return {error: false};
      } catch (error: any) {
        UserGroupActions.ServerRequestFailedAction({
          error: true,
          loading: false,
          status: 200,
          message: error,
        });
        return {error: true, message: error.message.toString()};
      }
    };
  }

  static async updateGroupName(new_name: string, groupId: string) {
    return async (dispatch: any) => {
      try {
        dispatch(
          UserGroupActions.ServerRequestFailedAction({
            error: false,
            loading: true,
            message: '',
            status: 200,
          }),
        );
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        await UserGroupApi.renameGroup(groupId, new_name, await token);
        await dispatch(
          UserGroupActions.UserRenameGroupAction(new_name, groupId),
        );
        return {error: false};
      } catch (error: any) {
        dispatch(
          UserGroupActions.ServerRequestFailedAction({
            error: true,
            loading: false,
            status: 500,
            message: error,
          }),
        );
        return {error: true, message: error.message.toString()};
      }
    };
  }

  static async deleteGroup(groupId: string) {
    return async (dispatch: any) => {
      try {
        dispatch(
          UserGroupActions.ServerRequestFailedAction({
            error: false,
            loading: true,
            message: '',
            status: 200,
          }),
        );
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        await UserGroupApi.deleteGroup(groupId, await token);
        await dispatch(UserGroupActions.UserRemoveGroupAction(groupId));
        return {error: false};
      } catch (error: any) {
        dispatch(
          UserGroupActions.ServerRequestFailedAction({
            error: true,
            loading: false,
            status: 500,
            message: clientManagementErrors.SERVER_ERROR,
          }),
        );
        return {error: true, message: error.message.toString()};
      }
    };
  }
}
