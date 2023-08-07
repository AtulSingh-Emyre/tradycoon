import {Document, model, Model, Schema} from 'mongoose';

export interface IClientUser {
  id: String;
  email: String | undefined;
  mob: String | number | undefined;
  name: String | undefined;
  validTill: String | Date;
  createdAt: String | Date;
}
export interface IClientGroupAddEdit {
  groupName: String;
  created_at: Date;
  updated_at: Date;
  analyst_UserId: String;
}

export type ClientGroupDocument = IClientGroupAddEdit & Document;

const ClientGroupSchema: Schema = new Schema({
  groupName: {type: String, required: true},
  analyst_UserId: {type: Schema.Types.ObjectId, ref: 'UserDetails'},
  created_at: {
    type: Date,
    required: false,
  },
  updated_at: {
    type: Date,
    required: false,
  },
});

const ClientGroup: Model<ClientGroupDocument> = model('ClientGroupDetails', ClientGroupSchema);
export default ClientGroup;
