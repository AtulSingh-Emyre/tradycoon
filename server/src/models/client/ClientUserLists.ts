import {Document, model, Model, Schema} from 'mongoose';

export interface IClientUserLists {
  group_id: String;
  user_id: String;
  created_at: Date;
  valid_at: Date;
}

export type ClientUserListsDocument = IClientUserLists & Document;

const ClientUserListsSchema: Schema = new Schema({
  group_id: {type: Schema.Types.ObjectId, ref: 'ClientGroupDetails'},
  user_id: {type: Schema.Types.ObjectId, ref: 'UserDetails'},
  created_at: {
    type: Date,
    required: true,
  },
  valid_at: {
    type: Date,
    required: true,
  },
});

const ClientUserLists: Model<ClientUserListsDocument> = model(
  'ClientUserLists',
  ClientUserListsSchema,
);
export default ClientUserLists;
