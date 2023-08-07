import {getEnvVariable} from '../environment';
// import WebSocket from 'ws';
class GlobalWebSocket {
  private static gws: GlobalWebSocket;
  private static ws: WebSocket;
  public static getInstance() {
    if (!this.gws) this.gws = new GlobalWebSocket();
    return this.gws;
  }
  public getSocket() {
    if (!GlobalWebSocket.ws)
      GlobalWebSocket.ws = new WebSocket(getEnvVariable().auth_url);
    return GlobalWebSocket.ws;
  }
}
export default GlobalWebSocket.getInstance();
