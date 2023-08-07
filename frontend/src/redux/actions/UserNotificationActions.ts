export enum UserNotificationTypes {
  SERVER_STATUS = 'status updation of getting chat',
  USER_NOTIFICATIONS_RECIEVED = 'notifications from backend loaded',
  USER_NOTIFICATIONS_UPDATED = 'more notifications data loaded',
}
export class UserNotifications {
  static userNotificationStatusAction = (
    error: boolean,
    loading: boolean,
    message: string,
    atEnd: boolean,
  ) => ({
    type: UserNotificationTypes.SERVER_STATUS,
    payload: {status: {error, loading, message}, atEnd},
  });
  static userNotificationResponseAction = (
    data: any,
    isAvailable: boolean,
    atEnd: boolean,
  ) => ({
    type: UserNotificationTypes.USER_NOTIFICATIONS_RECIEVED,
    payload: {data, isAvailable, atEnd},
  });
}
