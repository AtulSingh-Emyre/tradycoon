import {Document, model, Model, Schema} from 'mongoose';

export interface IChatUserDetails {
  id: string;
  name: string;
  avatar: string;
}

interface IChatDetails {
  user: IChatUserDetails;
  text: string;
  created_at: Date;
  updated_at: Date;
  mentions: Array<any>;
}

export type ChatDetailsDocument = IChatDetails & Document;

const ChatDetailsSchema: Schema = new Schema({
  user: {type: Object, required: true},
  text: {type: String, required: true},
  mentions: {type: Array, required: false, default: []},
  created_at: {
    type: Date,
    required: false,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const ChatDetails: Model<ChatDetailsDocument> = model('ChatDetailsAddEdit', ChatDetailsSchema);
export default ChatDetails;
