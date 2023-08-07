import React, {memo} from 'react';
import {IconButton, useTheme} from 'react-native-paper';
import {StackActions} from '@react-navigation/native';

interface Props {
  navigation: any;
  route?: any;
}

const TopHeaderBackButton = ({navigation, route}: Props) => {
  const theme = useTheme();
  return (
    <IconButton
      icon="arrow-left"
      color={theme.colors.primary}
      size={36}
      onPress={() => navigation.goBack()}
    />
  );
};

export default memo(TopHeaderBackButton);
