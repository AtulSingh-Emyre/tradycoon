import {stat} from 'react-native-fs';
import { runOnJS } from 'react-native-reanimated';
import {ISignalItem} from '../../models/buySellsignal';
import {SignalViewActionTypes} from '../actions/SignalViewActions';

export interface SignalViewReducerState {
  post: ISignalItem[];
  analystProfilePost: ISignalItem[];
  postLoadMore: boolean;
  signalViewLoadMoreLoading: boolean;
  signalViewStatus: {
    error: boolean;
    refreshing: boolean;
    status: number;
    message: string;
  };
  analystPost: ISignalItem[];
  analystLoadMore: boolean;
  totalPost: number;
}
const initialState: SignalViewReducerState = {
  post: [],
  analystProfilePost: [],
  postLoadMore: true,
  signalViewLoadMoreLoading: false,
  signalViewStatus: {
    error: false,
    refreshing: false,
    status: 200,
    message: '',
  },
  analystPost: [],
  analystLoadMore: true,
  totalPost: 0
};

export const SignalViewReducer = (
  state = initialState,
  action: any,
): SignalViewReducerState => {
  switch (action.type) {
    case SignalViewActionTypes.SIGNAL_RESPONSE: {
      return {
        ...state,
        post: action.payload,
        postLoadMore: true,
        signalViewLoadMoreLoading: false,
      };
    }
    case SignalViewActionTypes.SET_USER_TOTAL_POST: {
      return {
        ...state,
        totalPost : state.totalPost+action.payload,
      }
    }
    case SignalViewActionTypes.SIGNAL_ANALYST_RESPONSE: {
      return {
        ...state,
        analystProfilePost: action.payload,
        postLoadMore: true,
        signalViewLoadMoreLoading: false,
      };
    }
    case SignalViewActionTypes.ANALYST_POST_LOAD_MORE_STATE_UPDATE: {
      state.analystLoadMore = action.payload;
      return state;
    }
    case SignalViewActionTypes.SIGNAL_VIEW_LOAD_MORE_STATE_UPDATE: {
      state.postLoadMore = action.payload;
      return state;
    }
    case SignalViewActionTypes.SIGNAL_UPDATE_LIST: {
      return {
        ...state,
        post: [...state.post, ...action.payload],
        signalViewStatus: initialState.signalViewStatus,
        signalViewLoadMoreLoading: false,
      };
    }
    case SignalViewActionTypes.SIGNAL_PROFILE_UPDATE_LIST: {
      return {
        ...state,
        analystProfilePost: [...state.analystProfilePost, ...action.payload],
        signalViewStatus: initialState.signalViewStatus,
        signalViewLoadMoreLoading: false,
      };
    }

    case SignalViewActionTypes.SIGNAL_REQUEST: {
      return {
        ...state,
        signalViewStatus: {
          ...state.signalViewStatus,
          refreshing: action.payload.refreshing,
        },
        signalViewLoadMoreLoading: action.payload.atEnd
          ? action.payload.refreshing
          : state.signalViewLoadMoreLoading,
      };
    }
    case SignalViewActionTypes.SIGNAL_ERROR: {
      return {
        ...state,
        signalViewStatus: action.payload,
        signalViewLoadMoreLoading: false,
      };
    }
    case SignalViewActionTypes.ANALYST_SIGNAL: {
      return {
        ...state,
        analystPost: action.payload,
        signalViewLoadMoreLoading: false,
        signalViewStatus: initialState.signalViewStatus,
        analystLoadMore: true,
      };
    }
    case SignalViewActionTypes.ANALYST_SIGNAL_UPDATE: {
      return {
        ...state,
        analystPost: [...state.analystPost, ...action.payload],
        signalViewStatus: initialState.signalViewStatus,
        signalViewLoadMoreLoading: false,
      };
    }
    case SignalViewActionTypes.SIGNAL_DELETE: {
      return {
        ...state,
        analystPost: state.analystPost.filter(
          item => item._id !== action.payload,
        ),
        totalPost: state.totalPost -1,
        post: state.post.filter(item => item._id !== action.payload),
        signalViewStatus: initialState.signalViewStatus,
      };
    }
    case SignalViewActionTypes.POST_PATCH: {
      return {
        ...state,
        analystPost: state.analystPost.map(
          obj => ({...obj,...action.payload.find((o: any) => o._id === obj._id)}) || obj,
        ),
        post: state.post.map(
          obj => ({...obj,...action.payload.find((o: any) => o._id === obj._id)}) || obj,
        ),
      };
    }
    case SignalViewActionTypes.INITIALIZE_USER_TOTAL_POST: {
      return {
        ...state,
        totalPost: action.payload
      }
    }
    case SignalViewActionTypes.ADD_POST: {
      return {
        ...state,
        analystPost: [action.payload, ...state.analystPost],
        post: [action.payload, ...state.post],
        totalPost: state.totalPost+1,
      };
    }
    default: {
      return state;
    }
  }
};
