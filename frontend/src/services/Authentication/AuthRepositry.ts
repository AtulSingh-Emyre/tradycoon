import auth from '@react-native-firebase/auth';
import {UserActions} from '../../redux/actions/UserAction';
import {AuthApi as Api} from './AuthApi';
import {AsyncStorageService} from '../AsyncStorage';
import {Dispatch} from 'redux';
import {AuthOtpActions} from '../../redux/actions/auth-actions/AuthOtpAction';
import {AuthLoginActions} from '../../redux/actions/auth-actions/AuthLoginAction';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';
import {
  IUserAuthData,
  IUserServerAuthDataResponse,
} from '../../models/user/UserAuth';
import {IFacebookUserData, IGoogleUserData} from '../../models/authApi/AuthApi';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  FacebookSigninErrors,
  GoogleSigninErrors,
  SignInErrors,
} from '../../error/auth/LoginError';
import {UserRoles} from '../../models/ReducerTypes/UserReducerTypes';
import {SignalViewActions} from '../../redux/actions/SignalViewActions';
import {ArchiveActions} from '../../redux/actions/TertiaryUserDetails/ArchiveActions';
import {Http} from '../http';
import {checkNotifactionPermisson} from '../deviceToken';

interface IServerResponseData {
  groups: any;
  clientGroupData: any;
  user: string;
  token: string;
}

export class AuthRepositry {
  protected static async serverResponseHandler(
    serverResponse: IServerResponseData,
  ) {
    try {
      const userData: IUserServerAuthDataResponse = JSON.parse(
        serverResponse.user,
      );
      const response = {
        user: userData,
        token: serverResponse.token,
      };
      await AsyncStorageService.setUser({...response});
      return {
        success: true,
        parsedData: {...response, role: response.user.role},
      };
    } catch (error: any) {
      return {
        success: false,
        message: SignInErrors.PARSE_ERROR,
      };
    }
  }

  static verifyEmail(data: {userMail: string}) {
    return async (dispatch: Dispatch) => {
      try {
        dispatch(AuthOtpActions.OtpRequestAction());
        const user = await AsyncStorageService.getUser();
        const exists = await Api.verifyEmail(data.userMail, user.token);
        if (exists && exists.exists) {
          return dispatch(
            AuthOtpActions.OtpFailedToLoad(
              200,
              'Email already exists, please use a different email',
              true,
            ),
          );
        } else {
          return dispatch(
            AuthOtpActions.otpValueAction(exists.otp as number, ''),
          );
        }
      } catch (error: any) {
        return dispatch(
          AuthOtpActions.OtpFailedToLoad(
            500,
            'Otp failed to deliver, Please check your email and try again',
            true,
          ),
        );
      }
    };
  }

  static sendOtp(data: {phone: string; isProfile?: boolean}) {
    return async (dispatch: Dispatch) => {
      try {
        dispatch(AuthOtpActions.OtpRequestAction());
        const user = await AsyncStorageService.getUser();
        const exists = await Api.VerifyPhoneData(
          {phone: data.phone},
          user.token,
        );
        if (exists && exists.exists) {
          return dispatch(
            AuthOtpActions.OtpFailedToLoad(
              200,
              'Phone number already exists, please use a different number.',
              true,
            ),
          );
        } else {
          const response = await auth().verifyPhoneNumber(data.phone);
          return dispatch(
            AuthOtpActions.otpValueAction(
              response.code,
              response.verificationId,
            ),
          );
        }
      } catch (error: any) {
        return dispatch(
          AuthOtpActions.OtpFailedToLoad(
            500,
            'Otp failed to deliver, Please check your phone number and try again.',
            true,
          ),
        );
      }
    };
  }

  static loginWithId() {
    return async (dispatch: any) => {
      try {
        dispatch(AuthLoginActions.loginRequestAction());
        const user = await AsyncStorageService.getUser();
        const serverResponse: IServerResponseData = await Api.loginWithId(
          user.user.id,
          user.token,
        );
        const response = await this.serverResponseHandler(serverResponse);
        if (response.success) {
          await dispatch(
            UserActions.UserFollowerCountInitializationAction(
              response.parsedData?.user
                ? response.parsedData?.user.followingCount
                : 0,
            ),
          );
          await dispatch(
            UserActions.UserFollowingCountInitializationAction(
              response.parsedData?.user
                ? response.parsedData?.user.followersCount
                : 0,
            ),
          );
          await dispatch(
            ArchiveActions.ArchiveCountInitializeAction(
              response.parsedData?.user
                ? response.parsedData?.user.traderSaveSignalCount
                : 0,
            ),
          );
          await dispatch(
            SignalViewActions.initializeSignalAnalystTotalPostAction(
              response.parsedData?.user?.analystPostSignalCount
                ? response.parsedData?.user?.analystPostSignalCount
                : 0,
            ),
          );
          await dispatch(UserActions.LoginRequestSuccessAction(response));
          return await dispatch(AuthLoginActions.loginRequestCompleteAction());
        } else {
          throw new Error(response.message);
        }
      } catch (error: any) {
        await dispatch(
          AuthLoginActions.loginStatusAction(
            500,
            true,
            SignInErrors.UNKNOWN_ERROR,
          ),
        );
      }
    };
  }

  static login(data: {user: IUserAuthData}) {
    return async (dispatch: any) => {
      try {
        dispatch(AuthLoginActions.loginRequestAction());
        const serverResponse: IServerResponseData = await Api.login(data);
        const response = await this.serverResponseHandler(serverResponse);
        if (response.success) {
          await dispatch(
            UserActions.UserFollowerCountInitializationAction(
              response.parsedData?.user
                ? response.parsedData?.user.followingCount
                : 0,
            ),
          );
          await dispatch(
            UserActions.UserFollowingCountInitializationAction(
              response.parsedData?.user
                ? response.parsedData?.user.followersCount
                : 0,
            ),
          );
          await dispatch(
            ArchiveActions.ArchiveCountInitializeAction(
              response.parsedData?.user
                ? response.parsedData?.user.traderSaveSignalCount
                : 0,
            ),
          );
          await dispatch(
            SignalViewActions.initializeSignalAnalystTotalPostAction(
              response.parsedData?.user?.analystPostSignalCount
                ? response.parsedData?.user?.analystPostSignalCount
                : 0,
            ),
          );
          await dispatch(UserActions.LoginRequestSuccessAction(response));
          const enableNotificationsAsync = async () => {
            await checkNotifactionPermisson();
          };
          enableNotificationsAsync().catch(console.error);
          return await dispatch(AuthLoginActions.loginRequestCompleteAction());
        } else {
          throw new Error(response.message);
        }
      } catch (error: any) {
        await dispatch(
          AuthLoginActions.loginStatusAction(
            500,
            true,
            SignInErrors.UNKNOWN_ERROR,
          ),
        );
      }
    };
  }

  static loginViaFacebook() {
    return async (dispatch: any) => {
      try {
        const result = await LoginManager.logInWithPermissions([
          'public_profile',
          'email',
        ]);
        if (result.isCancelled) {
          throw new Error(FacebookSigninErrors.SIGN_IN_CANCELLED);
        }
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
          throw new Error(FacebookSigninErrors.UNKNOWN_ERROR);
        }

        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(
          data.accessToken,
        );
        await dispatch(AuthLoginActions.loginRequestAction());

        // Sign-in the user with the credential
        const userInfo = await auth().signInWithCredential(facebookCredential);

        // params object...
        const profileRequestParams = {
          fields: {
            string: 'id, name, email, first_name, last_name, gender, picture',
          },
        };
        const profileRequestConfig = {
          httpMethod: 'GET',
          version: 'v2.5',
          parameters: profileRequestParams,
          accessToken: data.accessToken.toString(),
        };

        const profileRequest = await new GraphRequest(
          '/me',
          profileRequestConfig,
          async (error, result) => {
            if (error) {
              throw new Error(FacebookSigninErrors.UNKNOWN_ERROR);
            } else {
              const rawData = result as IFacebookUserData;
              const apiData: IUserAuthData = {
                uid: userInfo.user.uid,
                avatar: rawData.picture.data.url,
                work_mail: rawData.email,
                name: rawData.name,
                role: [UserRoles.TRADER],
                isNewUser: userInfo.additionalUserInfo?.isNewUser || false,
                auth_route: userInfo.additionalUserInfo?.providerId || '',
              };
              dispatch(await AuthRepositry.login({user: apiData}));
            }
          },
        );
        return await new GraphRequestManager()
          .addRequest(profileRequest)
          .start();
      } catch (error: any) {
        dispatch(AuthLoginActions.loginStatusAction(500, true, error));
      }
    };
  }

  static loginViaGoogle() {
    return async (dispatch: any) => {
      try {
        await GoogleSignin.configure({
          webClientId:
            '982446765859-9on45sl3smphugmdehpbf62t7887516s.apps.googleusercontent.com',
        });
        const data: IGoogleUserData = await GoogleSignin.signIn();
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(
          data.idToken,
        );
        dispatch(AuthLoginActions.loginRequestAction());
        const userInfo = await auth().signInWithCredential(googleCredential);
        const apiData: IUserAuthData = {
          auth_route: userInfo.additionalUserInfo?.providerId || '',
          uid: userInfo.user.uid,
          avatar: userInfo.user.photoURL || data.user.photo,
          idToken: data.user.id !== null ? data.user.id : '',
          name: userInfo.user.displayName || '',
          role: [UserRoles.TRADER],
          work_mail: userInfo.user.email || '',
          isNewUser: userInfo.additionalUserInfo?.isNewUser || false,
        };

        await GoogleSignin.signOut();
        return await dispatch(await AuthRepositry.login({user: apiData}));
      } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          dispatch(
            AuthLoginActions.loginStatusAction(
              400,
              true,
              GoogleSigninErrors.SIGN_IN_CANCELLED,
            ),
          );
        } else if (error.code === statusCodes.IN_PROGRESS) {
          dispatch(
            AuthLoginActions.loginStatusAction(
              500,
              true,
              GoogleSigninErrors.IN_PROGRESS,
            ),
          );
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          dispatch(
            AuthLoginActions.loginStatusAction(
              500,
              true,
              GoogleSigninErrors.PLAY_SERVICES_NOT_AVAILABLE,
            ),
          );
        } else {
          dispatch(
            AuthLoginActions.loginStatusAction(
              500,
              true,
              GoogleSigninErrors.UNKNOWN_ERROR,
            ),
          );
        }
      }
    };
  }

  static logout() {
    return async (dispatch: any) => {
      try {
        const clearState = async () => {
          await dispatch(AuthLoginActions.loginRequestAction());
          await auth().signOut();
          await AsyncStorageService.clearAppData();
          await AsyncStorageService.setUser(null);
          await dispatch(AuthLoginActions.loginRequestCompleteAction());
          dispatch(UserActions.UserLogoutAction());
        };
        clearState().catch(console.error);
      } catch (error: any) {
        Http.handleErrors({});
        await dispatch(AuthLoginActions.loginRequestCompleteAction());
      }
    };
  }
}
