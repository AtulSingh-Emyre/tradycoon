import React, {useEffect, useRef, useState} from 'react';
import AuthStackNavigator from './AuthNavigation';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import auth from '@react-native-firebase/auth';
import {connect} from 'react-redux';
import {useTheme} from 'react-native-paper';
import RNBootSplash from 'react-native-bootsplash';

import RootStackNavigator from './RootNavigation';
import {AsyncStorageService} from '../services/AsyncStorage';
import {AuthRepositry} from '../services/Authentication/AuthRepositry';
import {RootState} from '../redux/reducers';
import ActivityIndicatorloader from '../templates/ActivityIndicatorloader';
import {PreferencesContext} from '../context/theme-context';
import {CombinedDarkTheme, CombinedDefaultTheme} from '../constants/theme';
import {AuthLoginActions} from '../redux/actions/auth-actions/AuthLoginAction';
import {checkNotifactionPermisson} from '../services/deviceToken';

interface IRouter {
  loggedIn: boolean;
  isLoading: boolean;
}
interface IRouterDispatchProps {
  login: Function;
  setLoggingIn: Function;
}

const mapStateToProps = ({
  userReducer,
  authLoginReducer,
}: RootState): IRouter => {
  return {
    loggedIn: userReducer.loggedIn,
    isLoading: authLoginReducer.isLoading,
  };
};

const mapDispatchToProps = (dispatch: any): IRouterDispatchProps => {
  return {
    login: async () => {
      return await dispatch(AuthRepositry.loginWithId());
    },
    setLoggingIn: async () => {
      return await dispatch(AuthLoginActions.loginRequestAction());
    },
  };
};

interface IProps extends IRouter, IRouterDispatchProps {}
const AppRouter = (props: IProps) => {
  const theme = useTheme();
  const navigationRef = useNavigationContainerRef<any>();
  const routeNameRef = useRef<any>();
  const {toggleTheme, isThemeDark} = React.useContext(PreferencesContext);

  useEffect(() => {
    onAuthStateChangedRelogin();
    crashlytics().log('AppRouter mounted.');
  }, []);

  const onAuthStateChangedRelogin = async () => {
    if (props.loggedIn) return;
    const resp = await AsyncStorageService.getUser();
    if (resp != null) {
      const enableNotificationsAsync = async () => {
        await props.login();
        await checkNotifactionPermisson();
      };
      enableNotificationsAsync().catch(console.error);
    }
    const darkThemeCheck = await AsyncStorageService.checkIfDarkTheme();
    if (darkThemeCheck != null)
      if (darkThemeCheck == isThemeDark) toggleTheme();
  };

  if (props.isLoading) {
    return <ActivityIndicatorloader />;
  }

  return (
    <NavigationContainer
      onReady={() => RNBootSplash.hide()}
      ref={navigationRef}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute()?.name || '';
        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}
      theme={theme.dark ? CombinedDarkTheme : CombinedDefaultTheme}>
      {props.loggedIn ? <RootStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
