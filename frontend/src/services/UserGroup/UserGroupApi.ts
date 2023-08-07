import {getEnvVariable} from '../../environment';
import {Http} from '../http';

export class UserGroupApi {
  // @User Group API
  static async ClientGroupDetails(userId: string, token: string) {
      return await Http.post(
        getEnvVariable().auth_url +
          'client-group-management/analyst/client-groups',
        {
          userId: userId,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => res.data);
  }
  static async ClientGroupUserDetails(
    groupId: string,
    token: string,
    skip: number,
  ) {
      return await Http.post(
        getEnvVariable().auth_url +
          'client-group-management/analyst/client-group-user-details',
        {
          groupId: groupId,
          skip: skip,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => res.data);
  
  }
  static async addClientGroup(groupName: string, id: string, token: string) {
      return await Http.post(
        getEnvVariable().auth_url + 'client-group-management/analyst/add-group',
        {
          userId: id,
          groupName: groupName,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => res.data);
  }
  static async addClientToGroup(
    data: {
      phone: string;
      email: string;
      groupId: string;
      validTill: Date;
    },
    token: string,
  ) {
      return await Http.post(
        getEnvVariable().auth_url +
          'client-group-management/analyst/add-user-to-group',
        data,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res =>res.data);
    
  }

  static async editClient(
    groupId: string,
    Id: string,
    update: any,
    token: string,
  ) {
      return await Http.post(
        getEnvVariable().auth_url +
          'client-group-management//analyst/group/update-client',
        {
          groupId,
          userId: Id,
          updatedUserDetails: update, //pass object
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => res.data);
  }

  static async renameGroup(id: string, groupName: string, token: string) {
      return await Http.put(
        getEnvVariable().auth_url +
          'client-group-management/analyst/group-rename',
        {
          id,
          groupName,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => res.data);
  }
  static async removeClient(Id: string, token: string) {
      return await Http.put(
        getEnvVariable().auth_url +
          'client-group-management/analyst/group/remove-user',
        {
          Id,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => res.data);
  }
  static async deleteGroup(Id: string, token: string) {
      return await Http.put(
        getEnvVariable().auth_url +
          'client-group-management/analyst/remove-group',
        {
          Id,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => res.data);
  }
}
