import {Document, model, Model, Schema} from 'mongoose';

export interface IDeviceInformation {
  user_id: String;
  deviceToken: String;
}

export type DeviceInformationDocument = IDeviceInformation & Document;

const DeviceInformationSchema: Schema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'UserDetails', required: true},
  device_Token: {type: String, required: true},
});

const DeviceInformation: Model<DeviceInformationDocument> = model(
  'DeviceInformations',
  DeviceInformationSchema,
);
export default DeviceInformation;
