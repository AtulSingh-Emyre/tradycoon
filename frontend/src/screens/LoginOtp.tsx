import React, {FC, useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Title, Text} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import {theme} from '../constants/theme';
import Button from '../templates/Button';
import Background from '../templates/Background';
import Counter from '../components/UserAuth/Counter';
import {AuthRepositry} from '../services/Authentication/AuthRepositry';
import {connect} from 'react-redux';
import {RootState} from '../redux/reducers';
import {AuthOtpActions} from '../redux/actions/auth-actions/AuthOtpAction';
import {OTP_Errors} from '../error/auth/LoginError';
import {useNavigation} from '@react-navigation/native';
import Snackbar from '../templates/Snackbar';
import {IUserAuthData} from '../models/user/UserAuth';
import {SIZES} from '../styles/theme';
import ProfileOtp from '../components/UserProfile/ProfileOtp';
import ActivityIndicatorloader from '../templates/ActivityIndicatorloader';
import {UserRoles} from '../models/ReducerTypes/UserReducerTypes';

interface ISignupProps {
  isLoggingIn: boolean;
  isLoginFailed: {
    error: boolean;
    status: number;
    message: string;
  };
}

interface ISignupDispatchProps {
  login: Function;
  dismissLoginErrorStatus: Function;
}

interface IProps extends ISignupProps, ISignupDispatchProps {
  route: any;
}

const mapStateToProps = ({authLoginReducer}: RootState): ISignupProps => {
  return {
    isLoggingIn: authLoginReducer.isLoading
      ? authLoginReducer.isLoading
      : false,
    isLoginFailed: {
      error: authLoginReducer.errorStatus.error
        ? authLoginReducer.errorStatus.error
        : false,
      status: authLoginReducer.errorStatus.status
        ? authLoginReducer.errorStatus.status
        : 200,
      message: authLoginReducer.errorStatus.message
        ? authLoginReducer.errorStatus.message
        : '',
    },
  };
};

const mapDispatchToProps = (dispatch: any): ISignupDispatchProps => {
  return {
    login: async (user: IUserAuthData) => {
      return dispatch(await AuthRepositry.login({user}));
    },
    dismissLoginErrorStatus: async () => {
      return dispatch(AuthOtpActions.OtpFailedToLoad(200, '', false));
    },
  };
};

const OtpAuth: FC<IProps> = props => {
  const navigation = useNavigation();
  const [confirm, setConfirm] = useState<any>(null);
  const [reset, setreset] = useState(false);
  const [key, setkey] = useState(1);
  const [firstRender, setFirstRender] = useState(1);
  const [incorrectOtpMssg, setincorrectOtpMssg] = useState('');
  const [otpConfirmBtn, setotpConfirmBtn] = useState(false);
  // fetching data on very first mount
  useEffect(() => {
    try {
      signInWithPhoneNumber(props.route.params.phoneWithConteryCode);
    } catch (err) {
      setotpConfirmBtn(false);
    }
  }, [firstRender]);

  const signInWithPhoneNumber = async (phoneNumber: any) => {
    //firebase auth
    try {
      if (phoneNumber) {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
      }
    } catch (err) {
      setotpConfirmBtn(false);
      setincorrectOtpMssg(OTP_Errors.UNKNOWN_ERROR);
    }
  };

  const confirmCode = async (otpCode: string) => {
    try {
      const userInfo = await confirm.confirm(otpCode);
      if (userInfo) {
        const apiData: IUserAuthData = {
          auth_route: 'phone',
          uid: userInfo.user.uid,
          role: [UserRoles.TRADER],
          work_mail: userInfo.user.email || '',
          isNewUser: userInfo.additionalUserInfo?.isNewUser || false,
          phone: userInfo.user.phoneNumber.slice(3),
        };
        const result = await props.login(apiData);
      } else {
        setotpConfirmBtn(false);
        setincorrectOtpMssg(OTP_Errors.INCORRECT_OTP);
        return false;
      }
    } catch (error:any) {
      setotpConfirmBtn(false);
      setincorrectOtpMssg(OTP_Errors.INCORRECT_OTP);
      return false;
    }
  };

  const OtpResetHandler = () => {
    setreset(false);
    setFirstRender(firstRender + 1);
    setkey(key + 1);
    signInWithPhoneNumber(props.route.params.phoneWithConteryCode);
  };
  return (
    <>
      <Background style={styles.container}>
        {otpConfirmBtn && <ActivityIndicatorloader></ActivityIndicatorloader>}

        <View style={styles.childContainer}>
          <Text>OTP has been send to you on</Text>
          <View style={styles.editPhone}>
            <Title>{props.route.params.phoneWithConteryCode}</Title>
            <TouchableOpacity
              style={styles.editIconBtn}
              onPress={() => navigation.goBack()}>
              <FontAwesome name="edit" size={25} style={styles.editIconColor} />
            </TouchableOpacity>
          </View>
          <ProfileOtp Status={true} enteredOtpHandler={confirmCode} />
          <View style={styles.otpInput}>
            {reset ? (
              <Button onPress={OtpResetHandler} mode="contained">
                Resend OTP
              </Button>
            ) : (
              <Counter setkey={setkey} setreset={setreset} key={key} />
            )}
          </View>
        </View>
      </Background>
      <Snackbar
        visible={!otpConfirmBtn && incorrectOtpMssg !== ''}
        onDismiss={() => {
          setotpConfirmBtn(false);
          setincorrectOtpMssg('');
        }}
        action={{
          label: 'Retry',
        }}>
        {incorrectOtpMssg}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  childContainer: {
    marginTop: SIZES.height * 0.1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  otpInput: {
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  UsdCode: {
    borderWidth: 2,
    backgroundColor: 'grey',
  },
  underlineStyleHighLighted: {
    borderColor: theme.colors.accent,
  },
  editIconBtn: {
    marginLeft: 12,
    marginTop: 6,
  },
  editIconColor: {
    color: theme.colors.accent,
  },
  editPhone: {
    flexDirection: 'row',
    padding: 20,
  },
  countDown: {
    backgroundColor: theme.colors.accent,
    marginTop: 12,
    fontSize: 16,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(OtpAuth);
