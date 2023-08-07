import React from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SupportForm from '../components/Support/SupportForm';
import LottieView from 'lottie-react-native';
import {SIZES} from '../styles/theme';
import {Button, Colors, IconButton, Title, useTheme} from 'react-native-paper';
import {Linking} from 'react-native';

const Support = () => {
  const theme = useTheme();
  const phoneNo = `+91-9901214387`;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.imageCantainer}>
          <Image
            source={require('../assets/Tradycoon_logo_1.png')}
            style={styles.image}
          />
        </View>
        <SupportForm />
        <View style={{padding: 10}}>
          <Title>Contact Us : </Title>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${phoneNo}`);
            }}>
            <Title style={{color: Colors.blue500}}>
              {' '}
              <Icon
                name="phone-classic"
                color={Colors.pink300}
                size={24}
              />{' '}
              {phoneNo}
            </Title>
          </TouchableOpacity>
          <TouchableOpacity
            style={{alignSelf: 'baseline'}}
            onPress={() => {
              Linking.openURL(`whatsapp://send?text=Hello&phone=${phoneNo}`);
            }}>
            <Title style={{color: Colors.blue500}}>
              {' '}
              <Icon
                name="facebook-messenger"
                color={Colors.green500}
                size={24}
              />{' '}
              {phoneNo}
            </Title>
          </TouchableOpacity>
        </View>
        <View>
          <LottieView
            style={{
              width: SIZES.width,
            }}
            source={require('../assets/Support-page.json')}
            autoPlay
            loop
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageCantainer: {
    alignItems: 'center',
    padding: 12,
  },
  image: {
    width: SIZES.width * 0.8,
    height: 30,
  },
});
