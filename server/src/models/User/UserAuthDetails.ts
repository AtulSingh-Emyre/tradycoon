import {Document, model, Model, Schema} from 'mongoose';

export interface IUserAuthData {
  id: String;
  uid: String;
  name: String;
  avatar: String;
  work_mail: String;
  role: UserRoles[];
  experience: number | undefined;
  phone: String;
  profileStatus: string;
  business_name: String;
  business_account: boolean;
  website_url: String;
  description: String;
  DOB: Date;
  interests: any;
  sebiReg_No: String;
  isActive: boolean;
}

export enum UserRoles {
  TRADER = 'trader',
  ANALYST = 'analyst',
}

export enum ProfileStatus {
  NEW_USER = 'new',
  COMPLETE_TRADER_PROFILE = 'ct',
  COMPLETE_ANALYST_PROFILE = 'ca',
  VERIFIED_ANALYST = 'va',
  VERIFIED_TRADER = 'vt',
  REQUEST_FOR_ANALYST = 'ra',
  REQUEST_FOR_TRADER = 'rt',
}
export interface IUserDetail {
  uid: String;
  name: String;
  avatar: String;
  work_mail: String;
  roles: UserRoles[];
  auth_route: String;
  phone: String;
  sebiReg_No: String;
  business_name: String;
  business_account: boolean;
  website_url: String;
  experience: number;
  created_at: Date;
  updated_at: Date;
  description: String;
  profileStatus: String;
  DOB: Date;
  interests: any;
  isActive: boolean;
}
export type UserDetailDocument = IUserDetail & Document;

const UserDetailSchema: Schema = new Schema({
  // level 1 user details
  uid: {type: String, required: false, default: ''},
  name: {type: String, required: false, default: ''},
  avatar: {type: String, required: false},
  work_mail: {type: String, required: false, default: ''},
  roles: {
    type: Array,
    default: [UserRoles.TRADER],
  },
  auth_route: {type: String, required: false},
  phone: {type: String, required: false, default: ''},
  // level 2 user details
  profileStatus: {type: String, required: false, default: false}, //profileStatus
  sebiReg_No: {type: String, required: false, default: ''},
  business_name: {type: String, required: false, default: ''},
  business_account: {
    type: Boolean,
    required: false,
    default: false,
  },
  website_url: {type: String, required: false, default: ''},
  description: {type: String, required: false, default: ''},
  experience: {type: Number, required: false, default: 0},
  DOB: {type: Date, required: false, default: new Date()},
  interests: {type: Array, default: []},
  created_at: {
    type: Date,
    required: false,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: false,
    default: Date.now,
  },
  // level 3 user details
  isActive: {type: Boolean, required: false, default: false},
});

const UserDetail: Model<UserDetailDocument> = model('UserDetails', UserDetailSchema);
export default UserDetail;
