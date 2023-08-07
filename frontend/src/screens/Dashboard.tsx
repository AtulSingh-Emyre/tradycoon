import inAppMessaging from '@react-native-firebase/in-app-messaging';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {UserRoles} from '../models/ReducerTypes/UserReducerTypes';
import DashboardItem from '../components/Dashboard/DashboardItem';
import {ScreenNames} from '../navigation/RootNavigation';
import {RootState} from '../redux/reducers';
import DashboardBanner from '../components/Dashboard/DashboardBanner';

interface DashboardProps {
  user: any;
}

const mapStateToProps = ({userReducer}: RootState): DashboardProps => {
  return {
    user: userReducer.user.parsedData.user,
  };
};

const Dashboard: React.FC<DashboardProps> = props => {
  const navigation = useNavigation();
  const role = useSelector(
    (state: any) => state.userReducer.user.parsedData.user.role[0],
  );
  useEffect(() => {
    // Allow user to receive messages now setup is complete
    inAppMessaging().setMessagesDisplaySuppressed(false);
  }, []);
  const traderDashboardItem = [
    {
      name: 'Stock Signal',
      icon: {
        type: 'Icon',
        iname: 'chart-bar',
      },
      router: ScreenNames.BUYSELLSIGNALVIEW,
    },
    {
      name: 'Experts',
      icon: {
        type: 'FAIcon',
        iname: 'award',
      },
      router: ScreenNames.LEADERBOARD,
    },
    {
      name: 'Profile',
      icon: {
        type: 'Icon',
        iname: 'account-outline',
      },
      router: ScreenNames.PROFILEDETAILS,
    },
  ];
  const AnalystDashboardItem = [
    {
      name: 'Stock Signal',
      icon: {
        type: 'Icon',
        iname: 'chart-bar',
      },
      router: ScreenNames.BUYSELLSIGNALVIEW,
    },
    {
      name: 'Manage Clients',
      icon: {
        type: 'Icon',
        iname: 'account-group-outline',
      },
      router: ScreenNames.MANAGEANALYSTCLIENTS,
    },
    {
      name: 'Experts',
      icon: {
        type: 'FAIcon',
        iname: 'award',
      },
      router: ScreenNames.LEADERBOARD,
    },
    {
      name: 'Profile',
      icon: {
        type: 'Icon',
        iname: 'account-outline',
      },
      router: ScreenNames.PROFILEDETAILS,
      prams: {id: props.user.id},
    },
    {
      name: 'Report',
      icon: {
        type: 'Icon',
        iname: 'clipboard',
      },
      router: '',
    },
  ];
  return (
    <View>
      <DashboardBanner visible={props.user.profileStatus === 'new'} />
      <DashboardItem
        dashboardItem={
          role && role === UserRoles.ANALYST
            ? AnalystDashboardItem
            : traderDashboardItem
        }
      />
    </View>
  );
};

export default connect(mapStateToProps)(Dashboard);
