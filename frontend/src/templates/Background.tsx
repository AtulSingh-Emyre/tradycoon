import React, {memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';

import {TouchableWithoutFeedback, Keyboard, SafeAreaView} from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: any;
}

const Background = ({style, children}: Props) => (
  <LinearGradient style={style} colors={['#191714', '#2234AE']}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView>{children}</SafeAreaView>
    </TouchableWithoutFeedback>
  </LinearGradient>
);

export default memo(Background);
