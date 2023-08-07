import moment from 'moment';
import {Document, Model, model, Schema} from 'mongoose';
import {ISignalArchive} from './SignalArchive';
export interface IAnalystPostBuySell {
  analyst: String;
  stockName: String;
  comparator: String;
  price: number;
  buy: boolean;
  T1: number;
  T2?: number;
  T3?: number;
  SL: number;
  possibility: number;
  description?: String;
  isIntraday: boolean;
  isActive: boolean;
  achievedPrice: number;
  achievedValue: String;
  validTill: Date;
  isFree: boolean;
  subscibeClient: Array<string>;
  created_at?: Date;
  updated_at: Date;
}
export type AnalystPostBuySellDocument = IAnalystPostBuySell & Document;
const AnalystPostBuySellSchema: Schema = new Schema({
  analyst: {
    type: Schema.Types.ObjectId,
    ref: 'UserDetails',
    required: true,
  },
  stockName: {type: String, required: true},
  price: {type: Number, required: false},
  buy: {type: Boolean, required: true},
  comparator: {type: String, required: false},
  T1: {
    type: Number,
    required: false,
  },
  T2: {
    type: Number,
    required: false,
  },
  T3: {
    type: Number,
    required: false,
  },
  SL: {type: Number, required: false},
  possibility: {type: Number, required: false, default: 50},
  description: {type: String, required: false},
  isIntraday: {type: Boolean, required: false},
  achievedPrice: {type: Number, default: 0},
  achievedValue: {type: String, required: false},
  isActive: {type: Boolean, default: true},
  validTill: {type: Date, required: false},
  isFree: {type: Boolean, required: false},
  subscibeClient: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ClientUserLists',
      required: false,
    },
  ],
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
const AnalystPostBuySell: Model<AnalystPostBuySellDocument> = model(
  'AnalystPostBuySellSignals',
  AnalystPostBuySellSchema,
);
export default AnalystPostBuySell;
