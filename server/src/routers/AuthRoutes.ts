import {Router} from 'express';
import {AuthSetup} from '../middlewares/authentication-setup';
import {AuthController} from '../controllers/AuthController';

//@Route: /auth
//@AUTH not required
//@FUNCTIONS all auth related work

class AuthRouter {
  public router: Router;
  constructor() {
    this.router = Router();
    //this.getRoutes();
    this.postRoutes();
  }
  // getRoutes() {
  //   this.router.get('/generate/:n', AuthController.userCreator);
  // }

  postRoutes() {
    this.router.post('/sendOtp', AuthController.otp);
    this.router.post('/verify/email', AuthController.verifEmail);
    this.router.post('/login', AuthController.login);
    this.router.post('/login/id', AuthSetup.isAuthenticated, AuthController.loginId);
    //this.router.post('/purge', AuthController.purge);
    //this.router.post('/sendnotifications', AuthController.sendnotifications);
  }
}
export default new AuthRouter().router;
