import ChatDetails from '../models/Chat/Chat';
import {IChatUserDetails} from '../models/Chat/Chat';

const clients: any = {};
const users: any = {};

export const ChatAppListener = (io: any) => {
  io.on('connection', (socket: any) => {
    clients[socket.id] = socket;
    socket.on('userJoined', (userId: string) => onUserJoined(userId, socket));
    socket.on('message', (message: any) => onMessageReceived(message, socket));
  });
};

// Event listeners.
// When a user joins the chatroom.
function onUserJoined(userId: string, socket: any) {
  try {
    // The userId will never be null as only authenticated users can join the room.
    users[socket.id] = userId;
    _sendExistingMessages(socket);
  } catch (err) {
  }
}
// When a user sends a message in the chatroom.
function onMessageReceived(message: any, senderSocket: any) {
  const userId = users[senderSocket.id];
  // Safety check.
  if (!userId) return;
  _sendAndSaveMessage(message, senderSocket);
}

// Helper functions.
// Send the pre-existing messages to the user that just joined.
async function _sendExistingMessages(socket: any) {
  const messages = await ChatDetails.find({}).sort({created_at: 1});
  if (!messages.length) return;
  socket.emit('message', messages.reverse());
}

// Save the message to the db and send all sockets but the sender.
async function _sendAndSaveMessage(message: any, socket: any, fromServer?: any) {
  const userDetail: IChatUserDetails = message.user;
  const mssg = message.mssg;
  const newChat = new ChatDetails({user: userDetail, message: mssg});
  await newChat.save();
  socket.emit('message', newChat);
}
