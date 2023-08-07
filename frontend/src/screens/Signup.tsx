import React, {useRef} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Background from '../templates/Background';
import Logo from '../templates/Logo';
import PhoneAuth from '../components/UserAuth/PhoneAuth';
import SocialLogin from '../components/UserAuth/SocialLogin';
import Checkbox from '../templates/CheckBox';
import {Subheading, Colors, useTheme} from 'react-native-paper';
import {Caption} from 'react-native-paper';
import PrivacyTermsConditions from '../components/UserAuth/PrivacyTermsConditions';
import {RootState} from '../redux/reducers';
import {AuthLoginActions} from '../redux/actions/auth-actions/AuthLoginAction';
import {connect} from 'react-redux';
import Snackbar from '../templates/Snackbar';
import {ScrollView} from 'react-native-gesture-handler';
import {SIZES} from '../styles/theme';
import {ScreenNames} from '../navigation/AuthNavigation';
import {useNavigation} from '@react-navigation/native';
interface ISignupScreenProps {
  status: {
    error: boolean;
    message: string;
    status: number;
  };
  loggedIn: boolean;
  loading: boolean;
}
interface ISignupScreenDispatchProps {
  dismiss: () => {};
}

const mapStateToProps = ({
  authLoginReducer,
  userReducer,
}: RootState): ISignupScreenProps => {
  return {
    loading: authLoginReducer.isLoading,
    loggedIn: userReducer.loggedIn,
    status: authLoginReducer.errorStatus,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dismiss: async () => {
      return dispatch(AuthLoginActions.loginStatusAction(200, false, ''));
    },
  };
};

interface TestProps extends ISignupScreenProps, ISignupScreenDispatchProps {
  route: any;
}

const Signup = React.memo((props: TestProps) => {
  const childRef = useRef<any>();
  const navigation = useNavigation();
  const theme = useTheme();
  const [checked, setChecked] = React.useState(() =>
    props.route.params.state ? false : true,
  );
  return (
    <>
      <Background style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.subContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.top}>
            <Logo />
            <Subheading style={{color: Colors.white}}>
              To start your trading dream here
            </Subheading>
          </View>
          <View>
            <PhoneAuth checked={checked} />
            <SocialLogin checked={checked} />
          </View>
          <View style={styles.bottomText}>
            <Checkbox
              color={theme.colors.notification}
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
            />
            <Caption style={{color: Colors.grey500}}>
              By proceeding, you agree to Tradycoon's{' '}
            </Caption>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ScreenNames.PRIVACYTERMSANDCONDITIONS)
              }>
              <Caption style={{color: theme.colors.notification}}>
                Terms &amp; Conditions and Privacy Policy
              </Caption>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Background>
      <Snackbar
        visible={props.status.error}
        action={{
          label: 'Close',
          onPress: () => {
            props.dismiss();
          },
        }}
        onDismiss={() => {
          props.dismiss();
        }}>
        {props.status.message.toString()}
      </Snackbar>
    </>
  );
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  subContainer: {
    justifyContent: 'space-between',
  },
  top: {
    paddingTop: SIZES.height * 0.06,
    alignItems: 'center',
  },

  bottomText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '10%',
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
