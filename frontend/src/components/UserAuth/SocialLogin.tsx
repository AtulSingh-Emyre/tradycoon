import React, {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {theme} from '../../constants/theme';
import {Text} from 'react-native-paper';
import Button from '../../templates/Button';

//redux libraries
import {connect} from 'react-redux';

//services
import {AuthRepositry} from '../../services/Authentication/AuthRepositry';

//data types
import {RootState} from '../../redux/reducers';
import {AuthLoginActions} from '../../redux/actions/auth-actions/AuthLoginAction';

interface ISignupProps {
  isLoggingIn: boolean;
  isLoginFailed: {
    error: boolean;
    status: number;
    message: string;
  };
}

interface ISignupDispatchProps {
  loginViaFacebook: Function;
  loginViaGoogle: Function;
  dismiss: Function;
}

interface IProps extends ISignupDispatchProps, ISignupProps {
  checked: boolean;
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

const mapDispatchToProps = (dispatch: any) => {
  return {
    loginViaFacebook: async () => {
      return dispatch(await AuthRepositry.loginViaFacebook());
    },
    loginViaGoogle: async () => {
      return dispatch(await AuthRepositry.loginViaGoogle());
    },
    dismiss: async () => {
      return dispatch(AuthLoginActions.loginStatusAction(200, false, ''));
    },
  };
};

const SocialLogin: FC<IProps> = props => {
  const [FB, setFB] = useState(false);
  const signInFb = async () => {
    setFB(true);
    props.loginViaFacebook();
  };
  const signInG = async () => {
    setFB(false);
    props.loginViaGoogle();
  };

  return (
    <View>
      <Text style={styles.label}>You may also signup via</Text>
      <View style={styles.row}>
        <Button
          mode="outlined"
          style={styles.fbBtn}
          icon="facebook"
          labelStyle={{color: theme.colors.text}}
          onPress={signInFb}
          isLoding={props.isLoggingIn && FB}
          disabled={!props.checked || props.isLoggingIn}>
          facebook
        </Button>
        <Button
          mode="outlined"
          style={styles.gBtn}
          icon="google"
          isLoding={props.isLoggingIn && !FB}
          labelStyle={{color: theme.colors.text}}
          onPress={signInG}
          disabled={!props.checked || props.isLoggingIn}>
          Google
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  label: {
    alignSelf: 'center',
    color: theme.colors.accent,
    marginTop: 10,
  },
  fbBtn: {
    marginRight: 5,
    width: '40%',
    backgroundColor: '#4285F4',
  },
  gBtn: {
    marginLeft: 5,
    width: '40%',
    backgroundColor: '#DB4437',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SocialLogin);
