import {Router, Response, Request} from 'express';
import {UserController} from '../controllers/UserController';
import {AuthSetup} from '../middlewares/authentication-setup';

// @Route: user-management/

class UserRouter {
  public router: Router;
  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();
    this.deleteRoutes();
  }
  getRoutes() {
    this.router.get('/user/:id', AuthSetup.isAuthenticated, UserController.getUserDetails);
    this.router.get(
      '/analyst/leaderboard/:skip',
      AuthSetup.isAuthenticated,
      UserController.getLeaderboard,
    );
    this.router.get('/user/followers/:id', AuthSetup.isAuthenticated, UserController.getFollowers);
    this.router.get('/user/following/:id', AuthSetup.isAuthenticated, UserController.getFollowing);
    this.router.get(
      '/user/subscribeClientGroup/:id',
      AuthSetup.isAuthenticated,
      UserController.getSubscribeClientGroup,
    );
  }
  postRoutes() {
    this.router.post('/user/update', AuthSetup.isAuthenticated, UserController.updateUser);
    this.router.post('/user/support', AuthSetup.isAuthenticated, UserController.postSupportQuery);
    this.router.post(
      '/user/report/signalReport',
      AuthSetup.isAuthenticated,
      UserController.analystSignalReport,
    );
  }
  putRoutes() {
    this.router.post('/user/follower', AuthSetup.isAuthenticated, UserController.updateFollowers);
    this.router.post('/user/signal/archive', AuthSetup.isAuthenticated, UserController.addArchive);
    this.router.post(
      '/user/savedeviceinfo',
      AuthSetup.isAuthenticated,
      UserController.SaveDeviceInfo,
    );
  }
  deleteRoutes() {
    this.router.delete('/users', UserController.deleteUser);
    //this.router.delete('/user/all', UserController.purgeData);
  }
}
export default new UserRouter().router;
