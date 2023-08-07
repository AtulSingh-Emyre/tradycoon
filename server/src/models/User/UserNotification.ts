import {Document, model, Model, Schema} from 'mongoose';

export interface IUserNotifications {
  sender: String;
  receiver?: Array<string>;
  message: String;
  read_by?: [
    {
      readerId: String;
      read_at: Date;
    },
  ];
  created_at: Date;
}

export type NotificationsDocument = IUserNotifications & Document;

const NotificationSchema = new Schema({
  sender: {type: Schema.Types.ObjectId, ref: 'UserDetails'}, // Notification creator
  receiver: [{type: Schema.Types.ObjectId, ref: 'UserDetails'}], // Ids of the receivers of the notification
  message: {type: String, required: true, default: ''}, // any description of the notification message
  read_by: [
    {
      readerId: {type: Schema.Types.ObjectId, ref: 'UserDetails'},
      read_at: {type: Date, default: Date.now},
    },
  ],
  created_at: {type: Date, default: Date.now},
});

const NotificationsDetails: Model<NotificationsDocument> = model(
  'Notifications',
  NotificationSchema,
);
export default NotificationsDetails;
