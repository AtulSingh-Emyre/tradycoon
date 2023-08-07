import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput as Input, HelperText} from 'react-native-paper';

type Props = React.ComponentProps<typeof Input> & {errorText?: string};

const TextInput = ({errorText, mode, ...props}: Props) => (
  <View style={styles.container}>
    <Input mode={mode} {...props} />
    {errorText && props.error && (
      <HelperText type="error" visible={props.error}>
        {errorText}
      </HelperText>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
});

export default memo(TextInput);
