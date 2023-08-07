import {AnalystPostBuySellActionTypes as PostBuySellActionTypes} from '../actions/AnalystPostBuySellAction';

export interface PostBuySellReducerState {
  isLoading: boolean;
  status: {
    error: boolean;
    status: number;
    message: string;
  };
}
const initialState: PostBuySellReducerState = {
  isLoading: false,
  status: {
    error: false,
    status: 200,
    message: '',
  },
};

export const PostBuySellReducer = (
  state = initialState,
  action: any,
): PostBuySellReducerState => {
  switch (action.type) {
    case PostBuySellActionTypes.POST_REQUEST: {
      return {...state, isLoading: true};
    }
    case PostBuySellActionTypes.POST_REQUEST_ERROR: {
      return {...state, status: action.payload, isLoading: false};
    }
    default: {
      return state;
    }
  }
};
