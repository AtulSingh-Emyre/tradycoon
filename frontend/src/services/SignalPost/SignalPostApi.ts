/* eslint-disable @typescript-eslint/no-floating-promises */
import {getEnvVariable} from '../../environment';
import {Http} from '../http';

export class AnalystBuySellPostApi {
  // @Analyst Signal Buy Sell Api
  static async savePost(data: any, token: string) {
    
      return Http.post(
        getEnvVariable().auth_url + 'analyst/post/post',
        {post: data},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => {
        return res.data;
      });

  }
  static async patchPost(postId: string, postUpdates: any, token: string) {
      return Http.patch(
        getEnvVariable().auth_url + 'analyst/post/' + postId,
        {updates: postUpdates},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => {
        return res.data;
      });

  }
  static async deletePost(data: any, token: string) {
    
      return Http.post(
        getEnvVariable().auth_url + 'analyst/post/delete/',
        {
          postId: data,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => {
        return res.data;
      });

  }

  static async archivePost(
    postId: any,
    userId: any,
    archive: boolean,
    token: string,
  ) {
    
      return Http.post(
        getEnvVariable().auth_url + 'user-management/user/signal/archive',
        {postId, userId, archive},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => {
        return res.data;
      });

  }

  static async getPostByType(
    user: {
      isUser?: boolean;
      id?: string;
      userId?: string;
    },
    options: {skip: number; limit: number; archives?: boolean},
    time: {
      isAll?: boolean;
      isIntraday?: boolean;
      isInterday?: boolean;
      isActive?: boolean;
      isNotActive?: boolean;
    },
    token: string,
  ) {
      return await Http.post(
        getEnvVariable().auth_url + 'analyst/post/query',
        {
          user,
          options,
          time,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => res.data);
  }

  static async getAnalystProfilePost(
    user: {
      isUser?: boolean;
      id?: string;
      userId?: string;
    },
    options: {skip: number; limit: number; archives?: boolean},
    time: {
      isAll?: boolean;
      isIntraday?: boolean;
      isInterday?: boolean;
      isActive?: boolean;
      isNotActive?: boolean;
    },
    token: string,
  ) {
    
      return await Http.post(
        getEnvVariable().auth_url + 'analyst/post/query/profile',
        {
          user,
          options,
          time,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => res.data);
    
  }

  static async likePost(id: string, token: string, postId: string,like:boolean) {
    
      return await Http.post(
        getEnvVariable().auth_url + 'analyst/post/like',
        {postId, userId: id, like},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => res.data);
  }
}
