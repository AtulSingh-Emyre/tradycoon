import {Document, model, Model, Schema} from 'mongoose';

export interface ISignalArchive {
  signal_id: String;
  user_id: Array<string>;
}

export type SignalArchiveDocument = ISignalArchive & Document;

const SignalArchiveSchema: Schema = new Schema({
  signal_id: {type: Schema.Types.ObjectId, ref: 'AnalystPostBuySellSignals'},
  user_id: [{type: Schema.Types.ObjectId, ref: 'UserDetails'}],
});

const SignalArchive: Model<SignalArchiveDocument> = model('SignalArchives', SignalArchiveSchema);
export default SignalArchive;
