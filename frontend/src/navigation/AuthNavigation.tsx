import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Signup from '../screens/Signup';
import PhoneAuth from '../screens/LoginOtp';
import PrivacyTermsAndConditions from '../components/UserAuth/PrivacyTermsAndConditions';

const AuthStack = createStackNavigator();

export enum ScreenNames {
  LOGIN = 'Login',
  LOGINOTP = 'LoginOtp',
  PRIVACYTERMSANDCONDITIONS = 'PrivacyTermsAndConditions',
}

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName={ScreenNames.LOGIN}>
      <AuthStack.Screen
        name={ScreenNames.LOGIN}
        component={Signup}
        initialParams={{route: {params: {state: false}}}}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name={ScreenNames.LOGINOTP}
        component={PhoneAuth}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name={ScreenNames.PRIVACYTERMSANDCONDITIONS}
        component={PrivacyTermsAndConditions}
        options={{
          headerShown: true,
          title: 'Terms & Privacy Policy',
        }}
      />
    </AuthStack.Navigator>
  );
};
export default AuthStackNavigator;
