import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import CodePush from 'react-native-code-push';
import {LogBox, StatusBar} from 'react-native';
import {Provider as PaperProvider, useTheme} from 'react-native-paper';
import Store from './src/redux/reducers';
import {Provider} from 'react-redux';
import AppRouter from './src/navigation/Routes';
import {CombinedDarkTheme, CombinedDefaultTheme} from './src/constants/theme';
import messaging from '@react-native-firebase/messaging';
import {PreferencesContext} from './src/context/theme-context';

LogBox.ignoreAllLogs();
let codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  updateDialog: {appendReleaseDescription: true},
};
const App = () => {
  const [isThemeDark, setIsThemeDark] = React.useState(true);
  const theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;
  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark],
  );

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
    });
    CodePush.sync({
      installMode: CodePush.InstallMode.IMMEDIATE,
    });
    return unsubscribe;
  }, []);
  return (
    <PreferencesContext.Provider value={preferences}>
      <Provider store={Store}>
        <PaperProvider theme={theme}>
          <StatusBar
            barStyle={theme.dark ? 'light-content' : 'dark-content'}
            backgroundColor={theme.colors.surface}
          />
          <AppRouter />
        </PaperProvider>
      </Provider>
    </PreferencesContext.Provider>
  );
};

export default CodePush(codePushOptions)(App);
