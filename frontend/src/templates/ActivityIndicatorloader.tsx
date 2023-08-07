import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Portal, useTheme} from 'react-native-paper';

const ActivityIndicatorloader = () => {
  const theme = useTheme();
  return (
    <ActivityIndicator
      style={styles.container}
      animating={true}
      size={50}
      color={theme.colors.primary}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default memo(ActivityIndicatorloader);
