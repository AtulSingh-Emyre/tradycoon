/* eslint-disable @typescript-eslint/ban-types */
import React, {FC, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Colors,
  useTheme,
  TouchableRipple,
  Text,
  Switch,
} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

// import {useCustomTheme} from '../../context/theme-context';
import {Screen, ScreenNames} from '../../navigation/RootNavigation';
import {connect} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {AuthRepositry} from '../../services/Authentication/AuthRepositry';
import {PreferencesContext} from '../../context/theme-context';
import {UserRoles} from '../../models/ReducerTypes/UserReducerTypes';
import {UserProfileRepository} from '../../services/UserProfile/UserProfileRepository';
import {AsyncStorageService} from '../../services/AsyncStorage';
import {CommonActions} from '@react-navigation/native';
interface IDrawerContentProps {
  userName?: string;
  avatar?: string;
  id: string;
  role: UserRoles;
  followerCount: number;
  followingCount: number;
  archiveCount: number;
  totalPosts: number;
}

interface IDrawerContentDispatchProps {
  logout: Function;
  setProfileViewId: (id: string) => {};
}

interface IProps extends IDrawerContentDispatchProps, IDrawerContentProps {
  navigation: any;
}

const mapStateToProps = ({
  userReducer,
  signalViewReducer,
  archiveReducer,
}: RootState): IDrawerContentProps => {
  return {
    avatar: userReducer.user.parsedData.user?.avatar,
    role: userReducer.user.parsedData?.user.role[0],
    id: userReducer.user.parsedData.user?.id,
    userName: userReducer.user.parsedData.user?.name
      ? userReducer.user.parsedData.user?.name
      : '',
    followerCount: userReducer.followerCount,
    followingCount: userReducer.followingCount,
    totalPosts: signalViewReducer.totalPost,
    archiveCount: archiveReducer.ArchiveCount,
  };
};

const mapDispatchToProps = (dispatch: any): IDrawerContentDispatchProps => {
  return {
    logout: async () => await dispatch(AuthRepositry.logout()),
    setProfileViewId: async (id: string) =>
      dispatch(await UserProfileRepository.getUserProfileById(id)),
  };
};

const DrawerContent: FC<IProps> = props => {
  const theme = useTheme();
  const {toggleTheme, isThemeDark} = React.useContext(PreferencesContext);
  const themeToggleHandler = async () => {
    toggleTheme();
    await AsyncStorageService.setDarkTheme(isThemeDark);
  };
  return (
    <React.Fragment>
      <View style={styles.container}>
        <DrawerContentScrollView {...props}>
          <View style={styles.userInfoSection}>
            <View style={styles.topHeader}>
              <Avatar.Image
                source={
                  props.avatar
                    ? {uri: props.avatar}
                    : require('../../assets/No-User-Avatar.jpeg')
                }
                size={65}
              />
              <View style={styles.nameHeader}>
                <Title
                  style={styles.title}
                  allowFontScaling={true}
                  numberOfLines={1}>
                  {props.userName}
                </Title>
                <Caption style={styles.caption}>
                  {props.role} {<Icon name="star" size={14} color="#FFD700" />}
                </Caption>
              </View>
              <View style={styles.arrowNavbtn}>
                <TouchableOpacity
                  onPress={() => {
                    props.setProfileViewId(props.id);
                    props.navigation.dispatch(
                      CommonActions.navigate({
                        name: ScreenNames.PROFILEDETAILS,
                        params: {id: props.id},
                      }),
                    );
                  }}>
                  <Icon
                    name="arrow-right"
                    color={theme.colors.primary}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.sectionSubHeader}>
              <View style={styles.section}>
                <Caption style={styles.caption}>Following</Caption>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  {props.followerCount}
                </Paragraph>
              </View>
              <View style={styles.section}>
                <Caption style={styles.caption}>Followers</Caption>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  {props.followingCount}
                </Paragraph>
              </View>
              <View style={styles.section}>
                <Caption style={styles.caption}>
                  {props.role && props.role === UserRoles.ANALYST
                    ? 'Post'
                    : 'Save'}
                </Caption>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  {props.role && props.role === UserRoles.ANALYST
                    ? props.totalPosts
                    : props.archiveCount}
                </Paragraph>
              </View>
            </View>
          </View>

          <Drawer.Section
            style={[styles.drawerSection, {borderTopColor: theme.colors.text}]}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="desktop-mac-dashboard" color={color} size={size} />
              )}
              label="Dashboard"
              onPress={() => {
                props.navigation.dispatch(
                  CommonActions.navigate(ScreenNames.DASHBOARD),
                );
              }}
            />

            {props.role && props.role === UserRoles.ANALYST && (
              <>
                <DrawerItem
                  icon={({color, size}) => (
                    <Icon name="chart-bar" color={color} size={size} />
                  )}
                  label="Stock Signals"
                  onPress={() => {
                    props.navigation.dispatch(
                      CommonActions.navigate(ScreenNames.SIGNALBUYSELLPOST),
                    );
                  }}
                />
                <DrawerItem
                  icon={({color, size}) => (
                    <Icon
                      name="account-group-outline"
                      color={color}
                      size={size}
                    />
                  )}
                  label="Manage Clients"
                  onPress={() => {
                    props.navigation.dispatch(
                      CommonActions.navigate(ScreenNames.MANAGEANALYSTCLIENTS),
                    );
                  }}
                />
              </>
            )}
            <DrawerItem
              icon={({color, size}) => (
                <FAIcon name="award" color={color} size={size} />
              )}
              label="Technical Experts"
              onPress={() => {
                props.navigation.dispatch(
                  CommonActions.navigate(ScreenNames.LEADERBOARD),
                );
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="file-chart" color={color} size={size} />
              )}
              label="Signal"
              onPress={() => {
                props.navigation.dispatch(
                  CommonActions.navigate(ScreenNames.BUYSELLSIGNALVIEW),
                );
              }}
            />
            {/* <DrawerItem
              icon={({color, size}) => (
                <Icon name="wechat" color={color} size={size} />
              )}
              label="Globle Chat"
              onPress={() => {
                props.navigation.dispatch(
                  CommonActions.navigate(ScreenNames.GLOBALCHAT),
                );
              }}
            /> */}
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="account-check-outline" color={color} size={size} />
              )}
              label="Support"
              onPress={() => {
                props.navigation.dispatch(
                  CommonActions.navigate(ScreenNames.SUPPORT),
                );
              }}
            />
          </Drawer.Section>
          <Drawer.Section title="Preferences">
            <TouchableRipple onPress={themeToggleHandler}>
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={isThemeDark} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
        </DrawerContentScrollView>
        <Drawer.Section
          style={[
            styles.bottomDrawerSection,
            {borderTopColor: theme.colors.text},
          ]}>
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="exit-to-app" color={color} size={size} />
            )}
            label="Sign Out"
            onPress={() => {
              props.navigation.dispatch(
                CommonActions.navigate(ScreenNames.DASHBOARD),
              );
              props.logout();
            }}
          />
        </Drawer.Section>
      </View>
    </React.Fragment>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  caption: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  sectionSubHeader: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  section: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 30,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    borderTopWidth: 1,
    marginTop: 15,
  },
  bottomDrawerSection: {
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topHeader: {
    flexDirection: 'row',
    marginTop: 15,
    //justifyContent: 'space-between',
  },
  nameHeader: {
    flexDirection: 'column',
    left: 6,
  },
  arrowNavbtn: {
    marginTop: 20,
    position: 'absolute',
    right: 0,
  },
});
