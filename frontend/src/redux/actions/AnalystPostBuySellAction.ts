export enum AnalystPostBuySellActionTypes {
  POST_REQUEST = 'Analyst post buy sell is being posted',
  POST_REQUEST_ERROR = 'Analyst post buy sell request failed ',
}

export class AnalystPostBuySellActions {
  static PostRequestAction = () => ({
    type: AnalystPostBuySellActionTypes.POST_REQUEST,
  });
  static PostRequestErrorAction = (status: {
    error: boolean;
    status: number;
    message: string;
  }) => ({
    type: AnalystPostBuySellActionTypes.POST_REQUEST_ERROR,
    payload: status,
  });
}
