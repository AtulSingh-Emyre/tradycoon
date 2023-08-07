import * as React from 'react';
import {useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {Http} from '../../services/http';
import {UserProfileRepository} from '../../services/UserProfile/UserProfileRepository';
import {RootState} from '../../redux/reducers';
import {Avatar, Card} from 'react-native-paper';
import moment from 'moment';

interface IClientGroupMapStateProps {
  clientGroupData: IClientGroupDataItem[];
  userId: string;
}

interface IClientGroupDataItem {
  created_at: string;
  group_id: {
    analyst_UserId: {
      avatar: string;
      name: string;
      phone: string;
      work_mail: string;
    };
    groupName: string;
  };
  valid_at: string;
}

interface IClientGroupMapDispatchProps {
  getData: Function;
}

interface ClientGroupListProps
  extends IClientGroupMapDispatchProps,
    IClientGroupMapStateProps {}

const mapStateToProps = ({
  userProfileViewReducer,
}: // followerReducer,
RootState): IClientGroupMapStateProps => {
  return {
    clientGroupData: userProfileViewReducer.clientGroups,
    userId: userProfileViewReducer.userId,
  };
};

const mapDispatchToProps = (dispatch: any): IClientGroupMapDispatchProps => {
  return {
    getData: async (id: string) =>
      dispatch(await UserProfileRepository.getUserClientGroupDetails(id)),
  };
};

const ClientGroupList = (props: ClientGroupListProps) => {
  const [status, setstatus] = React.useState({error: false, loading: true});
  const initializeData = async () => {
    setstatus({...status, loading: true});
    const res = await props.getData(props.userId);
    if (res.success) {
      setstatus({loading: false, error: false});
    } else {
      setstatus({loading: false, error: true});
      Http.handleErrors({});
    }
  };
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {props.clientGroupData &&
          props.clientGroupData.map((item: any, index: number) => {
            return (
              <View key={index} style={{padding: 2}}>
                <Card
                  style={{
                    margin: 0.5,
                    padding: 4,
                    elevation: 5,
                  }}>
                  <Card.Title
                    title={
                      <Text>
                        {item.group_id ? item.group_id.groupName : ''}
                      </Text>
                    }
                    titleStyle={{marginHorizontal: 10}}
                    subtitleNumberOfLines={2}
                    subtitleStyle={{marginHorizontal: 10}}
                    subtitle={
                      <Text>
                        Joined : {moment(item.created_at).format('DD-MM-YYYY')}
                        {'  '}
                        Valid :{moment(item.valid_at).format('DD-MM-YYYY')}
                        {'\n'}
                        Group Admin :{' '}
                        <Text>
                          {item.group_id
                            ? item?.group_id?.analyst_UserId?.name
                            : ''}
                        </Text>
                      </Text>
                    }
                    left={props => (
                      <Avatar.Image
                        {...props}
                        size={70}
                        style={{alignSelf: 'center'}}
                        source={
                          item.group_id
                            ? {uri: item.group_id?.analyst_UserId?.avatar}
                            : require('../../assets/No-User-Avatar.jpeg')
                        }
                      />
                    )}
                  />
                </Card>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientGroupList);

const styles = StyleSheet.create({
  container: {flex: 1},
});
