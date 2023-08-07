import React, {memo} from 'react';
import {Image, StyleSheet} from 'react-native';
import {View} from 'react-native-animatable';

const Logo = () => (
  <View>
    <Image
      style={styles.image}
      source={require('../assets/Tradycoon_logo_2.png')}
    />
  </View>
);

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 220,
  },
});

export default memo(Logo);
