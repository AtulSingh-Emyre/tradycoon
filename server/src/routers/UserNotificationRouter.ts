import {Router} from 'express';
import {AuthSetup} from '../middlewares/authentication-setup';
// import {UserNotificationValidators} from '../validators/UserNotificationValidators';
import {UserNotificationController} from '../controllers/UserNotificationController';

class UserNotificationRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
    this.deleteRoutes();
  }

  //@PATH: /post/UserNotification
  //@Auth: required
  //@FUNCTIONS: CUD of UserNotifications
  getRoutes() {}

  postRoutes() {
    this.router.post(
      '/user/notifs',
      //AuthSetup.isAuthenticated,
      UserNotificationController.getUserNotifications,
    );

    // this.router.post(
    //   '/add',
    //   AuthSetup.isAuthenticated,
    //   UserNotificationController.addUserNotification,
    // );
  }

  patchRoutes() {
    // this.router.patch(
    //   '/edit/:id',
    //   AuthSetup.isAuthenticated,
    //   UserNotificationController.editUserNotification,
    // );
  }

  deleteRoutes() {
    // this.router.delete(
    //   '/delete/:id',
    //   AuthSetup.isAuthenticated,
    //   UserNotificationController.deleteUserNotification,
    // );
  }
}

export default new UserNotificationRouter().router;
