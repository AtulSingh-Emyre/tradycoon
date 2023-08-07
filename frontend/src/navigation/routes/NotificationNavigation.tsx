import React from 'react';
import {RootStack, Screen} from '../RootNavigation';
import TopHeaderRightButton from '../../templates/TopHeaderRightButton';
import {CommonActions} from '@react-navigation/native';
import NotificationScreen from '../../screens/NotificationScreen';
import TopHeaderBackButton from '../../templates/TopHeaderBackButton';

export const NotificationStackScreen = ({navigation}: any) => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name={Screen.NOTIFICATION_SCREEN}
        component={NotificationScreen}
        options={{
          title: 'Notifications',
          headerShown: true,
          headerLeft: () => <TopHeaderBackButton navigation={navigation} />,
          headerRight: () => (
            <TopHeaderRightButton
              openNotifications={() =>
                navigation.goBack()
              }></TopHeaderRightButton>
          ),
        }}
      />
    </RootStack.Navigator>
  );
};
