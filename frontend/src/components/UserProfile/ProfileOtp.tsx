import React, {useState} from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {ActivityIndicator, Colors} from 'react-native-paper';

interface ProfileOtpProps {
  enteredOtpHandler: Function;
  Status: boolean;
}

const ProfileOtp = (props: ProfileOtpProps) => {
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [propsOTP, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const OtpHandler = async (val: string) => {
    setValue(val);
    if (CELL_COUNT == val.length) {
      await props.enteredOtpHandler(val);
      setValue('');
    }
  };
  return (
    <SafeAreaView style={styles.root}>
      <CodeField
        ref={ref}
        {...propsOTP}
        value={value}
        onChangeText={code => OtpHandler(code)}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      {!props.Status && value.length !== 6 && (
        <ActivityIndicator
          style={styles.codeFieldRoot}
          size={30}
          animating={true}
          color={Colors.green500}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: Colors.white,
    color: Colors.green400,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: Colors.white,
  },
});

export default ProfileOtp;
