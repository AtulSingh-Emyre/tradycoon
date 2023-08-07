import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

import {ScreenNames} from './RootNavigation';
import {useTheme} from 'react-native-paper';
import {DashboardStackScreen} from './routes/DashboardNavigation';
import {BuySellSignalViewStackScreen} from './routes/BuySellSignalViewNavigation';
import {SignalBuySellPostStackScreen} from './routes/SignalBuySellPostNavigation';
import {LeaderboardAnalystStackScreen} from './routes/LeaderboardAnalystNavigation';
import {GlobalChatStackScreen} from './routes/GlobalChatNavigation';
import {useSelector} from 'react-redux';
import {UserRoles} from '../models/ReducerTypes/UserReducerTypes';

const Tab = createMaterialBottomTabNavigator();
const MainTabScreen = () => {
  const role = useSelector(
    (state: any) => state.userReducer.user.parsedData.user.role[0],
  );

  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName={ScreenNames.DASHBOARD}
      activeColor={theme.dark ? theme.colors.primary : theme.colors.surface}>
      <Tab.Screen
        name={ScreenNames.BUYSELLSIGNALVIEW}
        component={BuySellSignalViewStackScreen}
        options={{
          tabBarLabel: 'Signal',
          tabBarIcon: ({color}) => (
            <Icon name="chart-bar" color={color} size={26} />
          ),
        }}
      />
      {role && role === UserRoles.ANALYST && (
        <Tab.Screen
          name={ScreenNames.SIGNALBUYSELLPOST}
          component={SignalBuySellPostStackScreen}
          options={{
            tabBarLabel: 'Create Signal',
            tabBarIcon: ({color}) => (
              <Icon name="square-edit-outline" color={color} size={26} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name={ScreenNames.DASHBOARD}
        component={DashboardStackScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({color}) => (
            <Icon name="desktop-mac-dashboard" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name={ScreenNames.LEADERBOARD}
        component={LeaderboardAnalystStackScreen}
        options={{
          tabBarLabel: 'Experts',
          tabBarIcon: ({color}) => (
            <FAIcon name="award" color={color} size={26} />
          ),
        }}
      />
      {/* <Tab.Screen
        name={ScreenNames.GLOBALCHAT}
        component={GlobalChatStackScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({color}) => (
            <Icon name="wechat" color={color} size={26} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};
export default MainTabScreen;
