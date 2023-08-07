import React, {FC, useState} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import Button from '../../templates/Button';
import TextInput from '../../templates/TextInput';
import {useNavigation} from '@react-navigation/native';
import {Validators} from '../../constants/validators';
import {AuthErrors} from '../../constants/errorMessages';
import {ScreenNames} from '../../navigation/AuthNavigation';
import {RootState} from '../../redux/reducers';
import {connect} from 'react-redux';
import {TextInput as PaperTextInput, Title} from 'react-native-paper';
import {Gwidth} from '../../styles/Global';

const FLAG_EMOJI = '🇮🇳';
const COUNTRY_CODE = '+91';

interface IPhoneAuthProps {
  loading: boolean;
}
interface IPhoneAuthDispatchProps {}

const mapStateToProps = ({authLoginReducer}: RootState): IPhoneAuthProps => {
  return {
    loading: authLoginReducer.isLoading,
  };
};

const mapDispatchToProps = (dispatch: any): IPhoneAuthDispatchProps => {
  return {};
};

interface IProps extends IPhoneAuthProps, IPhoneAuthDispatchProps {
  checked: boolean;
}

const PhoneAuth: FC<IProps> = props => {
  const navigation = useNavigation();
  const [phone, setphone] = useState('');
  const [isPhone, setisPhone] = useState(false);

  const phoneInputHandler = async (phoneNo: string) => {
    setphone(phoneNo.replace(/[^0-9]/g, ''));
  };

  const otpHandler = async () => {
    if (Validators.phoneValidator(phone)) {
      setisPhone(false);
      const phoneWithConteryCode = `+91${phone}`;
      navigation.navigate(ScreenNames.LOGINOTP, {phoneWithConteryCode});
    } else setisPhone(true);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={Gwidth.width25}>
            <TextInput
              style={{minWidth: 78}}
              mode="outlined"
              value={`${FLAG_EMOJI} ${COUNTRY_CODE}`}
              editable={false}
            />
          </View>
          <View style={Gwidth.width75}>
            <TextInput
              label="Mobile"
              keyboardType="number-pad"
              mode="outlined"
              maxLength={10}
              onChangeText={phoneInputHandler}
              value={phone}
              error={isPhone}
              errorText={AuthErrors.phoneNumberFieldError}
              autoCompleteType={'tel'}
              returnKeyType={'done'}
              right={<PaperTextInput.Icon name="cellphone-android" />}
            />
          </View>
        </View>
        <Button
          mode="contained"
          onPress={otpHandler}
          disabled={!props.checked || props.loading}>
          Send OTP
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
  },

  mobileArea: {
    width: 78,
  },

  Dialog: {
    marginLeft: '26%',
    marginTop: 8,
  },
  Caption: {
    padding: 5,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PhoneAuth);
