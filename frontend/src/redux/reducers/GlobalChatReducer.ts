import {GlobalChatActionTypes} from '../actions/GlobalChatActions';
export interface GlobalChatReducerState {
  conversations: Array<any>;
  getChatStatus: {
    loading: boolean;
    error: boolean;
    message: string;
  };
  postChatStatus: {
    loading: boolean;
    error: boolean;
    message: string;
  };
}
const initialstate: GlobalChatReducerState = {
  conversations: [],
  getChatStatus: {
    loading: false,
    error: false,
    message: '',
  },
  postChatStatus: {
    loading: false,
    error: false,
    message: '',
  },
};

export const GlobalChatReducer = (
  state = initialstate,
  action: any,
): GlobalChatReducerState => {
  switch (action.type) {
    case GlobalChatActionTypes.GET_CHAT:
      return {
        ...state,
        conversations: action.payload,
        getChatStatus: {
          error: false,
          loading: false,
          message: '',
        },
      };
    case GlobalChatActionTypes.GET_CHAT_STATUS:
      return {
        ...state,
        getChatStatus: action.payload,
      };
    case GlobalChatActionTypes.POST_CHAT_STATUS:
      return {
        ...state,
        postChatStatus: action.payload,
      };
    case GlobalChatActionTypes.NEW_MESSAGE_RECIEVED:
      return {
        ...state,
        conversations: [...state.conversations, action.payload],
      };
    default:
      return state;
  }
};
