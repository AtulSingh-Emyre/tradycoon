import {AsyncStorageService} from '../AsyncStorage';
import {AnalystBuySellPostApi} from './SignalPostApi';
import {Http} from '../http';
import {AnalystPostBuySellActions} from '../../redux/actions/AnalystPostBuySellAction';
import {SignalViewActions} from '../../redux/actions/SignalViewActions';
import {SignalPostError} from '../../error/SignalPosts/SignalPostError';
import {ArchiveActions} from '../../redux/actions/TertiaryUserDetails/ArchiveActions';
export class AnalystBuySellRepositry {
  // CRUD of signal post:
  static async saveNewPost(data: any, name: string) {
    return async (dispatch: any) => {
      try {
        dispatch(AnalystPostBuySellActions.PostRequestAction());
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        const userData = await AsyncStorageService.getUser().then(user => {
          return user.user;
        });
        if (userData.name === '') {
          throw SignalPostError.PROFILE_NOT_COMPLETE;
        } else {
          const response = await AnalystBuySellPostApi.savePost(
            {
              ...data,
              analyst: userData.id,
              // created_by: userData.name,
            },
            await token,
          );
          const initialData = {
            analystName: name,
            isLike: false,
            isArchives: false,
            likeCount: 0,
            archiveCount: 0,
          };
          dispatch(
            SignalViewActions.addSignalPostAction({
              ...initialData,
              ...response,
            }),
          );
          throw SignalPostError.SUCCESSFUL_POST;
        }
      } catch (e: any) {
        dispatch(
          AnalystPostBuySellActions.PostRequestErrorAction({
            error: true,
            message: e,
            status: 500,
          }),
        );
      }
    };
  }
  static async getAnalystSignals(
    userQuery: {
      isUser?: boolean;
      id?: string;
    },
    optionsQuery: {skip: number; limit: number},
    timeQuery: {
      isAll?: boolean;
      isIntraday?: boolean;
      isInterday?: boolean;
    },
    atEnd: boolean,
  ) {
    //data has the query string stored which is then sent to backend for querying
    return async (dispatch: any) => {
      try {
        await dispatch(SignalViewActions.signalRequestAction(true, atEnd));
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        const response = await AnalystBuySellPostApi.getPostByType(
          {isUser: true, id: userQuery.id, userId: userQuery.id},
          {...optionsQuery, archives: false},
          timeQuery,
          await token,
        );
        if (response.length == 0 || response.length < 15)
          await dispatch(
            SignalViewActions.signalAnalystLoadMoreStateUpdateAction(false),
          );
        if (!atEnd)
          return dispatch(SignalViewActions.getAnalystSignalAction(response));
        else
          return dispatch(
            SignalViewActions.updateAnalystSignalAction(response),
          );
      } catch (err: any) {
        Http.handleErrors({});
        return dispatch(
          SignalViewActions.signalErrorAction(true, false, 500, err),
        );
      }
    };
  }

  static async getSignalsByType(
    userQuery: {
      isUser?: boolean;
      id?: string;
      isAnalystProfile?: boolean;
      userId?: string;
    },
    optionsQuery: {skip: number; limit: number},
    timeQuery: {
      isAll?: boolean;
      isIntraday?: boolean;
      isInterday?: boolean;
      isActive?: boolean;
      isNotActive?: boolean;
    },
    atEnd: boolean,
  ) {
    //data has the query string stored which is then sent to backend for querying
    return async (dispatch: any) => {
      try {
        await dispatch(SignalViewActions.signalRequestAction(true, atEnd));
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        var response = [];
        if (userQuery.isAnalystProfile) {
          response = await AnalystBuySellPostApi.getAnalystProfilePost(
            // userQuery,
            {id: userQuery.id, isUser: true, userId: userQuery.userId},
            {...optionsQuery, archives: true},
            timeQuery,
            await token,
          );
        } else
          response = await AnalystBuySellPostApi.getPostByType(
            {id: userQuery.id, isUser: false, userId: userQuery.id},
            {...optionsQuery, archives: false},
            timeQuery,
            await token,
          );
        if (response.length == 0 || response.length < 15)
          await dispatch(
            SignalViewActions.signalViewLoadMoreStateUpdateAction(false),
          );
        if (!userQuery.isAnalystProfile) {
          if (!atEnd) {
            dispatch(SignalViewActions.signalResponseAction(response));
            return dispatch(
              SignalViewActions.signalRequestAction(false, atEnd),
            );
          } else {
            dispatch(SignalViewActions.signalUpdateResponseAction(response));
            return dispatch(
              SignalViewActions.signalRequestAction(false, atEnd),
            );
          }
        } else {
          if (!atEnd) {
            dispatch(
              SignalViewActions.signalAnalystProfileResponseAction(response),
            );
            return dispatch(
              SignalViewActions.signalRequestAction(false, atEnd),
            );
          } else {
            dispatch(
              SignalViewActions.signalAnalystProfileUpdateResponseAction(
                response,
              ),
            );
            return dispatch(
              SignalViewActions.signalRequestAction(false, atEnd),
            );
          }
        }
      } catch (err: any) {
        Http.handleErrors({});
        return dispatch(
          SignalViewActions.signalErrorAction(true, false, 500, err),
        );
      }
    };
  }

  static async patchPost(postId: string, updates: any, name: string) {
    return async (dispatch: any) => {
      try {
        dispatch(AnalystPostBuySellActions.PostRequestAction());
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        const response = await AnalystBuySellPostApi.patchPost(
          postId,
          updates,
          token,
        );
        const initialData = {
          analystName: name,
        };
        dispatch(
          SignalViewActions.PostPatchAction([{...initialData, ...response}]),
        );
        throw SignalPostError.SIGNAL_UPDATED;
      } catch (e: any) {
        dispatch(
          AnalystPostBuySellActions.PostRequestErrorAction({
            error: true,
            message: e,
            status: 500,
          }),
        );
      }
    };
  }
  static async deletePost(postId: string) {
    return async (dispatch: any) => {
      try {
        dispatch(AnalystPostBuySellActions.PostRequestAction());
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        await AnalystBuySellPostApi.deletePost(postId, token);
        dispatch(SignalViewActions.DeletePostAction(postId));
        dispatch(
          AnalystPostBuySellActions.PostRequestErrorAction({
            error: false,
            message: '',
            status: 200,
          }),
        );
      } catch (error:any) {
        dispatch(
          AnalystPostBuySellActions.PostRequestErrorAction({
            error: true,
            message: 'Post failed to be deleted',
            status: 500,
          }),
        );
        Http.handleErrors({});
      }
    };
  }

  // CRUD Archives
  static async archivePost(postId: string, archive: boolean) {
    return async (dispatch: any) => {
      try {
        const token = await AsyncStorageService.getUser().then(user => {
          return {token: user.token, id: user.user.id};
        });
        await AnalystBuySellPostApi.archivePost(
          postId,
          token.id,
          archive,
          token.token,
        );
        await dispatch(
          ArchiveActions.ArchiveCountUpdateAction(archive ? 1 : -1),
        );
        return {success: true};
      } catch (error:any) {
        return {success: false};
      }
    };
  }
  static async getArchivePost(id: string, skip: number, atEnd: boolean) {
    return async (dispatch: any) => {
      try {
        await dispatch(SignalViewActions.signalRequestAction(true, atEnd));
        if (!atEnd)
          dispatch(ArchiveActions.ArchiveSetLoadMoreStateAction(true));
        const token = await AsyncStorageService.getUser().then(user => {
          return {token: user.token, id: user.user.id};
        });

        const response = await AnalystBuySellPostApi.getPostByType(
          {isUser: false, userId: token.id, id: id},
          {skip: skip, limit: 15, archives: true},
          {},
          token.token,
        );
        if (response.length == 0 || response.length < 15)
          await dispatch(ArchiveActions.ArchiveSetLoadMoreStateAction(false));
        if (!atEnd) {
          await dispatch(
            SignalViewActions.signalErrorAction(false, false, 200, ''),
          );
          return await dispatch(
            ArchiveActions.ArchiveDataSuccessAction(response),
          );
        } else {
          dispatch(SignalViewActions.signalErrorAction(false, false, 200, ''));
          return dispatch(
            ArchiveActions.ArchiveDataUpdateSuccessAction(response),
          );
        }
      } catch (error:any) {
        Http.handleErrors({});
        dispatch(SignalViewActions.signalErrorAction(true, false, 500, error));
      }
    };
  }
  static async setSignalViewRefreshing(refreshing: boolean) {
    return async (dispatch: any) => {
      try {
        return dispatch(
          SignalViewActions.signalRequestAction(refreshing, false),
        );
      } catch (error:any) {
        Http.handleErrors({});
      }
    };
  }

  // CRUD Likes
  static async likePost(userid: string, postid: string, like: boolean) {
    return async (dispatch: any) => {
      try {
        const token = await AsyncStorageService.getUser().then(user => {
          return user.token;
        });
        await AnalystBuySellPostApi.likePost(userid, token, postid, like);
        return {success: true};
      } catch (error:any) {
        return {success: false};
      }
    };
  }
}
