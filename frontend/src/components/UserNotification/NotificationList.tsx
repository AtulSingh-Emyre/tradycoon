import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {SafeAreaView} from 'react-native-safe-area-context';
import {UserNotificationRepository} from '../../services/UserNotification/UserNotificationRepository';
import {UserNotifications} from '../../redux/actions/UserNotificationActions';
import moment from 'moment';
import {
  Avatar,
  Caption,
  Card,
  Colors,
  List,
  Paragraph,
  Title,
  useTheme,
} from 'react-native-paper';
import {theme} from '../../constants/theme';

interface INotificationListStateProps {
  status: {error: boolean; loading: boolean; message: string};
  isAtEndAvailable: boolean;
  isLoadMoreLoading: boolean;
  data: any[];
  userId: string;
}

interface INotificationListDispatchProps {
  dismiss: () => {};
  getNotifs: (
    skip: number,
    limit: number,
    userId: string,
    atEnd: boolean,
  ) => {};
}

const mapStateToProps = ({
  userReducer,
  userNotificationReducer,
}: RootState): INotificationListStateProps => {
  return {
    userId: userReducer.user.parsedData.user.id,
    data: userNotificationReducer.notifs,
    isAtEndAvailable: userNotificationReducer.notifLoadMoreAvailable,
    isLoadMoreLoading: userNotificationReducer.notifLoadMoreIsLoading,
    status: userNotificationReducer.postStatus,
  };
};

const mapDispatchToProps = (dispatch: any): INotificationListDispatchProps => {
  return {
    dismiss: async () =>
      await dispatch(
        await UserNotifications.userNotificationStatusAction(
          false,
          false,
          '',
          false,
        ),
      ),
    getNotifs: async (
      skip: number,
      limit: number,
      userId: string,
      atEnd: boolean,
    ) =>
      dispatch(
        await UserNotificationRepository.getUserNotifications(
          atEnd,
          skip,
          limit,
          userId,
        ),
      ),
  };
};

interface INotificationListProps
  extends INotificationListStateProps,
    INotificationListDispatchProps {}

const NotificationList = (props: INotificationListProps) => {
  // skip
  // onRefresh
  const LIMIT = 30;
  const ITEM_HEIGHT = 200;
  const {colors} = useTheme();
  const [skip, setskip] = React.useState(0);
  React.useEffect(() => {
    setskip(0);
    void onRefresh(false);
    return () => {};
  }, []);
  const onRefresh = async (atEnd: boolean) => {
    if (atEnd && !props.isAtEndAvailable) return;
    props.getNotifs(atEnd ? skip + LIMIT : skip, LIMIT, props.userId, atEnd);
    if (atEnd) setskip(skip + LIMIT);
  };

  const getItemLayout = React.useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );
  const EmptyListMessage = ({item}: any) => {
    return <Title>No new notification !</Title>;
  };
  const flatListRenderItemNotifaction = ({item, index}: any) => {
    return (
      <Card style={{margin: 0.5, padding: 4}}>
        <Card.Title
          key={index + 1}
          title={item.message}
          subtitle={moment(item.created_at).startOf('minutes').fromNow()}
          titleStyle={styles.description}
          titleNumberOfLines={4}
          subtitleStyle={styles.description}
          left={props => (
            <Avatar.Image
              {...props}
              size={70}
              style={{alignSelf: 'center'}}
              source={
                item.sender.avatar
                  ? {uri: item.sender.avatar}
                  : require('../../assets/No-User-Avatar.jpeg')
              }
            />
          )}
        />
      </Card>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <FlatList
          initialNumToRender={LIMIT}
          maxToRenderPerBatch={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any, index: any) => index.toString()}
          data={props.data}
          getItemLayout={getItemLayout}
          ListEmptyComponent={EmptyListMessage}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                setskip(0);
                onRefresh(false);
              }}
              refreshing={props.status?.loading && !props.isLoadMoreLoading}
            />
          }
          onEndReached={({distanceFromEnd}) => {
            if (props.status?.loading) return;
            onRefresh(true);
          }}
          onEndReachedThreshold={0.75}
          ListFooterComponent={
            props.isLoadMoreLoading ? <ActivityIndicator /> : <></>
          }
          renderItem={flatListRenderItemNotifaction}
        />
      </SafeAreaView>
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    fontSize: 12,
    marginHorizontal: 14,
    lineHeight: 18,
  },
});
