import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {Colors, Paragraph, useTheme} from 'react-native-paper';

interface Props {
  message: string;
  code: string;
}

const TextMessage = ({message, code}: Props) => {
  const theme = useTheme();
  return <Paragraph style={styles.success}>{message}</Paragraph>;
};

const styles = StyleSheet.create({
  success: {
    color: Colors.green400,
  },
  error: {
    color: Colors.green400,
  },
  warning: {
    color: Colors.green400,
  },
});
export default memo(TextMessage);
