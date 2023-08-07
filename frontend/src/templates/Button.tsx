import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {Button as PaperButton} from 'react-native-paper';

type Props = React.ComponentProps<typeof PaperButton> & {isLoding?: boolean};

const Button = ({isLoding, style, children, ...props}: Props) => (
  <PaperButton
    loading={isLoding}
    style={[styles.button, style]}
    labelStyle={styles.text}
    {...props}>
    {children}
  </PaperButton>
);

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
  },
  text: {
    fontWeight: 'bold',
  },
});

export default memo(Button);
