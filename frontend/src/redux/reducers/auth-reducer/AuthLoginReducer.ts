import {AuthLoginActionTypes} from '../../actions/auth-actions/AuthLoginAction';
export interface AuthLoginReducerState {
  isLoading: boolean;
  errorStatus: {
    error: boolean;
    status: number;
    message: string;
  };
}

const initialstate: AuthLoginReducerState = {
  isLoading: false,
  errorStatus: {
    error: false,
    status: 200,
    message: '',
  },
};

export const AuthLoginReducer = (
  state = initialstate,
  action: any,
): AuthLoginReducerState => {
  switch (action.type) {
    case AuthLoginActionTypes.LOGIN_STATUS:
      return {...state, errorStatus: action.payload, isLoading: false};
    case AuthLoginActionTypes.LOGGING_IN:
      return {...state, isLoading: true};
    case AuthLoginActionTypes.LOGIN_REQUEST_COMPLETE:
      return {...state, isLoading: false};
    default:
      return state;
  }
};
