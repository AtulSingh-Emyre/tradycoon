export enum GoogleSigninErrors {
  SIGN_IN_CANCELLED = 'Login Was Cancelled',
  IN_PROGRESS = 'Login is in Progress',
  PLAY_SERVICES_NOT_AVAILABLE = 'Google play services not available',
  UNKNOWN_ERROR = 'Something went wrong, please try again',
}

export enum FacebookSigninErrors {
  SIGN_IN_CANCELLED = 'Login Was Cancelled',
  IN_PROGRESS = 'Login is in Progress',
  UNKNOWN_ERROR = 'something went wrong, please try again',
}

export enum SignInErrors {
  UNKNOWN_ERROR = 'something went wrong, please try again',
  PARSE_ERROR = 'Error while parsing, please try again',
}

export enum OTP_Errors {
  INCORRECT_OTP = 'Entered OTP is incorrect, please try again',
  UNKNOWN_ERROR = 'Something went wrong, please select different login options',
}

export enum Common_Errors {
  UNKNOWN_ERROR = 'Something went wrong, please try again',
}
