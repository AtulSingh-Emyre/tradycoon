import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {WebView} from 'react-native-webview';

const PrivacyTermsAndConditions = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <WebView source={{uri: 'https://sites.google.com/view/tradycoon/home'}} />
    </View>
  );
};

export default PrivacyTermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
