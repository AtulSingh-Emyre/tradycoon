import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import NotificationList from '../components/UserNotification/NotificationList';

interface NotificationScreenProps {}

const NotificationScreen = (props: NotificationScreenProps) => {
  return (
    <View style={styles.container}>
      <NotificationList />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
