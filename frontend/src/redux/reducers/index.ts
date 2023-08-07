import {applyMiddleware, combineReducers, createStore} from 'redux';
import {UserReducer, UserReducerState} from './UserReducer';
import thunk from 'redux-thunk';
import {
  AuthOtpReducer,
  AuthOtpReducerState,
} from './auth-reducer/AuthOtpReducer';
import {
  AuthLoginReducer,
  AuthLoginReducerState,
} from './auth-reducer/AuthLoginReducer';
import {
  PostBuySellReducer,
  PostBuySellReducerState,
} from './AnalystPostBuySellReducer';
import {SignalViewReducer, SignalViewReducerState} from './SignalViewReducer';
import {
  UserGroupReducer,
  UserGroupReducerState,
} from './user-groups/UserGroupReducer';
import {
  UserProfileViewReducer,
  UserProfileViewReducerTypes,
} from './UserProfileViewReducer';
import {GlobalChatReducer, GlobalChatReducerState} from './GlobalChatReducer';
import {
  FollowerReducer,
  FollowerReducerState,
} from './TertiaryUserDetails/FollowerReducer';
import {
  ArchiveReducer,
  ArchiveReducerState,
} from './TertiaryUserDetails/ArchiveReducer';
import {
  AnalystReportReducer,
  AnalystReportReducerState,
} from './TertiaryUserDetails/AnalystReportReducer';
import {SupportReducer, SupportReducerState} from './SupportReducer';
import {
  UserNotificationReducer,
  UserNotificationReducerState,
} from './UserNotificationReducer';
export interface RootReducerState {
  userReducer: UserReducerState;
  authOtpReducer: AuthOtpReducerState;
  authLoginReducer: AuthLoginReducerState;
  signalPostReducer: PostBuySellReducerState;
  signalViewReducer: SignalViewReducerState;
  userGroupReducer: UserGroupReducerState;
  userProfileViewReducer: UserProfileViewReducerTypes;
  globalChatReducer: GlobalChatReducerState;
  followerReducer: FollowerReducerState;
  archiveReducer: ArchiveReducerState;
  reportReducer: AnalystReportReducerState;
  supportReducer: SupportReducerState;
  userNotificationReducer: UserNotificationReducerState;
}

export const rootReducer = combineReducers({
  userReducer: UserReducer,
  authOtpReducer: AuthOtpReducer,
  authLoginReducer: AuthLoginReducer,
  signalPostReducer: PostBuySellReducer,
  signalViewReducer: SignalViewReducer,
  userGroupReducer: UserGroupReducer,
  userProfileViewReducer: UserProfileViewReducer,
  globalChatReducer: GlobalChatReducer,
  followerReducer: FollowerReducer,
  archiveReducer: ArchiveReducer,
  reportReducer: AnalystReportReducer,
  supportReducer: SupportReducer,
  userNotificationReducer: UserNotificationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default createStore(
  rootReducer,
  applyMiddleware(thunk),
  // composeEnhancers(applyMiddleware(thunk)),
);
