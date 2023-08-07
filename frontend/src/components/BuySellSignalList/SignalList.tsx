import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import SignalItem from './SignalItem';
import {ISignalItem} from '../../models/buySellsignal';
import {ActivityIndicator, Chip, Colors, Text, Title} from 'react-native-paper';
import {RootState} from '../../redux/reducers';
import {connect} from 'react-redux';
import {AnalystBuySellRepositry} from '../../services/SignalPost/SignalPostRepository';
import {SignalViewQueries} from '../../constants/signalViewConstants';
import LottieView from 'lottie-react-native';
import {SIZES} from '../../styles/theme';
// import ActivityIndicatorloader from '../../templates/ActivityIndicatorloader';
import LoadMoreLoader from './LoadMoreLoader';

interface ISignalItemView {
  userId: string;
  profileId: string;
  analystLoadMore: boolean;
  signalViewIsLoading: boolean;
  archiveLoadMore: boolean;
  postLoadMore: boolean;
  signalViewLoadMoreIsLoading: boolean;
}

interface ISignalItemViewDispatch {
  getSignalPosts: (
    userQuery: {
      isUser?: boolean;
      id?: string;
    },
    optionsQuery: {skip: number; limit: number; archives: boolean},
    timeQuery: {
      isAll?: boolean;
      isIntraday?: boolean;
      isInterday?: boolean;
    },
    atEnd: boolean,
  ) => {};
  setRefreshing: Function;
  getArchivedPost: Function;
  getAnalystpost: Function;
  getAnalystProfilePost: Function;
}

const mapStateToProps = ({
  userReducer,
  archiveReducer,
  signalViewReducer,
  userProfileViewReducer,
}: RootState): ISignalItemView => {
  return {
    userId: userReducer.user.parsedData.user.id,
    analystLoadMore: signalViewReducer.analystLoadMore,
    postLoadMore: signalViewReducer.postLoadMore,
    archiveLoadMore: archiveReducer.archiveLoadMore,
    signalViewIsLoading: signalViewReducer.signalViewStatus.refreshing,
    signalViewLoadMoreIsLoading: signalViewReducer.signalViewLoadMoreLoading,
    profileId: userProfileViewReducer.userId,
  };
};

const mapDispatchToProps = (dispatch: any): ISignalItemViewDispatch => {
  return {
    getSignalPosts: async (
      userQuery: {
        isUser?: boolean;
        id?: string;
      },
      optionsQuery: {skip: number; limit: number; archives: boolean},
      timeQuery: {
        isAll?: boolean;
        isIntraday?: boolean;
        isInterday?: boolean;
        isActive?: boolean;
        isNotActive?: boolean;
      },
      atEnd: boolean,
    ) =>
      await dispatch(
        await AnalystBuySellRepositry.getSignalsByType(
          userQuery,
          optionsQuery,
          timeQuery,
          atEnd,
        ),
      ),
    getAnalystpost: async (
      userQuery: {
        isUser?: boolean;
        id?: string;
      },
      optionsQuery: {skip: number; limit: number; archives: boolean},
      timeQuery: {
        isAll?: boolean;
        isIntraday?: boolean;
        isInterday?: boolean;
      },
      atEnd: boolean,
    ) =>
      await dispatch(
        await AnalystBuySellRepositry.getAnalystSignals(
          userQuery,
          optionsQuery,
          timeQuery,
          atEnd,
        ),
      ),

    getAnalystProfilePost: async (
      userQuery: {
        isUser?: boolean;
        id?: string;
        isAnalystProfile: boolean;
        userId: string;
      },
      optionsQuery: {skip: number; limit: number; archives: boolean},
      timeQuery: {
        isAll?: boolean;
        isIntraday?: boolean;
        isInterday?: boolean;
      },
      atEnd: boolean,
    ) =>
      await dispatch(
        await AnalystBuySellRepositry.getSignalsByType(
          userQuery,
          optionsQuery,
          timeQuery,
          atEnd,
        ),
      ),
    setRefreshing: async (refreshing: boolean) =>
      await dispatch(
        await AnalystBuySellRepositry.setSignalViewRefreshing(refreshing),
      ),
    getArchivedPost: async (id: string, skip: number, atEnd: boolean) =>
      await dispatch(
        await AnalystBuySellRepositry.getArchivePost(id, skip, atEnd),
      ),
  };
};

export interface IProps extends ISignalItemViewDispatch, ISignalItemView {
  signalItems: ISignalItem[];
  isEdit: boolean;
  // refreshing: boolean;
  queryType: string;
  showChip: boolean;
}
const SignalList = React.memo(
  (props: IProps) => {
    const [skip, setskip] = useState(0);
    const [chipIndex, setChipIndex] = useState(0);
    const [Query, setQuery] = useState({
      isIntraday: false,
      isInterday: false,
      isAll: true,
      isActive: true,
      isNotActive: true,
    });
    useEffect(() => {
      setskip(0);
      onRefreshSignalItems(false);
    }, [Query]);

    const chipItem = ['All', 'Intraday', 'Longterm', 'Active', 'Deactive'];

    const changeSignalItemChipHandler = (item: any) => {
      if (item == chipItem[1]) {
        setQuery({
          isIntraday: true,
          isInterday: false,
          isAll: false,
          isActive: true,
          isNotActive: true,
        });
      } else if (item == chipItem[2]) {
        setQuery({
          isIntraday: false,
          isInterday: true,
          isAll: false,
          isActive: true,
          isNotActive: true,
        });
      } else if (item == chipItem[0]) {
        setQuery({
          isIntraday: false,
          isInterday: false,
          isAll: true,
          isActive: true,
          isNotActive: true,
        });
      } else if (item == chipItem[3]) {
        setQuery({
          isIntraday: false,
          isInterday: false,
          isAll: true,
          isActive: true,
          isNotActive: false,
        });
      } else if (item == chipItem[4]) {
        setQuery({
          isIntraday: false,
          isInterday: false,
          isAll: true,
          isActive: false,
          isNotActive: true,
        });
      }
    };

    // handling of querying the data from backend shall be done here. This is to prevent unnecessary amount of useeffects in parent component
    const onRefreshSignalItems = async (atEnd: boolean) => {
      const getArchives = async () => {
        try {
          await props.getArchivedPost(
            props.profileId,
            atEnd ? skip + 15 : 0,
            atEnd,
          );
        } catch (error) {
          props.setRefreshing(false);
        }
      };
      const getAnalystProfileSignalPosts = async () => {
        await props.getAnalystProfilePost(
          {
            isUser: true,
            id: props.profileId,
            isAnalystProfile: true,
            userId: props.userId,
          },
          {skip: atEnd ? skip + 15 : 0, limit: 15, archives: true},
          {isAll: true},
          atEnd,
        );
      };
      const getAnalystSignalPosts = async () => {
        await props.getAnalystpost(
          {isUser: true, id: props.userId},
          {skip: atEnd ? skip + 15 : 0, limit: 15, archives: false},
          {isAll: true},
          atEnd,
        );
      };
      const getSignalPosts = async (force = false) => {
        try {
          await props.getSignalPosts(
            {isUser: false, id: props.userId},
            {limit: 15, skip: atEnd ? skip + 15 : 0, archives: false},
            Query,
            atEnd,
          );
        } catch (e) {
          props.setRefreshing(false);
        }
      };
      switch (props.queryType) {
        case SignalViewQueries.OWN_PROFILE_PAGE:
          if (atEnd && !props.archiveLoadMore) break;
          await getArchives();
          break;
        case SignalViewQueries.ANALYST_SIGNAL_VIEW_PAGE:
          if (atEnd && !props.analystLoadMore) break;
          await getAnalystSignalPosts();
          break;
        case SignalViewQueries.ANALYST_PROFILE_PAGE:
          if (atEnd && !props.postLoadMore) break;
          await getAnalystProfileSignalPosts();
          break;
        default:
          if (atEnd && !props.postLoadMore) break;
          await getSignalPosts(true);
          break;
      }
      if (atEnd && props.signalItems?.length > 0) {
        setskip(skip + 15);
      }
    };

    const ITEM_HEIGHT = 200;
    const getItemLayout = useCallback(
      (data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      }),
      [],
    );
    const EmptyListMessage = ({item}: any) => {
      return (
        <View style={styles.LottieView}>
          <LottieView
            source={require('../../assets/No-data-Signal.json')}
            autoPlay
            loop
          />
        </View>
      );
    };

    const getListHeaderComponent = () => {
      return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {props.showChip &&
            chipItem.map((item, index) => {
              return (
                <Chip
                  key={index}
                  mode="flat"
                  selectedColor={
                    item == chipItem[chipIndex] ? Colors.white : Colors.black
                  }
                  style={[
                    styles.chipItem,
                    item == chipItem[chipIndex]
                      ? styles.selecrdchipbackcolor
                      : styles.chipbackcolor,
                  ]}
                  icon={
                    item == chipItem[chipIndex]
                      ? 'checkbox-marked-circle'
                      : 'checkbox-blank-circle'
                  }
                  onPress={() => {
                    setChipIndex(index), changeSignalItemChipHandler(item);
                  }}>
                  {item}
                </Chip>
              );
            })}
        </ScrollView>
      );
    };

    return (
      <FlatList
        ListHeaderComponent={getListHeaderComponent}
        initialNumToRender={20}
        maxToRenderPerBatch={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item: any, index: any) => index.toString()}
        data={props.signalItems}
        getItemLayout={getItemLayout}
        ListEmptyComponent={EmptyListMessage}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              setskip(0);
              onRefreshSignalItems(false);
            }}
            refreshing={
              props.signalViewIsLoading && !props.signalViewLoadMoreIsLoading
            }
          />
        }
        onEndReached={({distanceFromEnd}) => {
          if (props.signalViewIsLoading) return;
          onRefreshSignalItems(true);
        }}
        onEndReachedThreshold={0.75}
        ListFooterComponent={
          props.signalViewLoadMoreIsLoading ? <ActivityIndicator /> : <></>
        }
        renderItem={(data: any) => {
          return (
            <SignalItem
              isEditSignal={props.isEdit}
              signalItem={data.item}
              signalQuery={props.queryType}
            />
          );
        }}
      />
    );
  },
  (prevProps: IProps, nextProps: IProps) => {
    return false;
  },
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  footer: {
    padding: 10,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  emptyListStyle: {
    padding: 10,
    textAlign: 'center',
  },
  chipItem: {
    marginHorizontal: 4,
    marginVertical: 5,
  },
  selecrdchipbackcolor: {
    backgroundColor: Colors.green500,
  },
  chipbackcolor: {
    backgroundColor: Colors.white,
  },
  LottieView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SIZES.width * 1,
    height: SIZES.height * 0.6,
  },
});

// SignalList.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SignalList);
