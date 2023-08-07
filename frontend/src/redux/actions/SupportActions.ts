export enum SupportActionTypes {
  SERVER_STATUS = 'status updation of getting chat',
}

export class SupportActions {
  static supportStatusAction = (
    error: boolean,
    loading: boolean,
    message: string,
  ) => ({
    type: SupportActionTypes.SERVER_STATUS,
    payload: {error, loading, message},
  });
}
