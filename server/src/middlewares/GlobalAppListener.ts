/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {IncomingMessage} from 'http';
import {ChatController} from '../controllers/ChatController';
import WebSocket from 'ws';
import {ClientGlobalChatEventListeners} from '../models/WebSockets/GlobalChat/GlobalChatEventListeners';
import {socketIndex} from '../models/WebSockets/Index';

export class GlobalAppListener {
  public static ws: any;
  public static clients: any = {};
  public static connectedUsers: any = {};
  static GlobalAppConfig(wss: WebSocket.Server) {
    wss.on('connection', (server: WebSocket, req: IncomingMessage) => {
      GlobalAppListener.ws = server;
      console.log(req.headers['sec-websocket-key']);
      const client = req.headers['sec-websocket-key'];
      if (client) {
        GlobalAppListener.clients[client] = server;
        GlobalAppListener.ws.on('message', (msg: any, data: any) => {
          console.log('check');
          return GlobalAppListener.mssgHandler(msg, data, client);
        });
        GlobalAppListener.ws.on('close', (socket: any, number: any, reason: any) =>
          console.log('Closed: ', client, socket, number, reason),
        );
      } else return;
    });
  }
  static mssgHandler(clientMsg: any, data: any, client: any) {
    clientMsg = JSON.parse(clientMsg);
    console.log(JSON.stringify(clientMsg));
    
    switch (clientMsg[0][0]) {
      case socketIndex.USER_CONNECTED:
        return this.userJoined(clientMsg[0][1], data, client);
      case ClientGlobalChatEventListeners.CHAT_MESSAGE_RECIEVED:
        return ChatController.recieve(clientMsg[0][1], data, client, GlobalAppListener.clients);
      default:
        break;
    }
  }

  static send(msg: any, client: any) {
    console.log('Sending: ', msg);
    GlobalAppListener.clients[client].send(JSON.stringify(msg), (error: any) => {
      if (error) {
        delete GlobalAppListener.clients[client];
      } else {
        console.log(`Sent: ${msg}, to ${client}`);
      }
    });
  }
  static userJoined(message: any, data: any, client: any) {
    this.connectedUsers[message] = true;
    console.log(this.connectedUsers);
  }
  static userDisconnected(message: any, data: any, client: any) {
    delete this.connectedUsers[message];
  }
}
