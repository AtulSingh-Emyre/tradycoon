import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Platform} from 'react-native';
import GlobalSocket from '../../services/WebSocket';
import {RootState} from '../../redux/reducers';
import {GlobalChatRepository} from '../../services/GlobalChat/GlobalChatRepository';
import {connect} from 'react-redux';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';

let ws: WebSocket;

interface IStatus {
  error: boolean;
  loading: boolean;
  message: string;
}

interface ServerChatResponse {
  _id: string;
  user: {
    avatar: string;
    id: string;
    name: string;
  };
  text: string;
  created_at: string;
}
enum ClientGlobalChatEventListeners {
  CHAT_MESSAGE_RECIEVED = 'new message',
}

interface IChatApp {
  _id: string;
  created_at: string;
  mentions: any[];
  text: string;
  updated_at: string;
  user: {
    avatar: string;
    id: string;
    name: string;
  };
}

interface IGlobalChatProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  conversation: Array<any>;
  getChatStatus: IStatus;
  postChatStatus: IStatus;
}

interface IGlobalChatDispatchProps {
  getChat: (skip: number, limit: number) => unknown;
  postChat: (
    message: string,
    user: {
      id: string;
      name: string;
      avatar: string;
    },
  ) => unknown;
  handleRecieve: Function;
}

interface GlobalChatProps extends IGlobalChatProps, IGlobalChatDispatchProps {}

const mapStateToProps = ({
  userReducer,
  globalChatReducer,
}: RootState): IGlobalChatProps => {
  return {
    user: {
      avatar: userReducer.user.parsedData.user?.avatar,
      id: userReducer.user.parsedData.user.id,
      name: userReducer.user.parsedData.user.name,
    },
    conversation: globalChatReducer.conversations,
    getChatStatus: globalChatReducer.getChatStatus,
    postChatStatus: globalChatReducer.postChatStatus,
  };
};

const mapDispatchToProps = (dispatch: any): IGlobalChatDispatchProps => {
  return {
    getChat: async (skip: number, limit: number) => {
      return dispatch(await GlobalChatRepository.getChat(skip, limit));
    },
    postChat: async (
      message: string,
      user: {
        id: string;
        name: string;
        avatar: string;
      },
    ) => {
      return dispatch(await GlobalChatRepository.postChat(user, message));
    },
    handleRecieve: async (mssg: any) => {
      return dispatch(await GlobalChatRepository.recievedChat(mssg));
    },
  };
};

const GlobalChat = (props: GlobalChatProps) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  useEffect(() => {
    const getChats = async () => {
      await props.getChat(0, 100);
    };
    getChats();
  }, []);

  useEffect(() => {
    setMessages(
      props.conversation.map((item: IChatApp) => ({
        _id: item._id,
        createdAt: new Date(item.created_at),
        text: item.text,
        user: {
          _id: item.user.id,
          name: item.user.name,
          avatar: item.user.avatar,
        },
      })),
    );
  }, [props.conversation]);

  useEffect(() => {
    listenWebSocket();
  }, []);

  const listenWebSocket = async () => {
    ws = ws ? ws : GlobalSocket.getSocket();
    ws.onmessage = e => {
      const msg = JSON.parse(e.data.toString());
      if (msg[0] === ClientGlobalChatEventListeners.CHAT_MESSAGE_RECIEVED) {
        const data: ServerChatResponse = msg[1];
        props.handleRecieve(msg[1]);
        setMessages([
          {
            _id: data._id,
            createdAt: new Date(data.created_at),
            text: data.text,
            user: {
              _id: data.user.id,
              avatar: data.user.avatar,
              name: data.user.name,
            },
          },
          ...messages,
        ]);
      }
    };
  };

  const handleSend = async (messages: IMessage) => {
    const message = {
      user: props.user,
      text: messages.text,
      created_at: messages.createdAt,
    };
    if (message.text.length == 0) {
      return;
    }
    await listenWebSocket();
    ws.send(
      JSON.stringify([
        [
          ClientGlobalChatEventListeners.CHAT_MESSAGE_RECIEVED,
          JSON.stringify(message),
        ],
      ]),
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => handleSend(messages[0])}
      user={{
        _id: props.user.id,
        avatar: props.user.avatar,
        name: props.user.name,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row-reverse',
  },
  messageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    padding: 5,
    backgroundColor: '#1976d2',
    borderRadius: 3,
    marginBottom: 5,
    flexDirection: 'row',
    maxWidth: 300,
  },
  messageContainerReceived: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#00796b',
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
    marginEnd: 40,
    padding: 5,
  },
  messageTime: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginStart: 10,
    position: 'absolute',
    end: 10,
    bottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    borderColor: '#448aff',
    borderWidth: 1,
    padding: 10,
    borderRadius: 3,
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  sendButton: {
    paddingStart: 10,
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  imageButton: {
    width: 24,
    height: 24,
    tintColor: '#448aff',
  },
  image: {
    height: 100,
    flex: 1,
  },
  sendButtonText: {color: '#448aff'},
});

export default connect(mapStateToProps, mapDispatchToProps)(GlobalChat);
