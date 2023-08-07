import {UserRoles} from '../ReducerTypes/UserReducerTypes';

export interface IUserServerAuthDataResponse {
  id: string;
  name: string;
  phone: string;
  role: UserRoles[];
  experience: number;
  business_account: boolean;
  avatar: string;
  work_mail: string;
  business_name: string;
  description: string;
  website_url: string;
  DOB: string;
  interests: Array<string>;
  sebiReg_No: string;
  analystPostSignalCount: number;
  followersCount: number;
  followingCount: number;
  traderSaveSignalCount: number;
}

export interface IUserAuthData {
  uid: string;
  phone?: string;
  work_mail?: string;
  idToken?: string;
  avatar?: string | null;
  name?: string;
  role?: UserRoles[];
  auth_route: string;
  isNewUser: boolean;
}

export interface IDeviceInfo {
  user_id: string;
  deviceToken: string;
}
