import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-paper';

interface ProfileDetailsProps {
  user: any;
}

const ProfileDetails = (props: ProfileDetailsProps) => {
  return (
    <View>
      <Avatar.Image size={100} source={{uri: props.user.img}} />
      <Text>{props.user.phone + ' ' + props.user.name + ' '}</Text>
    </View>
  );
};

export default ProfileDetails;
