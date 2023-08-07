import * as React from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Caption,
  Card,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {UserProfileRepository} from '../../services/UserProfile/UserProfileRepository';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScreenNames} from '../../navigation/RootNavigation';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {LeaderboardConstants} from '../../constants/signalViewConstants';
import {SIZES} from '../../styles/theme';
import LottieView from 'lottie-react-native';
import {IUser} from '../../models/user/UserProfile';
import moment from 'moment';
interface IAnalystLeaderboardMapStateProps {
  leaderboard: IUser[];
  analystLoadMoreIsLoading: boolean;
  followerLoadMoreIsLoading: boolean;
  followingLoadMoreIsLoading: boolean;
  status: {
    error: boolean;
    message: string;
    loading: boolean;
  };
  followerStatus: {
    error: boolean;
    message: string;
    loading: boolean;
  };
  followingStatus: {
    error: boolean;
    message: string;
    loading: boolean;
  };
  followers: any;
  following: any;
  followerLoadMore: boolean;
  followingLoadMore: boolean;
  analystLoadMore: boolean;
}

interface IAnalystLeaderboardMapDispatchProps {
  dismiss: Function;
  getLeaderboard: Function;
  getFollowers: Function;
  getFollowing: Function;
  setProfileViewId: (id: string) => {};
}

interface AnalystLeaderboardProps
  extends IAnalystLeaderboardMapDispatchProps,
    IAnalystLeaderboardMapStateProps {
  navigation?: any;
  id?: string;
  queryType: LeaderboardConstants;
}

const mapStateToProps = ({
  userProfileViewReducer,
  followerReducer,
}: RootState): IAnalystLeaderboardMapStateProps => {
  return {
    leaderboard: userProfileViewReducer.analystLeaderboard,
    status: userProfileViewReducer.analystLeaderboardStatus,
    followers: followerReducer.followerUser,
    following: followerReducer.followingUser,
    analystLoadMore: userProfileViewReducer.analystLoadMore,
    followerLoadMore: followerReducer.followerLoadMore,
    followingLoadMore: followerReducer.followingLoadMore,
    followerStatus: followerReducer.getFollowerStatus,
    followingStatus: followerReducer.getFollowingStatus,
    analystLoadMoreIsLoading:
      userProfileViewReducer.analystLeaderboardLoadMoreIsLoading,
    followerLoadMoreIsLoading: followerReducer.getFollowerLoadMoreIsLoading,
    followingLoadMoreIsLoading: followerReducer.getFollowingLoadMoreIsLoading,
  };
};

const mapDispatchToProps = (
  dispatch: any,
): IAnalystLeaderboardMapDispatchProps => {
  return {
    dismiss: () => {},
    getLeaderboard: async (skip: number, atEnd: boolean) =>
      dispatch(await UserProfileRepository.getLeaderboard(skip, atEnd)),
    getFollowers: async (id: string, skip: number, atEnd: boolean) =>
      dispatch(await UserProfileRepository.getFollowers(id, skip, atEnd)),
    getFollowing: async (id: string, skip: number, atEnd: boolean) =>
      dispatch(await UserProfileRepository.getFollowing(id, skip, atEnd)),
    setProfileViewId: async (id: string) =>
      dispatch(await UserProfileRepository.getUserProfileById(id)),
  };
};

const LeaderboardItem = React.memo(({item, setProfileViewId}: any) => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const navigateToProfile = (id: string) => {
    setProfileViewId(id);
    navigation.dispatch(
      CommonActions.navigate({
        name: ScreenNames.PROFILEDETAILS,
        params: {id: id},
      }),
    );
  };
  const username = item.name
    ? item.name
    : item.phone
    ? item.phone
    : item.work_mail;
  return (
    <Card style={styles.Card}>
      <Card.Title
        title={username}
        subtitle={
          <Text>
            <Caption>{item.roles ? item.roles[0] : null}</Caption>
            {'    '}
            <Caption>
              Joined : {moment(item.created_at).format('DD-MM-YYYY')}
            </Caption>
          </Text>
        }
        subtitleStyle={{textTransform: 'capitalize'}}
        left={props => (
          <Avatar.Image
            {...props}
            size={60}
            style={{alignSelf: 'center'}}
            source={
              item.avatar
                ? {uri: item.avatar}
                : require('../../assets/No-User-Avatar.jpeg')
            }
          />
        )}
        right={props => (
          <View style={styles.row}>
            <IconButton
              {...props}
              icon="arrow-right"
              color={colors.primary}
              style={{alignSelf: 'center'}}
              onPress={() => {
                navigateToProfile(item._id);
              }}
            />
          </View>
        )}
      />
    </Card>
  );
});
const EmptyListMessage = ({item}: any) => {
  return (
    <View style={styles.LottieView}>
      <LottieView
        source={require('../../assets/No-data-user.json')}
        autoPlay
        loop
      />
    </View>
  );
};

const AnalystLeaderboard = React.memo(
  (props: AnalystLeaderboardProps) => {
    const [skip, setskip] = React.useState<number>(0);
    const loadData = async (atEnd: boolean) => {
      const limit = 20;
      switch (props.queryType) {
        case LeaderboardConstants.USER_FOLLOWERS:
          if (props.followers.length > 0 && atEnd && !props.followerLoadMore)
            return;
          if (props.followerStatus.loading) return;

          await props.getFollowers(props.id, atEnd ? skip + limit : 0, atEnd);
          break;
        case LeaderboardConstants.USER_FOLLOWING:
          if (props.following.length > 0 && atEnd && !props.followerLoadMore)
            return;
          if (props.followingStatus.loading) return;
          await props.getFollowing(props.id, atEnd ? skip + limit : 0, atEnd);
          // get following
          break;
        default:
          if (props.leaderboard.length > 0 && atEnd && !props.analystLoadMore)
            return;
          if (props.status.loading) return;
          await props.getLeaderboard(atEnd ? skip + limit : 0, atEnd);
          break;
      }
      if (atEnd) setskip(skip + limit);
    };

    React.useEffect(() => {
      setskip(0);
      void loadData(false);
    }, [props.queryType, props.id]);

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={
            props.queryType === LeaderboardConstants.USER_FOLLOWERS
              ? props.followers
              : props.queryType === LeaderboardConstants.USER_FOLLOWING
              ? props.following
              : props.leaderboard
          }
          refreshControl={
            <RefreshControl
              enabled={true}
              onRefresh={() => {
                setskip(0);
                loadData(false);
              }}
              refreshing={
                (props.status.loading && !props.analystLoadMoreIsLoading) ||
                (props.followerStatus.loading &&
                  !props.followerLoadMoreIsLoading) ||
                (props.followingStatus.loading &&
                  !props.followerLoadMoreIsLoading)
              }
              // refreshing = {props.status.loading || props.followerStatus.loading || props.followingStatus.loading}
            />
          }
          ListEmptyComponent={EmptyListMessage}
          onEndReached={({distanceFromEnd}) => {
            if (
              (props.queryType === LeaderboardConstants.USER_FOLLOWERS &&
                props.followerStatus.loading) ||
              (props.queryType === LeaderboardConstants.USER_FOLLOWING &&
                props.followingStatus.loading) ||
              (props.queryType === LeaderboardConstants.ANALYST_LEADERBOARD &&
                props.status.loading)
            )
              return;
            loadData(true);
          }}
          ListFooterComponent={
            props.analystLoadMoreIsLoading ||
            props.followerLoadMoreIsLoading ||
            props.followerLoadMoreIsLoading ? (
              <ActivityIndicator />
            ) : (
              <></>
            )
          }
          onEndReachedThreshold={0.01}
          keyExtractor={(item: any, index: any) => index.toString()}
          renderItem={({item}) => {
            return (
              <>
                {item && (
                  <LeaderboardItem
                    item={item}
                    setProfileViewId={props.setProfileViewId}
                  />
                )}
              </>
            );
          }}
        />
      </SafeAreaView>
    );
  },
  (prevProps: AnalystLeaderboardProps, nextProps: AnalystLeaderboardProps) => {
    // if(nextProps.status.loading || nextProps.followingStatus.loading || nextProps.followerStatus.loading) return true;
    return false;
  },
);

export default connect(mapStateToProps, mapDispatchToProps)(AnalystLeaderboard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Card: {
    marginHorizontal: 5,
    marginVertical: 3,
  },

  LottieView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: SIZES.width * 1,
    height: SIZES.height * 0.6,
  },
});
