export enum SignalViewActionTypes {
  SIGNAL_RESPONSE = 'Signals recieved',
  SIGNAL_UPDATE_LIST = 'signal list populated',
  SIGNAL_PROFILE_UPDATE_LIST = 'signal profile list populated',
  SIGNAL_ERROR = 'Signals server error',
  SIGNAL_REQUEST = 'Signals request',
  SIGNAL_ANALYST_RESPONSE = 'analyst profile signal view response',
  SIGNAL_VIEW_LOAD_MORE_STATE_UPDATE = 'updating the load more state of signal view',
  ANALYST_POST_LOAD_MORE_STATE_UPDATE = 'updating the load more state of analyst signal view',
  ANALYST_SIGNAL = 'Signals made by the analyst alone',
  ANALYST_SIGNAL_UPDATE = 'analyst signal updated',
  SIGNAL_DELETE = 'signal was deleted',
  POST_PATCH = 'signal was updated',
  ADD_POST = 'signal was created',
  SET_USER_TOTAL_POST = 'set total post of user',
  INITIALIZE_USER_TOTAL_POST = 'initialize total post of user',
}

export class SignalViewActions {
  static signalResponseAction = (signals: any) => ({
    type: SignalViewActionTypes.SIGNAL_RESPONSE,
    payload: signals,
  });
  static signalAnalystProfileResponseAction = (signals: any) => ({
    type: SignalViewActionTypes.SIGNAL_ANALYST_RESPONSE,
    payload: signals,
  });
  static signalUpdateResponseAction = (signals: any) => ({
    type: SignalViewActionTypes.SIGNAL_UPDATE_LIST,
    payload: signals,
  });

  static signalAnalystProfileUpdateResponseAction = (signals: any) => ({
    type: SignalViewActionTypes.SIGNAL_UPDATE_LIST,
    payload: signals,
  });
  static signalAnalystLoadMoreStateUpdateAction = (state: boolean) => ({
    type: SignalViewActionTypes.ANALYST_POST_LOAD_MORE_STATE_UPDATE,
    payload: state,
  });
  static signalViewLoadMoreStateUpdateAction = (state: boolean) => ({
    type: SignalViewActionTypes.SIGNAL_VIEW_LOAD_MORE_STATE_UPDATE,
    payload: state,
  });

  static signalRequestAction = (refreshing: boolean, atEnd: boolean) => ({
    type: SignalViewActionTypes.SIGNAL_REQUEST,
    payload: {refreshing, atEnd},
  });
  static signalErrorAction = (
    error: boolean,
    refreshing: boolean,
    status: number,
    message: string,
  ) => ({
    type: SignalViewActionTypes.SIGNAL_ERROR,
    payload: {
      error,
      refreshing,
      status,
      message,
    },
  });
  static getAnalystSignalAction = (signals: any) => ({
    type: SignalViewActionTypes.ANALYST_SIGNAL,
    payload: signals,
  });
  static updateAnalystSignalAction = (signals: any) => ({
    type: SignalViewActionTypes.ANALYST_SIGNAL_UPDATE,
    payload: signals,
  });

  static PostPatchAction = (signal: any) => ({
    type: SignalViewActionTypes.POST_PATCH,
    payload: signal,
  });
  static DeletePostAction = (postId: string) => ({
    type: SignalViewActionTypes.SIGNAL_DELETE,
    payload: postId,
  });
  static addSignalPostAction = (signal: any) => ({
    type: SignalViewActionTypes.ADD_POST,
    payload: signal,
  });
  static signalAnalystSetTotalPostAction = (num: number) => ({
    type: SignalViewActionTypes.SET_USER_TOTAL_POST,
    payload: num
  });
  static initializeSignalAnalystTotalPostAction = (num: number) => ({
    type: SignalViewActionTypes.INITIALIZE_USER_TOTAL_POST,
    payload: num
  })
}
