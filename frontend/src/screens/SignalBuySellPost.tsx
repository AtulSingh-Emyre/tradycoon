import * as React from 'react';
import PostBuySell from '../components/BuySellSignalPost/PostBuySell';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SignalView from '../components/BuySellSignalList/SignalView';
import {ISignalItem} from '../models/buySellsignal';
import {SignalViewQueries} from '../constants/signalViewConstants';
import {SIZES} from '../styles/theme';
import {useTheme} from 'react-native-paper';

interface SignalBuySellPostProps {
  item?: ISignalItem;
}

const Tab = createMaterialTopTabNavigator();
const SignalBuySellPost: React.FC<SignalBuySellPostProps> = props => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        lazy: true,
        tabBarLabelStyle: {fontSize: 10},
        tabBarStyle: {backgroundColor: theme.colors.background},
      }}>
      <Tab.Screen name="Create Signal" component={PostBuySell} />
      <Tab.Screen name="View Signal">
        {() => (
          <SignalView
            siginalEdit={true}
            showChip={false}
            queryType={SignalViewQueries.ANALYST_SIGNAL_VIEW_PAGE}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default SignalBuySellPost;
