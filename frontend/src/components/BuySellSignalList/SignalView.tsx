import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from 'react-native-paper';
import {connect} from 'react-redux';
import SignalList from './SignalList';
import {RootState} from '../../redux/reducers';
import {SignalViewQueries} from '../../constants/signalViewConstants';
import {UserRoles} from '../../models/ReducerTypes/UserReducerTypes';

interface ISignalViewProps {
  loggedIn: boolean;
  role: UserRoles;
  archivedPost: Array<any>;
  posts: any;
  analystProfilePost: any;
  analystPost: any;
  userId: string;
  user: any;
}

interface ISignalViewDispatchProps {}

interface BuySellSignalViewProps
  extends ISignalViewProps,
    ISignalViewDispatchProps {
  siginalEdit: boolean;
  showChip: boolean;
  queryType: string;
  navigation?: any;
}

const mapStateToProps = ({
  userReducer,
  signalViewReducer,
  archiveReducer,
}: RootState): ISignalViewProps => {
  return {
    analystPost: signalViewReducer.analystPost,
    analystProfilePost: signalViewReducer.analystProfilePost,
    archivedPost: archiveReducer.Archives,
    loggedIn: userReducer.loggedIn,
    role: userReducer.user.parsedData.user.role[0],
    posts: signalViewReducer.post,
    userId: userReducer.user.parsedData.user.id
      ? userReducer.user.parsedData.user.id
      : '',
    user: userReducer.user,
  };
};

const mapDispatchToProps = (dispatch: any): ISignalViewDispatchProps => {
  return {};
};

const BuySellSignalView: React.FC<BuySellSignalViewProps> = props => {
  return (
    <View style={styles.container}>
      <SignalList
        showChip={props.showChip}
        queryType={props.queryType}
        isEdit={props.siginalEdit}
        // refreshing={props.signalViewStatus.refreshing}
        signalItems={
          props.queryType === SignalViewQueries.OWN_PROFILE_PAGE
            ? props.archivedPost
            : props.queryType === SignalViewQueries.ANALYST_SIGNAL_VIEW_PAGE
            ? props.analystPost
            : props.queryType === SignalViewQueries.ANALYST_PROFILE_PAGE
            ? props.analystProfilePost
            : props.posts
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //paddingBottom: 60,
  },
  row: {
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
    backgroundColor: Colors.white,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(BuySellSignalView);
