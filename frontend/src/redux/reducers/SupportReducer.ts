import {SupportActionTypes} from '../actions/SupportActions';
export interface SupportReducerState {
  postStatus: {
    loading: boolean;
    error: boolean;
    message: string;
  };
}
const initialstate: SupportReducerState = {
  postStatus: {
    loading: false,
    error: false,
    message: '',
  },
};

export const SupportReducer = (
  state = initialstate,
  action: any,
): SupportReducerState => {
  switch (action.type) {
    case SupportActionTypes.SERVER_STATUS:
      return {
        ...state,
        postStatus: action.payload,
      };
    default:
      return state;
  }
};
