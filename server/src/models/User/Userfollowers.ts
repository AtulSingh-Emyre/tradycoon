import {Document, model, Model, Schema} from 'mongoose';

export interface IUserfollowers {
  user_id: String;
  follower_id: Array<string>;
}

export type UserfollowersDocument = IUserfollowers & Document;

const UserfollowersSchema: Schema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'UserDetails'},
  follower_id: [{type: Schema.Types.ObjectId, ref: 'UserDetails'}],
});

const Userfollowers: Model<UserfollowersDocument> = model('Userfollowers', UserfollowersSchema);
export default Userfollowers;
