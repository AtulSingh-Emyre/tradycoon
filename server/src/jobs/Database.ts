import * as JobScheduler from 'node-schedule';
import ClientUserLists from '../models/client/ClientUserLists';
import NotificationsDetails from '../models/User/UserNotification'

export class Database {
  static runDatabaseJobs() {
    this.removeValidityClientFromGroup();
    this.clearNotification();
  }

  static async removeValidityClientFromGroup() {
    const todayDate = new Date(); //today date '00 00 23 * * 0-7'
    JobScheduler.scheduleJob('delete validity expired client', '00 00 23 * * 0-6', async () => {
      //every date 11 Pm deleted validity expired client
      const removeClientFromGroup = async () => {
        await ClientUserLists.deleteMany({valid_at: {$lt: todayDate}});
      };
      removeClientFromGroup().catch(console.error);
    });
  }

  static async clearNotification() {
    const todayDate = new Date(); //today date '00 00 23 * * 0-7'
    JobScheduler.scheduleJob('delete Notification', '00 00 23 * * 0-6', async () => {
      //every date 11 Pm deleted Notification
      const removeClientFromGroup = async () => {
        await NotificationsDetails.deleteMany({valid_at: {$lt: todayDate}});
      };
      removeClientFromGroup().catch(console.error);
    });
  }
}
