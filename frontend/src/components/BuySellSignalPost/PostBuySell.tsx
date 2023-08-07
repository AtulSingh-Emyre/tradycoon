import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import TextInput from '../../templates/TextInput';
import {gStyles, Gwidth} from '../../styles/Global';

import {
  Badge,
  Caption,
  Chip,
  RadioButton,
  Subheading,
  ToggleButton,
  Colors,
  useTheme,
} from 'react-native-paper';
import Button from '../../templates/Button';
import {connect} from 'react-redux';
import {AnalystBuySellRepositry} from '../../services/SignalPost/SignalPostRepository';
import {RootState} from '../../redux/reducers';
import {PostBuySellFieldValidator} from './PostBuySellFieldValidator';
import {DataValidator} from '../../error/SignalPosts/SignalPostError';
import {AnalystPostBuySellActions} from '../../redux/actions/AnalystPostBuySellAction';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Snackbar from '../../templates/Snackbar';
import {ISignalItem} from '../../models/buySellsignal';
import {UserGroupRepositry} from '../../services/UserGroup/UserGroupRepository';
import {UserGroupActions} from '../../redux/actions/user-groups/UserGroupActions';
import {
  RootStackParamListMain,
  ScreenNames,
} from '../../navigation/RootNavigation';
import {StackScreenProps} from '@react-navigation/stack';

type ScreenProps = StackScreenProps<
  RootStackParamListMain,
  typeof ScreenNames.SIGNALBUYSELLPOST
>;

interface ISignupProps {
  isLoggedIn: boolean;
  clientGroups: Array<any>;
  getGroupListStatus: {
    error: boolean;
    loading: boolean;
    message: string;
  };
  name: string;
  getPostsStatus: {
    error: boolean;
    status: number;
    message: string;
  };
  role: any;
  isLoading: boolean;
}

interface ISignalPostDispatchProps {
  savePost: Function;
  dismiss: Function;
  editPost: Function;
  getGroupsList: Function;
  getGroupListErrorDismiss: Function;
}

interface IPostBuySellProps extends ISignalPostDispatchProps, ISignupProps {
  id: string;
  item?: ISignalItem;
  navigation?: ScreenProps;
  route?: any;
}

const mapStateToProps = ({
  signalPostReducer,
  userReducer,
  userGroupReducer,
}: RootState): ISignupProps => {
  return {
    isLoggedIn: userReducer.loggedIn,
    getGroupListStatus: userGroupReducer.initializationStatus,
    getPostsStatus: signalPostReducer.status,
    role: userReducer.user.parsedData.role[0],
    clientGroups: userGroupReducer.groups,
    isLoading: signalPostReducer.isLoading,
    name: userReducer.user.parsedData.user?.name
      ? userReducer.user.parsedData.user?.name
      : '',
  };
};

const mapDispatchToProps = (dispatch: any): ISignalPostDispatchProps => {
  return {
    getGroupsList: async () =>
      dispatch(await UserGroupRepositry.getGroupDetails()),
    savePost: async (userData: any, name: string) => {
      return await dispatch(
        await AnalystBuySellRepositry.saveNewPost(userData, name),
      );
    },
    getGroupListErrorDismiss: async () =>
      await dispatch(
        await UserGroupActions.InitializeGroupStatusAction(false, false, ''),
      ),
    editPost: async (postId: string, data: any, name: string) =>
      await dispatch(
        await AnalystBuySellRepositry.patchPost(postId, data, name),
      ),
    dismiss: async () => {
      return await dispatch(
        AnalystPostBuySellActions.PostRequestErrorAction({
          error: false,
          message: '',
          status: 200,
        }),
      );
    },
  };
};

const PostBuySell = (props: IPostBuySellProps) => {
  const theme = useTheme();
  const [localLoader, setLocalLoader] = useState({
    editSignalLoad: false,
    postSignalLoad: false,
  });
  const [buySellValue, setBuySellValue] = useState('0');
  const [intradayLongtermValue, setIntradayLongtermValue] = useState('0');
  const [buySellPost, setBuySellPost] = React.useState({
    stockName: '',
    price: '',
    buy: true,
    comparator: 'Equal',
    T1: '',
    T2: '',
    T3: '',
    SL: '',
    confidence: 50,
    description: '',
    isIntraday: true,
    validTill: new Date(),
    subscriptionPrice: 0,
    isFree: true,
  });
  const [IsEdit, setIsEdit] = useState(false);
  const [callTypeValue, setCallTypeValue] = useState('0');
  const [tillValidshow, settillValidshow] = useState(false);
  const [changeChipdata, setchangeChipItemdata] = useState<string[]>([]);
  const [fieldError, setfieldError] = useState({
    stockName: false,
    target1: false,
    target2: false,
    price: false,
    stopLoss: false,
  });

  useEffect(() => {
    void props.getGroupsList();
    // load user groups
  }, []);

  const buySellPostItem = props.route.params?.item;
  const key = props.route.params?.key;
  useEffect(() => {
    if (buySellPostItem) {
      setIsEdit(true);
      setBuySellPost({
        stockName: buySellPostItem?.stockName || '',
        price: buySellPostItem?.price || '',
        buy: buySellPostItem?.buy ? buySellPostItem?.buy : true,
        comparator: buySellPostItem?.comparator || 'Equal',
        T1: buySellPostItem?.T1 || '',
        T2: buySellPostItem?.T2 || '',
        T3: buySellPostItem?.price || '',
        SL: buySellPostItem?.SL || '',
        confidence: buySellPostItem?.possibility || 50,
        description: buySellPostItem?.description || '',
        isIntraday: buySellPostItem ? buySellPostItem?.isIntraday : true,
        validTill: buySellPostItem?.validTill || new Date(),
        subscriptionPrice: buySellPostItem?.subscriptionPrice || 0,
        isFree: buySellPostItem ? buySellPostItem.isFree : true,
      });
      setchangeChipItemdata(buySellPostItem.subscibeClient);
      setCallTypeValue(buySellPostItem.isFree ? '0' : '1');
      setBuySellValue(buySellPostItem.buy ? '0' : '1');
      setIntradayLongtermValue(buySellPostItem.isIntraday ? '0' : '1');
    }
  }, [buySellPostItem, key]);

  const submitHandler = async () => {
    setLocalLoader({...localLoader, postSignalLoad: true});
    if (validateFieldEntries()) {
      const newPost = {
        stockName: buySellPost.stockName,
        price: parseFloat(buySellPost.price).toFixed(2),
        buy: buySellPost.buy,
        comparator: buySellPost.comparator,
        T1: parseFloat(buySellPost.T1).toFixed(2),
        T2: parseFloat(buySellPost.T2).toFixed(2),
        T3: parseFloat(buySellPost.T3).toFixed(2),
        SL: parseFloat(buySellPost.SL).toFixed(2),
        possibility: buySellPost.confidence,
        description: buySellPost.description,
        isIntraday: buySellPost.isIntraday,
        validTill: buySellPost.validTill.toString(),
        subscibeClient: buySellPost.isFree ? [] : changeChipdata,
        subscriptionPrice: buySellPost.subscriptionPrice,
        isFree: buySellPost.isFree,
      };
      setchangeChipItemdata([]);

      await props.savePost(newPost, props.name);
      clear();
      setLocalLoader({postSignalLoad: false, editSignalLoad: false});
    }
  };
  const editHandler = async () => {
    // check for all cases
    setLocalLoader({...localLoader, editSignalLoad: true});
    if (validateFieldEntries()) {
      const newPost = {
        stockName: buySellPost.stockName,
        price: parseFloat(buySellPost.price).toFixed(2),
        buy: buySellPost.buy,
        comparator: buySellPost.comparator,
        T1: parseFloat(buySellPost.T1).toFixed(2),
        T2: parseFloat(buySellPost.T2).toFixed(2),
        T3: parseFloat(buySellPost.T3).toFixed(2),
        SL: parseFloat(buySellPost.SL).toFixed(2),
        possibility: buySellPost.confidence,
        description: buySellPost.description,
        isIntraday: buySellPost.isIntraday,
        validTill: buySellPost.validTill.toString(),
        subscibeClient: buySellPost.isFree ? [] : changeChipdata,
        subscriptionPrice: buySellPost.subscriptionPrice,
        isFree: buySellPost.isFree,
        isActive: true,
      };
      // edit the post and then clear the post fields
      // edit the post and then clear the post fields
      await props.editPost(buySellPostItem._id, newPost, props.name);
      clear();

      // await props.route.params?.refresh();
    }
    setLocalLoader({...localLoader, editSignalLoad: false});
  };
  const validateFieldEntries = (): boolean => {
    if (PostBuySellFieldValidator.entryIsEmpty(buySellPost.stockName)) {
      setfieldError({...fieldError, stockName: true});
      return false;
    } else if (buySellPost.price === '') {
      setfieldError({...fieldError, price: true});
      return false;
    } else if (buySellPost.T1 === '') {
      setfieldError({...fieldError, target1: true});
      return false;
    } else if (buySellPost.SL === '') {
      setfieldError({...fieldError, stopLoss: true});
      return false;
    } else if (fieldError.target2) return false;
    return true;
  };
  const clear = () => {
    setCallTypeValue('0');
    setBuySellPost({
      stockName: '',
      price: '',
      buy: true,
      comparator: 'Equal',
      T1: '',
      T2: '',
      T3: '',
      SL: '',
      confidence: 50,
      description: '',
      isIntraday: true,
      validTill: new Date(),
      subscriptionPrice: 0,
      isFree: true,
    });
    setchangeChipItemdata([]);
    setIsEdit(false);
  };

  const stockNameHandler = (stockNameData: string) => {
    setBuySellPost({...buySellPost, stockName: stockNameData});
    if (PostBuySellFieldValidator.entryIsEmpty(stockNameData)) {
      setfieldError({...fieldError, stockName: true});
    } else {
      setfieldError({...fieldError, stockName: false});
    }
  };
  const buyOrSellHandler = (buyOrSell: string) => {
    if (parseInt(buyOrSell) == 1) {
      setBuySellPost({...buySellPost, buy: false});
      setBuySellValue('1');
    } else {
      setBuySellPost({...buySellPost, buy: true});
      setBuySellValue('0');
    }
  };
  const priceHandler = (price: string) => {
    setBuySellPost({
      ...buySellPost,
      price: price,
    });
    if (PostBuySellFieldValidator.entryIsEmpty(price) || isNaN(Number(price))) {
      setfieldError({...fieldError, price: true});
    } else {
      setfieldError({...fieldError, price: false});
    }
  };
  const ComparatorHandler = (data: string) => {
    setBuySellPost({...buySellPost, comparator: data});
  };

  const target1Handler = (T1: string) => {
    setBuySellPost({
      ...buySellPost,
      T1: T1,
    });
    if (PostBuySellFieldValidator.entryIsEmpty(T1) || isNaN(Number(T1))) {
      setfieldError({...fieldError, target1: true});
    } else {
      setfieldError({...fieldError, target1: false});
    }
  };

  const target2Handler = (T2: string) => {
    setBuySellPost({
      ...buySellPost,
      T2: T2,
    });
    if (
      PostBuySellFieldValidator.entryIsEmpty(T2) ||
      (isNaN(Number(T2)) && T2 !== '')
    ) {
      setfieldError({...fieldError, target2: true});
    } else {
      setfieldError({...fieldError, target2: false});
    }
  };

  // const target3Handler = (T3: string) => {
  //   setBuySellPost({
  //     ...buySellPost,
  //     T3: T3.replace(/[^0-9]/g, ''),
  //   });
  // };
  const stopLossHandler = (SL: string) => {
    setBuySellPost({
      ...buySellPost,
      SL: SL,
    });
    if (PostBuySellFieldValidator.entryIsEmpty(SL) || isNaN(Number(SL))) {
      setfieldError({...fieldError, stopLoss: true});
    } else {
      setfieldError({...fieldError, stopLoss: false});
    }
  };
  const confidenceHandler = (value: number) => {
    setBuySellPost({
      ...buySellPost,
      confidence: value,
    });
  };
  const descriptionHandler = (note: string) => {
    setBuySellPost({
      ...buySellPost,
      description: note,
    });
  };

  const tillValidHandler = (event: Event, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || buySellPost.validTill;
    if (currentDate !== undefined) {
      settillValidshow(Platform.OS === 'ios');
      setBuySellPost({...buySellPost, validTill: currentDate});
    }
  };

  const showDatepicker = () => {
    settillValidshow(true);
  };

  const changeChipdataHandler = (item: string) => {
    if (changeChipdata.includes(item)) {
      setchangeChipItemdata(changeChipdata.filter(e => e !== item));
    } else {
      setchangeChipItemdata(changeChipdata => [...changeChipdata, item]);
    }
  };

  return (
    <>
      <ScrollView style={gStyles.container}>
        <View style={styles.row}>
          <View style={Gwidth.width70}>
            <TextInput
              label="Stock Name *"
              keyboardType="ascii-capable"
              error={fieldError.stockName}
              errorText={DataValidator.STOCK_NAME}
              mode="outlined"
              maxLength={50}
              onChangeText={stockNameHandler}
              value={buySellPost.stockName}
            />
          </View>
          <View style={Gwidth.width20}>
            <RadioButton.Group
              onValueChange={buyOrSellHandler}
              value={buySellValue.toString()}>
              <View style={styles.RadioButtonitem}>
                <Subheading style={{color: Colors.greenA400}}>Buy</Subheading>
                <RadioButton color={Colors.greenA400} value="0" />
              </View>
              <View style={styles.RadioButtonitem}>
                <Subheading style={{color: Colors.redA400}}>Sell</Subheading>
                <RadioButton color={Colors.redA400} value="1" />
              </View>
            </RadioButton.Group>
          </View>
        </View>
        <View style={styles.row}>
          <View style={Gwidth.width48}>
            <TextInput
              label="Price *"
              keyboardType="phone-pad"
              mode="outlined"
              error={fieldError.price}
              errorText={DataValidator.PRICE}
              maxLength={15}
              onChangeText={priceHandler}
              value={buySellPost.price.toString()}
            />
          </View>
          <ToggleButton.Row
            style={[Gwidth.width48, styles.comparatorContainer]}
            onValueChange={value => {
              ComparatorHandler(value);
            }}
            value={buySellPost.comparator}>
            <ToggleButton
              style={styles.ToggleButtonBtnComparator}
              icon={() => <Caption>Above</Caption>}
              value="Above"
            />
            <ToggleButton
              style={styles.ToggleButtonBtnComparator}
              icon={() => <Caption>Equal</Caption>}
              value="Equal"
            />
            <ToggleButton
              style={styles.ToggleButtonBtnComparator}
              icon={() => <Caption>Below</Caption>}
              value="Below"
            />
          </ToggleButton.Row>
        </View>
        {/* sell or buy */}
        <View style={styles.row}>
          <View style={Gwidth.width48}>
            <TextInput
              label="Target-1 *"
              keyboardType="phone-pad"
              mode="outlined"
              error={fieldError.target1}
              errorText={DataValidator.TARGET_1}
              maxLength={15}
              onChangeText={target1Handler}
              value={buySellPost.T1.toString()}
            />
          </View>
          <View style={Gwidth.width48}>
            <TextInput
              label="Target-2"
              keyboardType="phone-pad"
              mode="outlined"
              maxLength={15}
              onChangeText={target2Handler}
              value={buySellPost.T2.toString()}
            />
          </View>
          {/* <View style={Gwidth.width32}>
          <TextInput
            label="Target-3"
            keyboardType="phone-pad"
            mode="outlined"
            maxLength={10}
            onChangeText={target3Handler}
            value={buySellPost.T3}
          />
        </View> */}
        </View>
        <View style={styles.row}>
          <View style={Gwidth.width48}>
            <TextInput
              label="Stop Loss *"
              keyboardType="phone-pad"
              mode="outlined"
              error={fieldError.stopLoss}
              errorText={DataValidator.STOP_LOSS}
              maxLength={15}
              onChangeText={stopLossHandler}
              value={buySellPost.SL.toString()}
            />
          </View>
          <View style={Gwidth.width50}>
            <View style={styles.row}>
              <Caption style={styles.PossibilityText}>Win Possibility</Caption>
              <Badge style={{backgroundColor: Colors.greenA400}} visible={true}>
                {buySellPost.confidence + ' %'}
              </Badge>
            </View>

            <View style={styles.slidercontainer}>
              <Slider
                style={styles.slider}
                step={10}
                minimumValue={10}
                maximumValue={100}
                thumbTintColor={Colors.greenA400}
                value={buySellPost.confidence}
                minimumTrackTintColor={Colors.greenA400}
                maximumTrackTintColor={theme.colors.text}
                onSlidingComplete={confidenceHandler}
              />
            </View>
          </View>
        </View>
        <TextInput
          label="Note"
          mode="outlined"
          maxLength={100}
          onChangeText={descriptionHandler}
          value={buySellPost.description}
        />
        <View style={styles.row}>
          <View style={Gwidth.width48}>
            <ToggleButton.Row
              onValueChange={value => {
                if (value == '' || value == null) {
                  value = intradayLongtermValue;
                }
                if (value === '0') {
                  setBuySellPost({
                    ...buySellPost,
                    isIntraday: true,
                    validTill: new Date(),
                  });
                } else setBuySellPost({...buySellPost, isIntraday: false});
                setIntradayLongtermValue(value);
              }}
              value={intradayLongtermValue}>
              <ToggleButton
                style={styles.ToggleButtonBtn}
                icon={() => <Caption>Intraday</Caption>}
                value="0"
              />
              <ToggleButton
                style={styles.ToggleButtonBtn}
                icon={() => <Caption>Longterm</Caption>}
                value="1"
              />
            </ToggleButton.Row>
          </View>
          <View style={Gwidth.width48}>
            <ToggleButton.Row
              onValueChange={value => {
                if (value == '' || value == null) {
                  value = callTypeValue;
                }
                console.log(value);
                if (value === '0') {
                  setchangeChipItemdata([]);
                  setBuySellPost({...buySellPost, isFree: true});
                } else setBuySellPost({...buySellPost, isFree: false});
                setCallTypeValue(value);
              }}
              value={callTypeValue}>
              <ToggleButton
                style={styles.ToggleButtonBtn}
                icon={() => <Caption>Free call</Caption>}
                value="0"
              />
              <ToggleButton
                style={styles.ToggleButtonBtn}
                icon={() => <Caption>Paid call</Caption>}
                value="1"
              />
            </ToggleButton.Row>
          </View>
        </View>
        <View style={styles.row}>
          {!!parseInt(intradayLongtermValue) && (
            <View style={styles.dateTimePicker}>
              <TouchableOpacity
                style={styles.rowtextBtn}
                onPress={showDatepicker}>
                <Caption>
                  Till Valid :{' '}
                  {moment(buySellPost.validTill).format('DD-MMM-YYYY')}
                </Caption>
                <Icon name="update" color={Colors.amber500} size={22} />
              </TouchableOpacity>
              {tillValidshow && (
                <DateTimePicker
                  value={new Date(buySellPost.validTill)}
                  mode={'date'}
                  is24Hour={true}
                  display="default"
                  onChange={tillValidHandler}
                />
              )}
            </View>
          )}
          <View>
            {!!parseInt(callTypeValue) && (
              <View style={styles.rowtextBtn}>
                <Caption>Select groups </Caption>
                <Icon name="account-group" color={Colors.amber500} size={22} />
              </View>
            )}
          </View>
        </View>
        <View>
          {!!parseInt(callTypeValue) && (
            <ScrollView>
              <View style={styles.rowChip}>
                {props.clientGroups.map((item: any, index: number) => {
                  return (
                    <Chip
                      mode="flat"
                      selectedColor={theme.colors.text}
                      style={
                        changeChipdata.includes(item._id)
                          ? {
                              ...styles.chipItem,
                              ...styles.selecrdchipbackcolor,
                            }
                          : {
                              ...styles.chipItem,
                              ...theme.colors,
                            }
                      }
                      icon={
                        changeChipdata.includes(item._id)
                          ? 'checkbox-marked-circle'
                          : 'checkbox-blank-circle'
                      }
                      key={index}
                      selected={
                        changeChipdata.includes(item._id) ? true : false
                      }
                      onPress={() => {
                        changeChipdataHandler(item._id);
                      }}>
                      {item.groupName}
                    </Chip>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
        <View style={[styles.row]}>
          <View style={Gwidth.width48}>
            <Button
              mode="contained"
              disabled={props.isLoading}
              loading={
                props.isLoading &&
                !(localLoader.editSignalLoad || localLoader.postSignalLoad)
              }
              onPress={clear}>
              Clear
            </Button>
          </View>
          <View style={Gwidth.width48}>
            {IsEdit ? (
              <Button
                mode="contained"
                disabled={props.isLoading}
                loading={props.isLoading && IsEdit}
                onPress={editHandler}>
                {'Update'}
              </Button>
            ) : (
              <Button
                mode="contained"
                disabled={props.isLoading}
                loading={props.isLoading && !IsEdit}
                onPress={submitHandler}>
                {'Post'}
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
      <Snackbar
        visible={props.getPostsStatus.error}
        action={{
          label: 'Close',
          onPress: () => {
            props.dismiss();
          },
        }}
        onDismiss={() => {
          props.dismiss();
        }}>
        {props.getPostsStatus.message.toString()}
      </Snackbar>

      <Snackbar
        children={<>{props.getGroupListStatus.message}</>}
        visible={props.getGroupListStatus.error}
        action={{
          label: 'Close',
          onPress: () => {
            props.dismiss();
          },
        }}
        onDismiss={() => props.getGroupListErrorDismiss()}
      />
    </>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(PostBuySell);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowChip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  slidercontainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  slider: {
    width: '100%',
    height: 45,
  },
  RadioButtonitem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  PossibilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  PossibilityText: {
    marginHorizontal: '10%',
  },

  ToggleButtonBtn: {
    width: '49%',
  },
  ToggleButtonBtnComparator: {
    height: 50,
    width: '33%',
    //backgroundColor:Colors.amber400
  },
  comparatorContainer: {
    marginTop: 10,
  },
  dateTimePicker: {
    alignItems: 'flex-start',
  },
  rowtextBtn: {
    marginVertical: 5,
    flexDirection: 'row',
  },
  chipItem: {
    marginHorizontal: 6,
    marginVertical: 6,
  },
  selecrdchipbackcolor: {
    backgroundColor: Colors.green500,
  },
  chipbackcolor: {
    backgroundColor: Colors.black,
  },
});
