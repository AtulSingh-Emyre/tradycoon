import {AuthOtpActionTypes} from '../../actions/auth-actions/AuthOtpAction';

export interface AuthOtpReducerState {
  otp: number;
  verificationId: string;
  errorStatus: {
    status: number;
    error: boolean;
    message: string;
  };
  isLoading: boolean;
}

const initialstate: AuthOtpReducerState = {
  isLoading: false,
  errorStatus: {
    status: 200,
    error: false,
    message: '',
  },
  otp: 0,
  verificationId: '',
};

export const AuthOtpReducer = (
  state = initialstate,
  action: any,
): AuthOtpReducerState => {
  switch (action.type) {
    case AuthOtpActionTypes.OTP_FAILED:
      return {
        ...state,
        errorStatus: {
          status: action.payload.status,
          error: action.payload.error,
          message: action.payload.message,
        },
        isLoading: false,
      };
    case AuthOtpActionTypes.OTP_IS_LOADING:
      return {...state, isLoading: true};
    case AuthOtpActionTypes.OTP_VALUE:
      return {
        ...state,
        otp: action.payload.otp,
        verificationId: action.payload.verificationId,
        isLoading: false,
      };
    default:
      return state;
  }
};
