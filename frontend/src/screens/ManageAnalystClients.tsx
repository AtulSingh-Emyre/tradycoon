import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  IconButton,
  Colors,
  ActivityIndicator,
  Text,
  Subheading,
  useTheme,
  Avatar,
  Caption,
  FAB,
  Title,
  Card,
  Badge,
  Divider,
} from 'react-native-paper';
import {TextInput as PaperTextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Gwidth, gMarginHorizontal} from '../styles/Global';
import TextInput from '../templates/TextInput';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {connect} from 'react-redux';
import {UserGroupRepositry} from '../services/UserGroup/UserGroupRepository';
import {RootState} from '../redux/reducers';
import LottieView from 'lottie-react-native';
import {
  UserGroupActions,
  UserGroupActionTypes,
} from '../redux/actions/user-groups/UserGroupActions';
import Snackbar from '../templates/Snackbar';
import TextMessage from '../templates/TextMessage';
import {COLORS_INDEX, SIZES} from '../styles/theme';
import {RefreshControl} from 'react-native';
import moment from 'moment';
import DialogBox from '../templates/DialogBox';
import {useNavigation} from '@react-navigation/native';

const SKIP = 50;

interface Istatus {
  error: boolean;
  loading: boolean;
  message: string;
  status?: number;
}

interface IClientGroups {
  getGroupListStatus: Istatus;
  groups: any[];
  status: Istatus;
  clientStatus: Istatus;
  clientLoadMoreExists: boolean;
  clientLoadMoreIsLoading: boolean;
  clients: any[];
}

interface ICLientGroupsDispatchAction {
  getGroupsList: Function;
  getGroupListErrorDismiss: Function;
  addNewGroup: Function;
  getClientListOfSelectedGroup: Function;
  addNewClient: Function;
  renameGroupHandler: Function;
  deleteSelectedClient: Function;
  deleteSelectedGroup: Function;
  editSelectedClient: Function;
  clientListErrorDismiss: Function;
  statusErrorDismiss: Function;
}

interface ManageAnalystClients2Props
  extends IClientGroups,
    ICLientGroupsDispatchAction {
  query?: string;
  navigation?: any;
  route?: any;
}

const mapStateToProps = ({userGroupReducer}: RootState): IClientGroups => {
  return {
    getGroupListStatus: userGroupReducer.initializationStatus,
    groups: userGroupReducer.groups,
    status: userGroupReducer.status,
    clients: userGroupReducer.client,
    clientStatus: userGroupReducer.clientStatus,
    clientLoadMoreExists: userGroupReducer.clientLoadMoreExists,
    clientLoadMoreIsLoading: userGroupReducer.clientLoadMoreIsLoading,
  };
};

const mapDispatchToProps = (dispatch: any): ICLientGroupsDispatchAction => {
  return {
    getGroupsList: async () =>
      dispatch(await UserGroupRepositry.getGroupDetails()),
    getGroupListErrorDismiss: async () =>
      await dispatch(
        await UserGroupActions.InitializeGroupStatusAction(false, false, ''),
      ),
    addNewGroup: async (name: string) =>
      await dispatch(await UserGroupRepositry.addNewGroup(name)),
    getClientListOfSelectedGroup: async (
      groupId: string,
      skip: number,
      atEnd: boolean,
    ) =>
      await dispatch(
        await UserGroupRepositry.getClientDetails(groupId, skip, atEnd),
      ),
    addNewClient: async (query: string, groupId: string, valid_at: Date) =>
      await dispatch(
        await UserGroupRepositry.addNewClient(query, groupId, valid_at),
      ),
    deleteSelectedClient: async (userId: string) =>
      await dispatch(await UserGroupRepositry.removeClient(userId)),
    deleteSelectedGroup: async (groupId: string) =>
      await dispatch(await UserGroupRepositry.deleteGroup(groupId)),
    renameGroupHandler: async (new_name: string, groupId: string) =>
      await dispatch(
        await UserGroupRepositry.updateGroupName(new_name, groupId),
      ),
    editSelectedClient: async (
      clientId: string,
      update: any,
      groupId: string,
    ) =>
      await dispatch(
        await UserGroupRepositry.editClient(clientId, update, groupId),
      ),
    clientListErrorDismiss: async () =>
      await dispatch(
        await UserGroupActions.GetUserGroupClientDataRequestStatusAction(
          false,
          false,
          '',
          false,
        ),
      ),
    statusErrorDismiss: async (error: boolean, message: '') =>
      await dispatch(
        await UserGroupActions.ServerRequestFailedAction({
          error,
          loading: false,
          message,
          status: 200,
        }),
      ),
  };
};

const ManageAnalystClients2: React.FC<ManageAnalystClients2Props> = props => {
  const navigation = useNavigation();
  const [state, setState] = React.useState({open: false});
  const onStateChange = ({open}: any) => setState({open});
  const {open} = state;
  const [isVisibleFab, setIsVisibleFab] = useState(true);
  const {colors} = useTheme();
  const fall = new Animated.Value(1);
  const ITEM_HEIGHT = 200;
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [destSnap, setDestSnap] = useState(350);
  const [BSTrget, setBSTrget] = useState<string>('');
  const BootomSheetRenderInner = useRef<any>(null);
  const [newGroupName, setnewGroupName] = useState('');
  const [renameGroup, setrenameGroup] = useState('');
  const [date, setDate] = useState<any>(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showDateEditClient, setShowDateClient] = useState(false);
  const [clientDetails, SetClientDetails] = useState<any>({});
  const [statusMessage, setStatusMessage] = useState<string>('');

  const fab =
    selectedGroup != null
      ? [
          {
            icon: 'account-plus',
            label: 'Add Client',
            onPress: () => BootomSheetRenderInnerSnap(0, 350, 'AddClient'),
          },
          {
            icon: 'account-edit',
            label: 'Edit Group',
            onPress: () => {
              setrenameGroup(selectedGroup.groupName);
              BootomSheetRenderInnerSnap(0, 350, 'EditGroup');
            },
          },
          {
            icon: 'account-group',
            label: 'Add Group',
            onPress: () => BootomSheetRenderInnerSnap(0, 350, 'AddGroup'),
            small: false,
          },
        ]
      : [
          {
            icon: 'account-group',
            label: 'Add Group',
            onPress: () => BootomSheetRenderInnerSnap(0, 350, 'AddGroup'),
            small: false,
          },
        ];

  const [handleDeleteClientDialog, setHandleDeleteClientDialog] =
    useState(false);

  const [handleDeleteGroupDialog, setHandleDeleteGroupDialog] = useState(false);

  const [skip, setskip] = useState(0);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  //effect hooks
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsVisibleFab(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    void loadUserGroups();
    // return () => {};
  }, []);

  useEffect(() => {
    void getUserData(false);
  }, [selectedGroup]);

  // API Call functionalities
  const loadUserGroups = async () => {
    await props.getGroupsList();
  };
  const getUserData = async (atEnd: boolean) => {
    await props.getClientListOfSelectedGroup(
      selectedGroup._id,
      atEnd ? skip + SKIP : 0,
      atEnd,
    );
    if (atEnd) setskip(skip + SKIP);
    else setskip(0);
  };

  const cleanLocalData = () => {
    setStatusMessage('');
  };
  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );
  const newClientHandler = async () => {
    const response = await props.addNewClient(
      searchQuery,
      selectedGroup._id,
      date,
    );
    if (response.error) setStatusMessage(response.message);
    else {
      setSearchQuery('');
      setStatusMessage('Client Added Successfully');
    }
  };
  const onChangeDOB = (_event: any, selectedDate: Date | undefined) => {
    setShowDate(Platform.OS === 'ios');
    selectedDate && setDate(selectedDate);
  };

  const showDatepicker = () => {
    setShowDate(true);
  };
  const EmptyListMessage = ({item}: any) => {
    return (
      <View style={styles.LottieView}>
        <LottieView
          style={{
            width: SIZES.width * 0.9,
          }}
          source={require('../assets/No-User-Manage.json')}
          autoPlay
          loop
        />
      </View>
    );
  };
  const BSAddClientRenderInner = () => {
    return (
      <View style={[styles.panel, {backgroundColor: colors.background}]}>
        <Text style={styles.panelTitle}>Add Client</Text>
        <Text style={styles.panelSubtitle}>Enter client mobile or Email</Text>
        <View style={Gwidth.width90}>
          <TextInput
            label="Client"
            placeholder="Enter client mobile or Email"
            mode="outlined"
            maxLength={50}
            onChangeText={text => setSearchQuery(text)}
            value={searchQuery}
          />
          <View style={styles.row}>
            <View style={Gwidth.width60}>
              <TouchableOpacity onPress={showDatepicker}>
                <TextInput
                  label="Client validity *"
                  mode="outlined"
                  value={moment(date).format('DD-MM-YYYY')}
                  editable={false}
                  returnKeyType={'next'}
                  right={
                    <PaperTextInput.Icon
                      onPress={() => setShowDate(true)}
                      name="calendar-month"
                    />
                  }
                />
              </TouchableOpacity>
              {showDate && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={'date'}
                  is24Hour={true}
                  display="default"
                  minimumDate={new Date()}
                  onChange={onChangeDOB}
                />
              )}
            </View>
            <View style={Gwidth.width40}>
              <Caption style={{textAlign: 'right'}}>Validity expired</Caption>
              <Badge size={30}>
                {moment(date, 'YYYYMMDD').endOf('day').fromNow()}
              </Badge>
            </View>
          </View>
        </View>

        <IconButton
          disabled={!searchQuery.trim().length || props.status.loading}
          icon="account-plus"
          size={40}
          onPress={newClientHandler}
        />
        {props.status.loading && <ActivityIndicator />}
        <TextMessage code={'s'} message={statusMessage} />
      </View>
    );
  };

  const BSAddGroupRenderInner = () => {
    const newGroupNameHandler = async () => {
      const response = await props.addNewGroup(newGroupName);
      if (response.error) setStatusMessage(response.message);
      else setStatusMessage('User Group Created');
      setnewGroupName('');
    };
    return (
      <View style={[styles.panel, {backgroundColor: colors.background}]}>
        <Text style={styles.panelTitle}>Add Group</Text>
        <View style={[styles.row, gMarginHorizontal.margin15]}>
          <View style={Gwidth.width80}>
            <TextInput
              label="Add Group"
              mode="outlined"
              maxLength={50}
              onChangeText={text => setnewGroupName(text)}
              value={newGroupName}
            />
          </View>
          <View style={Gwidth.width20}>
            <IconButton
              disabled={!newGroupName.trim().length || props.status.loading}
              icon="account-multiple-plus"
              size={40}
              onPress={newGroupNameHandler}
            />
            {props.status.loading && <ActivityIndicator />}
          </View>
        </View>
        <TextMessage code={'s'} message={statusMessage} />
      </View>
    );
  };

  const BSEditGroupRenderInner = () => {
    const renameGroupHandler = async () => {
      if (renameGroup.length < 0) {
        await props.statusErrorDismiss(true, 'please enter a valid name');
      } else {
        const response = await props.renameGroupHandler(
          renameGroup,
          selectedGroup._id,
        );
        if (response.error) setStatusMessage(response.message);
        else setStatusMessage('Group Renamed Successfully');
      }
    };

    const handleDialogBoxGroupAction = (action: string) => {
      if (action === 'Done') {
        deleteGroupHandler();
      }
      setHandleDeleteGroupDialog(false);
    };

    const deleteGroupHandler = async () => {
      const response = await props.deleteSelectedGroup(selectedGroup._id);
      setHandleDeleteGroupDialog(false);
      if (response.error) setStatusMessage(response.message);
      else {
        setSelectedGroup(null);
        setStatusMessage('Group Successfully Deleted');
      }
    };

    return (
      <View style={[styles.panel, {backgroundColor: colors.background}]}>
        {handleDeleteGroupDialog && (
          <DialogBox
            title="Alert"
            message="Are you sure you want to delete this Group !"
            type=""
            actions={(type: string) => handleDialogBoxGroupAction(type)}
            isVisible={handleDeleteGroupDialog}
          />
        )}
        <Text style={styles.panelTitle}>Edit Group</Text>
        <View style={[styles.row, gMarginHorizontal.margin15]}>
          <View style={Gwidth.width80}>
            <TextInput
              label="Edit Group"
              placeholder="Enter new group name"
              mode="outlined"
              maxLength={50}
              onChangeText={text => {
                setrenameGroup(text);
              }}
              value={renameGroup}
            />
          </View>
          <View style={Gwidth.width20}>
            <IconButton
              disabled={!renameGroup.trim().length || props.status.loading}
              icon="account-edit"
              size={40}
              onPress={renameGroupHandler}
            />
          </View>
        </View>
        {props.status.loading && <ActivityIndicator />}
        <View style={[styles.deleteGroup, gMarginHorizontal.margin15]}>
          <Subheading>Delete Group</Subheading>
          <IconButton
            color={Colors.red500}
            icon="delete-forever"
            disabled={props.status.loading}
            size={30}
            onPress={() => setHandleDeleteGroupDialog(true)}
          />
        </View>
        <View style={{marginTop: 15}}>
          <TextMessage code={'s'} message={statusMessage} />
        </View>
      </View>
    );
  };

  const editClientSubmitHandler = async (update: {valid_at: any}) => {
    const response = await props.editSelectedClient(
      clientDetails._id,
      update,
      selectedGroup._id,
    );
    if (response.error) setStatusMessage(response.message);
    else {
      setStatusMessage('Client Details Successfully Updated');
    }
    props.statusErrorDismiss(false, '');
  };

  const BSDetailsClient = () => {
    const onChangeValidDate = (_event: any, selectedDate: Date | undefined) => {
      setShowDateClient(Platform.OS === 'ios');
      if (selectedDate) {
        SetClientDetails({
          ...clientDetails,
          valid_at: selectedDate,
        });
        editClientSubmitHandler({valid_at: selectedDate});
      }
    };
    const handleDialogBoxClientAction = (action: string) => {
      if (action === 'Done') {
        deleteClientHandler();
      }
      setHandleDeleteClientDialog(false);
    };

    const deleteClientHandler = async () => {
      const response = await props.deleteSelectedClient(clientDetails._id);
      setHandleDeleteClientDialog(false);
      if (response.error) setStatusMessage(response.message);
      else setStatusMessage('Client Successfully Deleted');
      props.statusErrorDismiss(false, '');
    };

    return (
      <View style={[styles.panelDetail, {backgroundColor: colors.background}]}>
        {handleDeleteClientDialog && (
          <DialogBox
            title="Alert"
            message="Are you sure you want to delete this client !"
            type=""
            actions={(type: string) => handleDialogBoxClientAction(type)}
            isVisible={handleDeleteClientDialog}
          />
        )}
        {selectedGroup && (
          <Title style={{textAlign: 'center', color: colors.accent}}>
            {selectedGroup ? selectedGroup.groupName : ''}
          </Title>
        )}
        <Text style={styles.panelTitle}>
          Name : {clientDetails.user_id.name}
        </Text>
        <Text style={styles.panelTitle}>
          Email :{' '}
          {clientDetails.user_id.work_mail !== ''
            ? clientDetails.user_id.work_mail
            : 'N/A'}
        </Text>
        <Text style={styles.panelTitle}>
          Mobile :{' '}
          {clientDetails.user_id.phone != 0
            ? clientDetails.user_id.phone
            : 'N/A'}
        </Text>
        <Text style={styles.panelTitle}>
          Joined :{' '}
          {clientDetails.created_at != null
            ? moment(clientDetails.created_at).format('DD-MM-YYYY')
            : 'N/A'}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Title style={{textAlign: 'right'}}>Validity expired </Title>
          <Badge size={30}>
            {moment(clientDetails.valid_at).endOf('day').fromNow()}
          </Badge>
        </View>
        <View style={styles.EditIconText}>
          <Title>
            Valid Till :{' '}
            <Title style={{color: colors.primary}}>
              {clientDetails.created_at != null
                ? moment(clientDetails.valid_at).format('DD-MM-YYYY')
                : 'N/A'}
            </Title>
          </Title>
          <IconButton
            color={colors.notification}
            icon="calendar-edit"
            disabled={props.status.loading}
            size={30}
            onPress={() => setShowDateClient(true)}
          />
        </View>
        {showDateEditClient && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(clientDetails.valid_at)}
            mode={'date'}
            is24Hour={true}
            display="default"
            minimumDate={new Date()}
            onChange={onChangeValidDate}
          />
        )}

        <View style={styles.deleteGroup}>
          <Title>Delete Client</Title>
          <IconButton
            color={Colors.red500}
            icon="delete-forever"
            size={30}
            disabled={props.status.loading}
            onPress={() => setHandleDeleteClientDialog(true)}
          />
        </View>
        {props.status.loading && <ActivityIndicator />}
        <View style={{marginTop: 10}}>
          <TextMessage code={'s'} message={statusMessage} />
        </View>
      </View>
    );
  };

  const DetailsClient = () => {
    BootomSheetRenderInnerSnap(0, 400, 'DetailsClient');
  };
  const BSrenderContent = () => {
    if (BSTrget == 'AddClient') {
      return BSAddClientRenderInner();
    } else if (BSTrget == 'EditGroup') {
      return BSEditGroupRenderInner();
    } else if (BSTrget == 'DetailsClient') {
      return BSDetailsClient();
    } else if (BSTrget == 'AddGroup') {
      return BSAddGroupRenderInner();
    } else {
      return null;
    }
  };

  const BootomSheetRenderInnerSnap = (
    initialSnap: number,
    DestSnap: number,
    trget: string,
  ) => {
    cleanLocalData();
    setBSTrget(trget);
    setDestSnap(DestSnap);
    BootomSheetRenderInner.current.snapTo(initialSnap);
  };

  const renderHeader = () => (
    <View style={[styles.header, {backgroundColor: colors.primary}]}>
      <View style={styles.panelHandle} />
    </View>
  );

  const flatListRenderItemClientList = ({item, index}: any) => {
    const usertitle = item.user_id.name
      ? item.user_id.name
      : item.user_id.phone
      ? item.user_id.phone
      : item.user_id.work_mail;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          SetClientDetails({...item});
          DetailsClient();
        }}>
        <Card style={{margin: 0.5, padding: 4}}>
          <Card.Title
            style={{borderBottomColor: colors.primary}}
            key={index + 1}
            title={usertitle}
            subtitle={
              <Text>
                <Caption>
                  Joined :{moment(item.created_at).format('DD-MM-YYYY')}
                </Caption>
                {'  '}
                <Caption style={{marginLeft: 15}}>
                  Valid :{moment(item.valid_at).format('DD-MM-YYYY')}
                </Caption>
              </Text>
            }
            right={() => (
              <IconButton
                icon="arrow-right"
                color={colors.primary}
                style={{alignSelf: 'center'}}
                onPress={() => {
                  SetClientDetails({...item});
                  DetailsClient();
                }}
              />
            )}
            left={props => (
              <Avatar.Image
                {...props}
                size={50}
                style={{alignSelf: 'center'}}
                source={
                  item.user_id.avatar
                    ? {uri: item.user_id.avatar}
                    : require('../assets/No-User-Avatar.jpeg')
                }
              />
            )}
          />
        </Card>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <BottomSheet
        ref={BootomSheetRenderInner}
        overdragResistanceFactor={0}
        enabledInnerScrolling={false}
        snapPoints={[destSnap, 0]}
        renderContent={BSrenderContent}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
        enabledContentTapInteraction={true}
        onOpenStart={() => setOpenBottomSheet(true)}
        onCloseEnd={() => setOpenBottomSheet(false)}
      />
      <FAB.Group
        style={{
          flex: 1,
          zIndex: 1,
          elevation: 1,
        }}
        visible={true && !openBottomSheet}
        open={open}
        icon={open ? 'calendar-today' : 'plus'}
        actions={fab}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
          }
        }}
      />
      <View
        style={{
          top: 0,
        }}>
        <ScrollView
          scrollsToTop={true}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {props.groups &&
            props.groups.map((item: any, index: number) => {
              const colorIndx = String(index).slice(-1);
              const groupText = item.groupName
                .match(/\b(\w)/g)
                .join('')
                .toUpperCase();
              return (
                <TouchableOpacity
                  onPress={() => setSelectedGroup(item)}
                  activeOpacity={0.5}
                  key={index}
                  style={{padding: 5, width: 90}}>
                  <Avatar.Text
                    size={80}
                    style={{backgroundColor: COLORS_INDEX[+colorIndx]}}
                    label={groupText}
                  />
                  <Caption
                    allowFontScaling={true}
                    numberOfLines={1}
                    style={{textAlign: 'center'}}>
                    {item.groupName}
                  </Caption>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
      <View style={{flex: 1, width: '100%'}}>
        <FlatList
          ListHeaderComponent={
            <Title style={{textAlign: 'center'}}>
              {selectedGroup ? selectedGroup.groupName : ''}
            </Title>
          }
          initialNumToRender={10}
          maxToRenderPerBatch={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any, index: any) => index.toString()}
          data={selectedGroup != null ? props.clients : []}
          getItemLayout={getItemLayout}
          ListEmptyComponent={EmptyListMessage}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                setskip(0);
                void getUserData(false);
              }}
              refreshing={
                props.clientStatus.loading && !props.clientLoadMoreIsLoading
              }
            />
          }
          onEndReached={({distanceFromEnd}) => {
            if (props.clientStatus.loading || !props.clientLoadMoreExists)
              return;
            void getUserData(true);
          }}
          onEndReachedThreshold={0.75}
          ListFooterComponent={
            props.clientLoadMoreIsLoading ? <ActivityIndicator /> : <></>
          }
          renderItem={flatListRenderItemClientList}
        />
      </View>
      <Snackbar
        visible={props.getGroupListStatus.error}
        onDismiss={() => props.getGroupListErrorDismiss()}>
        {props.getGroupListStatus.message}
      </Snackbar>

      <Snackbar
        visible={props.clientStatus.error}
        onDismiss={() => props.clientListErrorDismiss()}>
        {props.clientStatus.message}
      </Snackbar>
    </SafeAreaView>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageAnalystClients2);

// export default ManageAnalystClients2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  LottieView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    padding: 0,
    marginHorizontal: 20,
  },
  listSection: {
    zIndex: 0,
    elevation: 0,
    paddingBottom: 50,
  },
  panel: {
    alignItems: 'center',
    paddingTop: 20,
    height: SIZES.height,
  },
  panelDetail: {
    paddingHorizontal: 20,
    height: SIZES.height,
  },
  panelEdit: {
    alignItems: 'center',
    backgroundColor: Colors.black,
    paddingTop: 20,
    height: SIZES.height,
  },
  header: {
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 10,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHandle: {
    width: SIZES.width,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 20,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
  },
  deleteGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  EditIconText: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
