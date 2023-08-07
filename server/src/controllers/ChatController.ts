/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {NextFunction, Request, Response} from 'express';
import {ClientGlobalChatEventListeners} from '../models/WebSockets/GlobalChat/GlobalChatEventListeners';
import {GlobalAppListener} from '../middlewares/GlobalAppListener';
import ChatDetails from '../models/Chat/Chat';
import {IChatUserDetails} from '../models/Chat/Chat';
export class ChatController {
  static async postChat(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {      
      const userDetail: IChatUserDetails = req.body.user;
      const mssg = req.body.mssg;
      const newChat = new ChatDetails({user: userDetail, message: mssg});
      await newChat.save();
      res.json({
        success: true,
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
  static async getChat(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const chat = await ChatDetails.find({})
        .sort({created_at: -1})
        .skip(req.body.skip)
        .limit(req.body.limit);
      res.json({
        success: true,
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  }
  static async purge() {
    await ChatDetails.deleteMany({});
  }
  // Web socket controls:
  static async recieve(msg: any, data: any, sender: any, clients: any) {
    msg = JSON.parse(msg);
    // console.log(`Received: ${msg.text.substring(0, 500)}, from ${sender}`);
    const userDetail: IChatUserDetails = msg.user;
    const mssg = msg.text;
    const newChat = new ChatDetails({user: userDetail, text: mssg, created_at: msg.created_at});
    await newChat.save();
    // console.log(newChat);

    this.broadcast({...msg,_id:newChat._id}, clients);
  }

  static broadcast(msg: any, clients: any) {
    // console.log('sending');
    Object.keys(clients).map((client) => {
      GlobalAppListener.send([ClientGlobalChatEventListeners.CHAT_MESSAGE_RECIEVED, msg], client);
    });
  }
}
