export enum AuthLoginActionTypes {
  LOGGING_IN = 'Login request sent to the server',
  LOGIN_STATUS = 'Login status',
  LOGIN_REQUEST_COMPLETE = 'Login request ended',
}

export class AuthLoginActions {
  static loginRequestAction = () => ({
    type: AuthLoginActionTypes.LOGGING_IN,
  });
  static loginRequestCompleteAction = () => ({
    type: AuthLoginActionTypes.LOGIN_REQUEST_COMPLETE,
  });
  static loginStatusAction = (
    status: number,
    error: boolean,
    message: string,
  ) => ({
    type: AuthLoginActionTypes.LOGIN_STATUS,
    payload: {status, error, message},
  });
}
