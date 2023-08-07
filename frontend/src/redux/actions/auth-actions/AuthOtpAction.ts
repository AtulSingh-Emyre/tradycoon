export enum AuthOtpActionTypes {
  OTP_IS_LOADING = 'Otp is being sent by the server',
  OTP_FAILED = 'otp has failed to load',
  OTP_VALUE = 'the value of OTP sent',
}

export class AuthOtpActions {
  static OtpRequestAction = () => ({
    type: AuthOtpActionTypes.OTP_IS_LOADING,
  });
  static OtpFailedToLoad = (
    status: number,
    message: string,
    error: boolean,
  ) => ({
    type: AuthOtpActionTypes.OTP_FAILED,
    payload: {status, error, message},
  });
  static otpValueAction = (otp: any, verificationId: string) => ({
    type: AuthOtpActionTypes.OTP_VALUE,
    payload: {otp, verificationId},
  });
}
