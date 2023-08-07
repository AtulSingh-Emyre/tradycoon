export enum GlobalChatActionTypes {
  GET_CHAT = 'retrieving chat',
  GET_CHAT_STATUS = 'status updation of getting chat',
  POST_CHAT_STATUS = 'status updation of posting chat',
  POST_CHAT = 'chat being posted',
  NEW_MESSAGE_RECIEVED = 'new message recieved',
}

export class GlobalChatActions {
  static chatResponseAction = (conversations: any) => ({
    type: GlobalChatActionTypes.GET_CHAT,
    payload: conversations,
  });
  static chatStatusAction = (status: {
    error: boolean;
    loading: boolean;
    message: string;
  }) => ({
    type: GlobalChatActionTypes.GET_CHAT_STATUS,
    payload: status,
  });
  static chatPostStatusAction = (
    error: boolean,
    loading: boolean,
    message: string,
  ) => ({
    type: GlobalChatActionTypes.POST_CHAT_STATUS,
    payload: {
      error,
      loading,
      message,
    },
  });
  static chatNewMessageAction = (message: any) => ({
    type: GlobalChatActionTypes.NEW_MESSAGE_RECIEVED,
    payload: message,
  });
}
