import {Document, model, Model, Schema} from 'mongoose';

export interface ISignalLike {
  signal_id: String;
  user_id: Array<string>;
}

export type SignalLikeDocument = ISignalLike & Document;

const SignalLikeSchema: Schema = new Schema({
  signal_id: {type: Schema.Types.ObjectId, ref: 'AnalystPostBuySellSignals', required: true},
  user_id: [{type: Schema.Types.ObjectId, ref: 'UserDetails', required: true}],
});

const SignalLike: Model<SignalLikeDocument> = model('SignalLikes', SignalLikeSchema);
export default SignalLike;
