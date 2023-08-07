import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from '../components/Drawer/DrawerContent';
import MainTabScreen from './MainBottonTab';
import {ManageAnalystClientsStackScreen} from './routes/ManageAnalystClientsNavigation';
import {ProfileDetailsStackScreen} from './routes/ProfileDetailsNavigation';
import {SupportStackScreen} from './routes/SupportNavigation';
import {ProfileEditStackScreen} from './routes/ProfileEditNagivation';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {NotificationStackScreen} from './routes/NotificationNavigation';
import {IUserServerAuthDataResponse} from '../models/user/UserAuth';

export enum ScreenNames {
  PROFILEDETAILS = 'ProfileDetails',
  PROFILEEDIT = 'ProfileEdit',
  DASHBOARD = 'Dashboard',
  SIGNALBUYSELLPOST = 'SignalBuySellPost',
  MANAGEANALYSTCLIENTS = 'ManageAnalystClients',
  BUYSELLSIGNALVIEW = 'BuySellSignalView',
  SUPPORT = 'Support',
  LEADERBOARD = 'Experts',
  GLOBALCHAT = 'GlobalChat',
  NOTIFICATION = 'Notification',
}

export enum Screen {
  PROFILE_EDIT_STACKSCREEN = 'ProfileEditStackScreen',
  PROFILE_DETAILS_STACKSCREEN = 'ProfileDetailsStackScreen',
  MANAGEANALYST_CLIENTS_STACKSCREEN = 'ManageAnalystClientsStackScreen',
  LEADERBOARD_ANALYST_STACKSCREEN = 'LeaderboardAnalystStackScreen',
  DASHBOARD_STACKSCREEN = 'DashboardStackScreen',
  BUY_SELL_SIGNAL_VIEW_STACKSCREEN = 'BuySellSignalViewStackScreen',
  SIGNAL_BUY_SELL_POST_STACKSCREEN = 'SignalBuySellPostStackScreen',
  GLOBAL_CHAT_STACKSCREEN = 'GlobalChatStackScreen',
  NOTIFICATION_SCREEN = 'NotificationScreen',
  SUPPORT_STACKSCREEN = 'SupportStackScreen',
}

export type RootStackParamList = {
  [Screen.PROFILE_DETAILS_STACKSCREEN]: {id: IUserServerAuthDataResponse['id']};
  [Screen.PROFILE_EDIT_STACKSCREEN]: {id: IUserServerAuthDataResponse['id']};
  [Screen.DASHBOARD_STACKSCREEN]: undefined;
  [Screen.SIGNAL_BUY_SELL_POST_STACKSCREEN]: undefined;
  [Screen.MANAGEANALYST_CLIENTS_STACKSCREEN]: undefined;
  [Screen.BUY_SELL_SIGNAL_VIEW_STACKSCREEN]: undefined;
  [Screen.SUPPORT_STACKSCREEN]: undefined;
  [Screen.LEADERBOARD_ANALYST_STACKSCREEN]: undefined;
  [Screen.GLOBAL_CHAT_STACKSCREEN]: undefined;
  [Screen.NOTIFICATION_SCREEN]: {id: IUserServerAuthDataResponse['id']};
  MainTabScreen: undefined;
};
export type RootStackParamListMain = {
  [ScreenNames.PROFILEDETAILS]: {id: IUserServerAuthDataResponse['id']};
  [ScreenNames.PROFILEEDIT]: {id: IUserServerAuthDataResponse['id']};
  [ScreenNames.DASHBOARD]: undefined;
  [ScreenNames.SIGNALBUYSELLPOST]: undefined;
  [ScreenNames.MANAGEANALYSTCLIENTS]: undefined;
  [ScreenNames.BUYSELLSIGNALVIEW]: undefined;
  [ScreenNames.SUPPORT]: undefined;
  [ScreenNames.LEADERBOARD]: undefined;
  [ScreenNames.GLOBALCHAT]: undefined;
  [ScreenNames.NOTIFICATION]: {id: IUserServerAuthDataResponse['id']};
  MainTabScreen: undefined;
};

export const RootStack = createStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  const loggedIn = useSelector((state: any) => state.userReducer.loggedIn);

  const Drawer = createDrawerNavigator<RootStackParamListMain>();
  return (
    <Drawer.Navigator
      drawerContent={(props: any) =>
        loggedIn ? <DrawerContent {...props} /> : <></>
      }>
      <Drawer.Screen
        options={{headerShown: false}}
        name="MainTabScreen"
        component={MainTabScreen}
      />
      <Drawer.Screen
        options={{headerShown: false}}
        name={ScreenNames.MANAGEANALYSTCLIENTS}
        component={ManageAnalystClientsStackScreen}
      />
      <Drawer.Screen
        options={{headerShown: false}}
        name={ScreenNames.PROFILEDETAILS}
        component={ProfileDetailsStackScreen}
      />
      <Drawer.Screen
        options={{headerShown: false}}
        name={ScreenNames.SUPPORT}
        component={SupportStackScreen}
      />
      <Drawer.Screen
        options={{headerShown: false}}
        name={ScreenNames.PROFILEEDIT}
        component={ProfileEditStackScreen}
      />
      <Drawer.Screen
        options={{headerShown: false}}
        name={ScreenNames.NOTIFICATION}
        component={NotificationStackScreen}
      />
    </Drawer.Navigator>
  );
};
export default RootStackNavigator;
