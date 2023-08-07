import {Router} from 'express';
import {ChatController} from '../controllers/ChatController';

//@Route: /global-chat
//@AUTH required
//@FUNCTIONS all global chat related work

class ChatRouter {
  public router: Router;
  constructor() {
    this.router = Router();
    this.postRoutes();
  }
  postRoutes() {
    this.router.post('/chat', ChatController.postChat);
    this.router.post('/get/chat', ChatController.getChat);
    //this.router.post('/delete', ChatController.purge);
  }
}
export default new ChatRouter().router;
