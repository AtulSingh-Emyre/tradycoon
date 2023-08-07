import {Router} from 'express';
import {AnalystPostController} from '../controllers/AnalystPostController';
import {AuthSetup} from '../middlewares/authentication-setup';

//@PATH /analyst
//@AUTH required
//@FUNCTIONS CRUD of analyst posts

class AnalystPostRouter {
  public router: Router;
  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.deleteRoutes();
    this.patchRoutes();
  }
  getRoutes() {
    this.router.post(
      '/post/like',
      //AuthSetup.isAuthenticated,
      AnalystPostController.likeSignal,
    );
  }
  patchRoutes() {
    this.router.patch(
      '/post/:id',
      AuthSetup.isAuthenticated,
      AnalystPostController.patchSignalPost,
    );
  }

  postRoutes() {
    this.router.post('/post/post', AuthSetup.isAuthenticated, AnalystPostController.saveSignalPost);
    this.router.post(
      '/post/query',
      AuthSetup.isAuthenticated,
      AnalystPostController.getSignalDetailsByQuary,
    );
    this.router.post(
      '/post/query/profile',
      AuthSetup.isAuthenticated,
      AnalystPostController.getSignalDetailsByQuary,
    );
  }
  deleteRoutes() {
    this.router.post(
      '/post/delete',
      // AuthSetup.isAuthenticated,
      AnalystPostController.deleteSignal,
    );
  }
}

export default new AnalystPostRouter().router;
