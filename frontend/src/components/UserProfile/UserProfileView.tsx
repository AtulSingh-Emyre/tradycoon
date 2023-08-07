import React, {useEffect, useState} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {
  Avatar,
  Button,
  Caption,
  Title,
  Colors,
  useTheme,
  Divider,
  Subheading,
  List,
  Badge,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {
  RootStackParamListMain,
  ScreenNames,
} from '../../navigation/RootNavigation';
import {RootState} from '../../redux/reducers';
import {UserProfileRepository} from '../../services/UserProfile/UserProfileRepository';
import AnalystLeaderboard from './AnalystLeaderboard';
import SignalView from '../BuySellSignalList/SignalView';
import {
  LeaderboardConstants,
  SignalViewQueries,
} from '../../constants/signalViewConstants';
import ReportsAnalyst from '../Reports/ReportsAnalyst';
import {UserRoles} from '../../models/ReducerTypes/UserReducerTypes';
import ClientGroupList from './ClientGroupList';
import ActivityIndicatorloader from '../../templates/ActivityIndicatorloader';
import Snackbar from '../../templates/Snackbar';
import {UserProfileViewActions} from '../../redux/actions/UserProfileViewActions';
import {Http} from '../../services/http';
interface IPorfileViewProps {
  authUserId: string;
  userId: string;
  isFollowing: boolean;
  name: string;
  avatar: string;
  userProfileIsLoading: boolean;
  userProfileError: boolean;
  work_mail: string;
  phone: string;
  experience: number;
  role: any;
}

interface IProfileViewDispatchProps {
  getUserProfile: Function;
  setFollowerUpdate: Function;
  dismiss: Function;
}

interface UserProfileViewProps
  extends IProfileViewDispatchProps,
    IPorfileViewProps {
  route: any;
}

const mapStateToProps = ({
  userProfileViewReducer,
  userReducer,
}: RootState): IPorfileViewProps => {
  return {
    role: userProfileViewReducer.userData,
    name: userProfileViewReducer.userData.name,
    authUserId: userReducer.user.parsedData.user.id,
    isFollowing: userProfileViewReducer.userData.isFollowing,
    userId: userProfileViewReducer.userId,
    avatar: userProfileViewReducer.userData.avatar,
    phone: userProfileViewReducer.userData.phone,
    work_mail: userProfileViewReducer.userData.work_mail,
    experience: userProfileViewReducer.userData.experience,
    userProfileIsLoading: userProfileViewReducer.ProfileViewStatus.loading,
    userProfileError: userProfileViewReducer.ProfileViewStatus.error,
  };
};

const mapDispatchToProps = (dispatch: any): IProfileViewDispatchProps => {
  return {
    setFollowerUpdate: async (followerId: string,followerNum:number, addFollower: boolean) =>
      dispatch(
        await UserProfileRepository.addFollower(followerId,followerNum, addFollower),
      ),
    getUserProfile: async (id: string) =>
      dispatch(await UserProfileRepository.getUserProfileById(id)),
    dismiss: async () =>
      dispatch(
        await UserProfileViewActions.UserProfileViewErrorAction(
          false,
          false,
          200,
          '',
        ),
      ),
  };
};

const BuySellSignalViewCustomOwnProfile = () => {
  return (
    <SignalView
      siginalEdit={false}
      showChip={false}
      queryType={SignalViewQueries.OWN_PROFILE_PAGE}
    />
  );
};

const BuySellSignalViewCustomAnalystProfile = () => {
  return (
    <SignalView
      siginalEdit={false}
      showChip={false}
      queryType={SignalViewQueries.ANALYST_PROFILE_PAGE}
    />
  );
};

const traderClientGroups = () => {
  return <ClientGroupList />;
};

const followersView = (userId: string) => {
  return (
    <AnalystLeaderboard
      // navigation={navigation}
      queryType={LeaderboardConstants.USER_FOLLOWERS}
      id={userId}
    />
  );
};

const followingView = (userId: string) => {
  return (
    <AnalystLeaderboard
      // navigation={navigation}
      queryType={LeaderboardConstants.USER_FOLLOWING}
      id={userId}
    />
  );
};

const reportView = (userId: string) => {
  return <ReportsAnalyst id={userId} />;
};
const Tab = createMaterialTopTabNavigator();

const UserProfileView: React.FC<UserProfileViewProps> = props => {
  const [originalUser, setOriginalUser] = useState(false);
  const [following, setfollowing] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();
  const [stateLoader, setstateLoader] = useState({
    profileDataLoaded: false,
    archivedDataLoaded: false,
    followerDataLoaded: false,
    followingDataLoaded: false,
  });
  const [Role, setRole] = useState('');
  const reloadPage = async () => {
    await props.dismiss();
    await props.getUserProfile(props.userId);
  };
  useEffect(() => {
    const setUserRoleOnUpdate = async () =>
      setRole((await props.role.roles) ? await props.role.roles[0] : '');
    void setUserRoleOnUpdate();
    if (props.userId === props.authUserId) setOriginalUser(true);
    else setOriginalUser(false);
    setstateLoader({...stateLoader, profileDataLoaded: true});  
    setfollowing(props.isFollowing);
  }, [props.userId]);

  const followHandler = async () => {
    console.log(following);
    console.log(props.role.followersCount);
    
    const response = await props.setFollowerUpdate(props.userId,props.role.followersCount, !following);
    if (response.success) setfollowing(!following);
    else Http.handleErrors({});
  };
  const userData = !props.userProfileIsLoading && !props.userProfileError;
  const usertitle = props.role.name
    ? props.role.name
    : props.role.phone
    ? props.role.phone
    : props.role.work_mail;

  const OpenWEB = () => {
    Linking.openURL(props.role.website_url);
  };

  if (props.userProfileIsLoading || !userData) {
    <ActivityIndicatorloader />;
  }
  return (
    <View style={styles.container}>
      <List.Item
        style={!userData && styles.hide}
        title={<Text>{usertitle}</Text>}
        description={
          <Text>
            {props.work_mail && props.work_mail !== '' && (
              <Caption>
                {props.role.work_mail} {'\n'}
              </Caption>
            )}
            {props.role.phone !== '' && props.role.phone !== 0 && (
              <Caption>
                Mob : {props.role.phone} {'  '}
              </Caption>
            )}
            {props.role.experience !== '' && (
              <Caption>
                Exp : {props.role.experience} Year
                {'\n'}
              </Caption>
            )}
            {props.role.business_name !== '' && (
              <Caption>
                Company : {props.role.business_name}
                {'\n'}
              </Caption>
            )}
            {props.role.website_url !== '' && (
              <Caption>
                Link :{' '}
                <Caption style={{color: Colors.blue400}} onPress={OpenWEB}>
                  {props.role.website_url} {'\n'}
                </Caption>
              </Caption>
            )}
            {props.role.description !== '' && (
              <Caption style={{fontStyle: 'italic'}}>
                " {props.role.description} "
              </Caption>
            )}
          </Text>
        }
        titleNumberOfLines={1}
        titleEllipsizeMode="tail"
        titleStyle={{marginTop: -12, fontWeight: 'bold'}}
        descriptionNumberOfLines={6}
        left={prop => (
          <TouchableOpacity
            style={!userData && styles.hide}
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: ScreenNames.PROFILEEDIT,
                  params: {id: props.authUserId},
                }),
              )
            }>
            <Avatar.Image
              {...prop}
              size={70}
              style={{alignSelf: 'center'}}
              source={
                userData
                  ? {uri: props.avatar}
                  : require('../../assets/No-User-Avatar.jpeg')
              }
            />
            <Caption
              style={{
                textTransform: 'capitalize',
                textAlign: 'center',
                color: Colors.cyan500,
              }}>
              {props.role.roles ? props.role.roles[0] : Role}
            </Caption>
          </TouchableOpacity>
        )}
        right={prop =>
          props.authUserId === props.userId && userData ? (
            <TouchableOpacity disabled={true} style={!userData && styles.hide}>
              <TouchableOpacity
                style={{alignSelf: 'flex-end'}}
                onPress={() =>
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: ScreenNames.PROFILEEDIT,
                      params: {id: props.authUserId},
                    }),
                  )
                }>
                <Subheading style={styles.follow}>Edit</Subheading>
              </TouchableOpacity>
              <TouchableOpacity disabled={true} style={{alignSelf: 'flex-end'}}>
                <Caption>Following</Caption>
                <Badge style={styles.badge}>{props.role.followingCount}</Badge>
                <Caption>Follower</Caption>
                <Badge style={styles.badge}>{props.role.followersCount}</Badge>
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled={true}>
              {userData && (
                <TouchableOpacity onPress={followHandler}>
                  <Subheading style={styles.follow}>
                    {following ? 'Following' : 'Follow'}
                  </Subheading>
                </TouchableOpacity>
              )}
              <TouchableOpacity disabled={true} style={{alignSelf: 'flex-end'}}>
                <Caption>Following</Caption>
                <Badge style={styles.badge}>{props.role.followingCount}</Badge>
                <Caption>Follower</Caption>
                <Badge style={styles.badge}>{props.role.followersCount}</Badge>
              </TouchableOpacity>
            </TouchableOpacity>
          )
        }
      />
      {stateLoader.profileDataLoaded && userData && (
        <Tab.Navigator
          screenOptions={{
            lazy: true,
            tabBarLabelStyle: {fontSize: 10},
            tabBarStyle: {backgroundColor: theme.colors.background},
            tabBarAllowFontScaling: true,
            tabBarItemStyle: {height: 35, justifyContent: 'flex-start'},
            tabBarContentContainerStyle: {alignItems: 'flex-end'},
            tabBarBounces: true,
            tabBarPressOpacity: 2,
          }}>
          <Tab.Screen
            name="ProfileSignal"
            options={{tabBarLabel: 'Signal'}}
            component={
              props.role.roles[0] === UserRoles.ANALYST
                ? BuySellSignalViewCustomAnalystProfile
                : BuySellSignalViewCustomOwnProfile
            }
          />
          {props.role.roles && props.role.roles[0] === UserRoles.ANALYST && (
            <Tab.Screen
              name="Report"
              options={{
                tabBarLabel: 'Report',
              }}>
              {() => reportView(props.userId)}
            </Tab.Screen>
          )}
          {props.role.roles &&
            props.role.roles[0] !== UserRoles.ANALYST &&
            props.userId === props.authUserId && (
              <Tab.Screen name="Groups">
                {() => traderClientGroups()}
              </Tab.Screen>
            )}
          <Tab.Screen name="Following" options={{title: 'Following'}}>
            {() => followingView(props.userId)}
          </Tab.Screen>
          <Tab.Screen name="Followers" options={{tabBarLabel: 'Followers'}}>
            {() => followersView(props.userId)}
          </Tab.Screen>
        </Tab.Navigator>
      )}
      <Snackbar visible={props.userProfileError} onDismiss={() => reloadPage()}>
        {
          <>
            <Text>User details failed to load, reloading page</Text>
            <Button onPress={() => reloadPage()}> Close </Button>
          </>
        }
      </Snackbar>
    </View>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(UserProfileView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerProfileView: {
    marginHorizontal: 10,
    marginVertical: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  follow: {
    color: Colors.amber500,
    fontWeight: 'bold',
  },
  hide: {
    display: 'none',
    opacity: 0,
    height: 0,
  },
  badge: {
    alignSelf: 'center',
    width: 50,
    backgroundColor: Colors.blue500,
  },
});
