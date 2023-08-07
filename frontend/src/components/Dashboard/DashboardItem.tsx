import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Caption, Card, Colors} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import {SIZES} from '../../styles/theme';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, ScreenNames} from '../../navigation/RootNavigation';
import { RootState } from '../../redux/reducers';
import { UserProfileRepository } from '../../services/UserProfile/UserProfileRepository';
import { connect } from 'react-redux';


interface IDrawerContentProps {
  id: string;
}

interface IDrawerContentDispatchProps {
  setProfileViewId: (id: string) => {};
}


const mapStateToProps = ({
  userReducer,
}: RootState): IDrawerContentProps => {
  return {
    id: userReducer.user.parsedData.user?.id
  };
};

const mapDispatchToProps = (dispatch: any): IDrawerContentDispatchProps => {
  return {
    setProfileViewId: async (id: string) =>
      dispatch(await UserProfileRepository.getUserProfileById(id)),
  };
};


export interface IProps extends IDrawerContentDispatchProps, IDrawerContentProps {
  dashboardItem: any;
  onPress?: any;
}


const DashboardItem = (props: IProps) => {
  const navigation =
    useNavigation<
      StackNavigationProp<RootStackParamList, ScreenNames.DASHBOARD>
    >();
  return (
    <ScrollView>
      <View style={styles.container}>
        {props.dashboardItem.map((item: any, index: number) => {
          return (
            <Card
              key={index}
              style={styles.cardContainer}
              onPress={() => {
                props.setProfileViewId(props.id);
                navigation.navigate(item.router, {});
              }}>
              <Card.Content>
                <View style={styles.center}>
                  {item.icon.type == 'Icon' && (
                    <Icon
                      name={item.icon.iname}
                      color={Colors.amber600}
                      size={50}
                    />
                  )}
                  {item.icon.type == 'FAIcon' && (
                    <FAIcon
                      name={item.icon.iname}
                      color={Colors.amber600}
                      size={50}
                    />
                  )}
                </View>
              </Card.Content>
              <Card.Actions style={{alignSelf: 'center'}}>
                <Caption numberOfLines={1}>{item.name}</Caption>
              </Card.Actions>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardItem);

const styles = StyleSheet.create({
  cardContainer: {
    width: SIZES.width * 0.3,
    margin: 5,
    height: SIZES.width * 0.3,
    minHeight: 100,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
