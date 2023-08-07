import {NextFunction, Request, Response} from 'express';
import {sendNotificationAll} from '../firebase/fcm';
import NotificationsDetails, {IUserNotifications} from '../models/User/UserNotification';

export class UserNotificationController {
  static async getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const info = req.body;
      const skip = parseInt(info.skip) || 0;
      const limit = parseInt(info.limit) || 30;
      const getNotification = await NotificationsDetails.find({}, {__v: 0})
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'sender',
          select: '-_id avatar',
        })
        .sort({created_at: -1})
        .exec();
      res.status(200).json({
        success: true,
        data: getNotification ? getNotification : [],
        message: 'Get Notification',
      });
    } catch (error) {
      next(error);
    }
  }
  static async saveUserNotifications(notifyObj: IUserNotifications) {
    try {
      const saveNotifications = new NotificationsDetails({
        ...notifyObj,
      });
      await saveNotifications.save();
      return saveNotifications;
    } catch (error) {
      return error;
    }
  }
  static async sendnotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const title = '$FooCorp up 1.43% on the day';
      const body = '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.';
      //const result = await sendNotification(registrationToken, title, body);
      const result = await sendNotificationAll(title, body);
      res.status(200).json({
        data: result,
        success: true,
      });
    } catch (error) {}
  }
}
