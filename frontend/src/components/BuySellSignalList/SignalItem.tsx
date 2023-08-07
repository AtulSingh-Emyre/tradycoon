/* eslint-disable @typescript-eslint/ban-types */
import * as React from 'react';
import {useRef, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {View} from 'react-native-animatable';
import moment from 'moment';
import {
  Card,
  Title,
  Text,
  Colors,
  DataTable,
  Caption,
  Divider,
  ToggleButton,
  Button,
  TextInput,
  useTheme,
} from 'react-native-paper';
import ViewShot, {captureRef} from 'react-native-view-shot';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ISignalItem} from '../../models/buySellsignal';
import {Gwidth} from '../../styles/Global';
import Share from 'react-native-share';
import * as RNFS from 'react-native-fs';
import {RootState} from '../../redux/reducers';
import {AnalystBuySellRepositry} from '../../services/SignalPost/SignalPostRepository';
import {connect} from 'react-redux';
import {CommonActions, useNavigation} from '@react-navigation/native';
//import Button from '../../templates/Button';
import {SignalViewQueries} from '../../constants/signalViewConstants';
import {SIZES} from '../../styles/theme';
import {SignInErrors} from '../../error/auth/LoginError';
import {Screen, ScreenNames} from '../../navigation/RootNavigation';
import {UserProfileRepository} from '../../services/UserProfile/UserProfileRepository';
import {Http} from '../../services/http';
interface ISignalItemView {
  userId: string;
}

interface ISignalItemViewDispatch {
  likePost: Function;
  archivePost: (postId: string, archive: boolean) => any;
  editPost: Function;
  deletePost: Function;
  setProfileViewId: (id: string) => {};
}

const mapStateToProps = ({userReducer}: RootState): ISignalItemView => {
  return {
    userId: userReducer.user.parsedData.user.id,
  };
};

const mapDispatchToProps = (dispatch: any): ISignalItemViewDispatch => {
  return {
    likePost: async (userId: string, postId: string, like: boolean) =>
      await dispatch(
        await AnalystBuySellRepositry.likePost(userId, postId, like),
      ),
    archivePost: async (postId: string, archive: boolean) =>
      await dispatch(
        await AnalystBuySellRepositry.archivePost(postId, archive),
      ),
    deletePost: async (postId: string) =>
      await dispatch(await AnalystBuySellRepositry.deletePost(postId)),
    editPost: async (postId: string, data: any, name: string) =>
      await dispatch(
        await AnalystBuySellRepositry.patchPost(postId, data, name),
      ),
    setProfileViewId: async (id: string) =>
      dispatch(await UserProfileRepository.getUserProfileById(id)),
  };
};

export interface IProps extends ISignalItemView, ISignalItemViewDispatch {
  signalItem: ISignalItem;
  signalQuery: string;
  isEditSignal: boolean;
}

const SignalItem = (props: IProps) => {
  const theme = useTheme();
  const viewShot = useRef<any>(null);
  const navigation = useNavigation();
  const [customAchievedValText, setCustomAchievedValText] = React.useState('');
  const [like, setLike] = useState(props.signalItem.isLike);
  const [save, setSave] = useState(props.signalItem.isArchives);
  const [customAchievedVal, setCustomAchievedVal] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [archiveCount, setArchiveCount] = useState(0);
  React.useEffect(() => {
    setLike(props.signalItem.isLike);
    setSave(props.signalItem.isArchives);
    setLikeCount(props.signalItem.likeCount);
    setArchiveCount(props.signalItem.archiveCount);
  }, [
    props.signalItem.isLike,
    props.signalItem.isArchives,
    props.signalItem.archiveCount,
    props.signalItem.likeCount,
  ]);
  // Event handlers
  // Like and unlike
  const likeHandler = async () => {
    const res = await props.likePost(props.userId, props.signalItem._id, !like);
    if (res.success) {
      if (like) setLikeCount(likeCount - 1);
      else setLikeCount(likeCount + 1);
      setLike(!like);
    } else Http.handleErrors({});
  };

  // Archiving
  const onSave = async () => {
    const signalItem: ISignalItem = props.signalItem;
    const res = await props.archivePost(signalItem._id, !save);
    if (res.success) {
      if (save) setArchiveCount(archiveCount - 1);
      else setArchiveCount(archiveCount + 1);
      setSave(!save);
    } else Http.handleErrors({});
  };

  // Editing signal post
  const onEditHandler = () => {
    const signalItem: ISignalItem = props.signalItem;
    navigation.dispatch(
      CommonActions.navigate(Screen.SIGNAL_BUY_SELL_POST_STACKSCREEN, {
        screen: 'Create Signal',
        params: {item: signalItem, key: new Date().toString()},
      }),
    );
  };

  // Deletion of signal post
  const deletePostHandler = () => {
    props.deletePost(props.signalItem._id);
    // return (
    //     <ConformationDialog
    //       isVisible={true}
    //       ConformBtn={() => console.log('sdfasas')}></ConformationDialog>
    // );
  };

  const setAchievedValHandler = async (val: string) => {
    try {
      if (val !== 'C') {
        await props.editPost(
          props.signalItem._id,
          {
            ...props.signalItem,
            achievedValue: val !== '' ? val : 'C',
            achievedPrice: calculateAchievedVal(val),
            isActive: false,
          },
          props.signalItem.analystName,
        );
      } else {
        setCustomAchievedVal('C');
      }
    } catch (error) {}
  };

  const calculateAchievedVal = (val: string) => {
    if (val === 'T1') {
      const T1 =
        ((props.signalItem.T1 - props.signalItem.price) * 100) /
        props.signalItem.price;
      return props.signalItem.buy ? T1.toFixed(1) : -T1.toFixed(1);
    } else if (val === 'T2') {
      const T2 =
        ((props.signalItem.T2 - props.signalItem.price) * 100) /
        props.signalItem.price;
      return props.signalItem.buy ? T2.toFixed(1) : -T2.toFixed(1);
    } else if (val === 'SL') {
      const SL =
        ((props.signalItem.SL - props.signalItem.price) * 100) /
        props.signalItem.price;
      return props.signalItem.buy ? SL.toFixed(1) : -SL.toFixed(1);
    } else {
      const C =
        ((+customAchievedValText - props.signalItem.price) * 100) /
        props.signalItem.price;
      return props.signalItem.buy
        ? +customAchievedValText >= props.signalItem.price
          ? C.toFixed(1)
          : C.toFixed(1)
        : +customAchievedValText >= props.signalItem.price
        ? -C.toFixed(1)
        : -C.toFixed(1);
    }
  };

  const headerLengthCount = (
    props.signalItem.stockName +
    props.signalItem.comparator +
    props.signalItem.price
  ).length;

  const onCapture = async () => {
    // setIsShare(true);
    const uri = await captureRef(viewShot, {
      format: 'png',
      quality: 0.9,
    });
    RNFS.readFile(uri, 'base64')
      .then(res => {
        const urlString = 'data:image/png;base64,' + res;
        const options = {
          title: 'Tradycoon',
          message:
            'Hey please check this app for Live Buy Sell trading Signal. https://play.google.com/store/apps/details?id=com.tradycoon.app',
          url: urlString,
          type: 'image/png',
        };
        Share.open(options).catch(err => {
          // err && console.log(err);
          // setIsShare(false);
        });
      })
      .catch(() => {
        // console.log(SignInErrors.UNKNOWN_ERROR);
        // setIsShare(false);
      });
  };
  const profileNavigationHandler = () => {
    switch (props.signalQuery) {
      case SignalViewQueries.OWN_PROFILE_PAGE:
        // If user is already at profile screen, do this
        props.setProfileViewId(props.signalItem.analyst);
        navigation.dispatch(
          CommonActions.navigate(ScreenNames.PROFILEDETAILS, {
            screen: ScreenNames.PROFILEDETAILS,
          }),
        );
        return;
      default:
        props.setProfileViewId(props.signalItem.analyst);
        navigation.dispatch(
          CommonActions.navigate(ScreenNames.PROFILEDETAILS, {
            screen: ScreenNames.PROFILEDETAILS,
          }),
        );
        return;
    }
  };
  return (
    <ViewShot ref={viewShot} style={styles.surface}>
      <Card>
        <Card.Content>
          <View
            style={[
              styles.active,
              {
                backgroundColor: theme.colors.background,
                borderColor: props.signalItem.isActive
                  ? theme.colors.notification
                  : theme.colors.primary,
                borderWidth: 0.5,
              },
            ]}>
            <Icon
              name={props.signalItem.isActive ? 'bell-ring' : 'bell-check'}
              size={20}
              color={
                props.signalItem.isActive
                  ? theme.colors.notification
                  : theme.colors.disabled
              }
              style={{margin: 2}}
            />
            <Caption>
              {props.signalItem.isFree ? <Text>Free</Text> : <Text>Paid</Text>}
            </Caption>
          </View>
          <Caption style={styles.Possibility}>
            Win Possibility : <Text>{props.signalItem.possibility} %</Text>
          </Caption>
          <Text
            style={[
              styles.isIntraday,
              {
                backgroundColor: theme.colors.background,
                borderColor: props.signalItem.buy
                  ? Colors.green500
                  : Colors.red500,
                borderWidth: 0.5,
              },
            ]}>
            <Text style={styles.centerText}>
              {props.signalItem.isIntraday ? 'Intraday' : 'Longterm'}
            </Text>
            {'\n'}
            <Text
              style={{
                color: props.signalItem.buy ? Colors.green500 : Colors.red500,
                fontWeight: 'bold',
              }}>
              {props.signalItem.buy ? 'BUY' : 'SELL'}
            </Text>
          </Text>
          <View style={styles.row}>
            <Title
              style={[
                styles.topheader,
                headerLengthCount > 25 ? styles.font14wrap : styles.font18,
              ]}>
              {props.signalItem.stockName}{' '}
              <Caption>{props.signalItem.comparator}</Caption>{' '}
              {props.signalItem.price}
            </Title>
          </View>
          <Caption style={styles.headerTime}>
            <Text>
              {moment(props.signalItem.updated_at).startOf('minutes').fromNow()}
            </Text>
          </Caption>
          <DataTable style={styles.DataTable}>
            <DataTable.Header>
              <DataTable.Title>Target-1</DataTable.Title>
              {props.signalItem.T2 && (
                <DataTable.Title>Target-2</DataTable.Title>
              )}
              <DataTable.Title>Stop Loss</DataTable.Title>
              {!props.signalItem.isActive && (
                <DataTable.Title numeric>Achieved</DataTable.Title>
              )}
            </DataTable.Header>
            <DataTable.Row style={{borderBottomWidth: 1}}>
              <DataTable.Cell>{props.signalItem.T1}</DataTable.Cell>
              {props.signalItem.T2 && (
                <DataTable.Cell>{props.signalItem.T2}</DataTable.Cell>
              )}
              <DataTable.Cell>{props.signalItem.SL}</DataTable.Cell>
              {!props.signalItem.isActive && (
                <DataTable.Title numeric>
                  {props.signalItem.achievedValue}(
                  <Text
                    style={{
                      color:
                        props.signalItem.achievedPrice > 0
                          ? Colors.green500
                          : Colors.red400,
                    }}>
                    {props.signalItem.achievedPrice} %
                  </Text>
                  )
                </DataTable.Title>
              )}
            </DataTable.Row>
          </DataTable>
          <View style={styles.row}>
            <View style={Gwidth.width50}>
              <Caption allowFontScaling={true} numberOfLines={1}>
                By :{' '}
                <Caption
                  onPress={profileNavigationHandler}
                  style={{color: theme.colors.primary}}>
                  {props.signalItem.analystName}
                </Caption>
              </Caption>
              <Caption>
                {props.signalItem.isActive ? 'Valid' : 'Closed'} :{' '}
                <Text>
                  {moment(props.signalItem.validTill).format('DD-MM-YYYY')}
                </Text>
              </Caption>
            </View>
            {!props.isEditSignal && (
              <View style={[styles.signalUserActivityBtn, Gwidth.width40]}>
                <TouchableOpacity
                  style={{alignItems: 'center'}}
                  onPress={onSave}>
                  <Icon
                    name={save ? 'star' : 'star-outline'}
                    size={26}
                    color={theme.colors.primary}
                  />
                  <Caption
                    allowFontScaling={true}
                    numberOfLines={1}
                    style={{
                      width: 40,
                      textAlign: 'center',
                    }}>
                    {archiveCount}
                  </Caption>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{alignItems: 'center'}}
                  onPress={likeHandler}>
                  <Icon
                    name={like ? 'heart' : 'heart-outline'}
                    size={26}
                    color={Colors.pinkA400}
                  />
                  <Caption
                    allowFontScaling={true}
                    numberOfLines={1}
                    style={{
                      width: 40,
                      textAlign: 'center',
                    }}>
                    {likeCount}
                  </Caption>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{alignItems: 'center'}}
                  onPress={onCapture}>
                  <Icon
                    name="share-variant"
                    size={26}
                    color={Colors.amberA400}
                  />
                  <Caption
                    allowFontScaling={true}
                    numberOfLines={1}
                    style={{
                      width: 40,
                      textAlign: 'center',
                    }}>
                    Share
                  </Caption>
                </TouchableOpacity>
              </View>
            )}
            {props.isEditSignal && (
              <ToggleButton.Row
                style={Gwidth.width50}
                onValueChange={(val: string) => {
                  setAchievedValHandler(val);
                }}
                value={props.signalItem.achievedValue}>
                <ToggleButton
                  disabled={!props.signalItem.isActive}
                  icon={() => <Caption>T1</Caption>}
                  value="T1"
                />
                {props.signalItem.T2 && (
                  <ToggleButton
                    disabled={!props.signalItem.isActive}
                    icon={() => <Caption>T2</Caption>}
                    value="T2"
                  />
                )}
                <ToggleButton
                  disabled={!props.signalItem.isActive}
                  icon={() => <Caption>SL</Caption>}
                  value="SL"
                />
                <ToggleButton
                  disabled={!props.signalItem.isActive}
                  icon={() => <Caption>C</Caption>}
                  value="C"
                />
              </ToggleButton.Row>
            )}
          </View>
          {props.signalItem.description !== '' && (
            <Caption
              allowFontScaling={true}
              numberOfLines={1}
              style={styles.note}>
              Note : <Text>{props.signalItem.description}</Text>
            </Caption>
          )}
        </Card.Content>
        <Divider />
        {props.isEditSignal &&
          props.userId === props.signalItem.analyst &&
          props.signalItem.isActive && (
            <Card.Actions>
              <Button
                compact={true}
                labelStyle={{color: Colors.green400}}
                onPress={onEditHandler}>
                Edit
              </Button>
              <Button
                compact={true}
                labelStyle={{color: Colors.red400}}
                onPress={deletePostHandler}>
                Delete
              </Button>
              {customAchievedVal == 'C' && (
                <View style={Gwidth.width30}>
                  <TextInput
                    mode={'outlined'}
                    dense={true}
                    value={customAchievedValText}
                    keyboardType="phone-pad"
                    onChangeText={customAchievedValText =>
                      setCustomAchievedValText(customAchievedValText)
                    }
                  />
                </View>
              )}
              {customAchievedVal == 'C' && (
                <Button
                  compact={true}
                  onPress={() => setAchievedValHandler('')}>
                  Custom
                </Button>
              )}
            </Card.Actions>
          )}
      </Card>
    </ViewShot>
  );
};

const styles = StyleSheet.create({
  surface: {
    marginHorizontal: 2,
    marginVertical: 4,
  },
  topheader: {
    paddingTop: 16,
  },
  signalUserActivityBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    maxWidth: 150,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  red: {
    backgroundColor: Colors.red400,
  },
  green: {
    backgroundColor: Colors.green500,
  },
  comparator: {
    marginTop: 10,
    marginHorizontal: 8,
  },
  Link: {
    color: Colors.blue400,
  },
  createdBy: {
    flexDirection: 'row',
  },
  isIntraday: {
    position: 'absolute',
    textAlign: 'center',
    right: 0,
    top: 0,
    paddingHorizontal: 4,
    borderRadius: 2,
    height: 40,
    width: 80,
    flexDirection: 'column',
  },
  headerTime: {
    position: 'absolute',
    textAlign: 'center',
    right: 0,
    top: 40,
  },
  centerText: {
    textAlign: 'center',
    // color: Colors.black,
  },
  font14wrap: {
    width: '75%',
    fontSize: 14,
  },
  font18: {
    fontSize: 18,
  },
  likebtn: {
    marginHorizontal: 10,
  },
  active: {
    //backgroundColor: Colors.green500,
    position: 'absolute',
    paddingHorizontal: 4,
    flexDirection: 'row',
    left: 0,
    top: 0,
    borderRadius: 2,
    borderColor: Colors.black,
  },
  DeActive: {
    backgroundColor: Colors.amberA400,
    position: 'absolute',
    paddingHorizontal: 6,
    alignItems: 'flex-start',
    left: 0,
    top: 0,
    borderRadius: 2,
    borderColor: Colors.black,
  },
  Possibility: {
    position: 'absolute',
    alignItems: 'center',
    textAlign: 'center',
    left: SIZES.width * 0.3,
    right: SIZES.width * 0.3,
    top: 0,
    borderRadius: 2,
  },
  DataTable: {
    marginTop: -10,
    alignContent: 'flex-start',
  },
  isActiveFont: {
    color: Colors.black,
  },
  note: {
    marginTop: -5,
  },
  tradyImage: {
    width: SIZES.width * 0.4,
    height: SIZES.height / 40,
  },
  tradyImageContainer: {
    alignItems: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SignalItem);

// export default SignalItem;
