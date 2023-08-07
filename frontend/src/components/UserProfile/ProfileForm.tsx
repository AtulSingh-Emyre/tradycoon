import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  Text,
  Avatar,
  Checkbox,
  Caption,
  Button,
  Colors,
  Title,
  useTheme,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import Snackbar from '../../templates/Snackbar';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Validators} from '../../constants/validators';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TextInput from '../../templates/TextInput';
import {TextInput as PaperTextInput} from 'react-native-paper';
import {UserProfileErrors} from '../../constants/errorMessages';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import Badge from '../../templates/Badge';
import {UserProfileRepository} from '../../services/UserProfile/UserProfileRepository';
import {RootState} from '../../redux/reducers';
import {connect} from 'react-redux';
import SegmentChip from './SegmentChip';
import ProfileOtp from './ProfileOtp';
import {AuthRepositry} from '../../services/Authentication/AuthRepositry';
import {Gwidth} from '../../styles/Global';
import ActivityIndicatorloader from '../../templates/ActivityIndicatorloader';
import {
  ProfileStatus,
  UserRoles,
} from '../../models/ReducerTypes/UserReducerTypes';
import moment from 'moment';
import {SIZES} from '../../styles/theme';
import {useNavigation} from '@react-navigation/native';
import {Common_Errors} from '../../error/auth/LoginError';
import {AuthOtpActionTypes} from '../../redux/actions/auth-actions/AuthOtpAction';

interface IPorfileFormProps {
  user: any;
  userId: string;
  role: UserRoles;
  name: string;
  profileStatus: string;
  avatar: string;
  work_mail: string;
  experience: string;
  business_account: boolean;
  sebiReg_No: string;
  business_name: string;
  website_url: string;
  description: string;
  phone: string;
  DOB: Date;
  interests: Array<any>;
  formUpdationStatus: {
    error: boolean;
    loading: boolean;
    status: number;
    message: string;
  };
  otp: number;
  verificationId: string;
  otpStatus: {
    error: boolean;
    status: number;
    message: string;
  };
}

interface IProfileFormDispatchProps {
  updateUserDetails: Function;
  verifyPhoneAndSendOtp: Function;
  verifyEmail: Function;
  dismiss: Function;
}

interface ProfileFormProps
  extends IPorfileFormProps,
    IProfileFormDispatchProps {
  phone: string;
  route?: any;
  navigation: any;
}

const mapStateToProps = ({
  userReducer,
  authOtpReducer,
}: RootState): IPorfileFormProps => {
  return {
    user: userReducer.user,
    userId: userReducer.user.parsedData.user.id,
    avatar: userReducer.user.parsedData.user.avatar,
    business_account: userReducer.user.parsedData.user.business_account,
    business_name: userReducer.user.parsedData.user.business_name,
    description: userReducer.user.parsedData.user.description,
    sebiReg_No: userReducer.user.parsedData.user.sebiReg_No,
    DOB: userReducer.user.parsedData.user.DOB,
    experience: userReducer.user.parsedData.user.experience.toString(),
    interests: userReducer.user.parsedData.user.interests,
    name: userReducer.user.parsedData.user.name,
    phone: userReducer.user.parsedData.user.phone.toString(),
    website_url: JSON.parse(JSON.stringify(userReducer.user.parsedData.user))
      .website_url,
    work_mail: JSON.parse(JSON.stringify(userReducer.user.parsedData.user))
      .work_mail,
    formUpdationStatus: userReducer.updationStatus,
    role: userReducer.user.parsedData.user.role[0],
    otp: authOtpReducer.otp,
    verificationId: authOtpReducer.verificationId,
    otpStatus: authOtpReducer.errorStatus,
    profileStatus: userReducer.user.parsedData.user.profileStatus,
  };
};

const mapDispatchToProps = (dispatch: any): IProfileFormDispatchProps => {
  return {
    updateUserDetails: async (updatedUserDetails: any, id: string) => {
      return await dispatch(
        await UserProfileRepository.updateUserDetails(updatedUserDetails, id),
      );
    },
    verifyPhoneAndSendOtp: async (phone: string) => {
      return await dispatch(await AuthRepositry.sendOtp({phone}));
    },
    verifyEmail: async (email: string) => {
      return await dispatch(await AuthRepositry.verifyEmail({userMail: email}));
    },
    dismiss: async () => {
      return await dispatch(await UserProfileRepository.dismiss());
    },
  };
};

const ProfileForm = (props: ProfileFormProps) => {
  const theme = useTheme();
  // If null, no SMS has been sent
  const [otpConfirm, setOtpConfirm] = useState<any>(null);
  const roleChange = props.role === UserRoles.ANALYST ? true : false;
  const fall = new Animated.Value(1);
  const [showDate, setShowDate] = useState(false);
  const [profileImage, setProfileImage] = useState(props.avatar);
  const [loader, setloader] = useState(false);
  const bottomSheetRef = useRef<any>(null);
  const [destSnap, setDestSnap] = useState(0);
  const [BSTrget, setBSTrget] = useState<string>();
  const [isPhoneOtpSuccess, setIsPhoneOtpSuccess] = useState(false);
  const [isEmailOtpSuccess, setIsEmailOtpSuccess] = useState(false);
  const [isAnalyst, setIsAnalyst] = React.useState(roleChange);
  const navigation = useNavigation();
  const [user, setUser] = useState({
    id: props.userId,
    name: props.name,
    work_mail: props.work_mail,
    Analyst: props.role,
    experience: props.experience == '0' ? '' : props.experience,
    business_account: props.business_account,
    sebiReg_No: props.sebiReg_No,
    business_name: props.business_name,
    website_url: props.website_url,
    description: props.description,
    phone: props.phone,
    DOB: new Date(props.DOB),
    interests: props.interests,
    profileStatus: props.profileStatus,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setUser({
        id: props.userId,
        name: props.name,
        work_mail: props.work_mail,
        Analyst: props.role,
        experience: props.experience == '0' ? '' : props.experience,
        business_account: props.business_account,
        sebiReg_No: props.sebiReg_No,
        business_name: props.business_name,
        website_url: props.website_url,
        description: props.description,
        phone: props.phone,
        DOB: new Date(props.DOB),
        interests: props.interests,
        profileStatus: props.profileStatus,
      });
      setDestSnap(0);
    });
    return unsubscribe;
  }, [navigation, props]);
  const [errorStatus, setErrorStatus] = useState({
    name: false,
    mail: false,
    Phone: false,
    sebiReg_No: false,
    business_name: false,
    website_url: false,
    experience: false,
    description: false,
    profileStatus: false,
    verifiedPhone: props.phone.length == 0 ? false : true,
    verifiedEmail: props.work_mail.length == 0 ? false : true,
    message: '',
    success: false,
    error: false,
  });

  const fullNameHandler = (name: string) => {
    setUser({...user, name: name.replace(/[^a-zA-Z ]/g, '')});
    setErrorStatus({...errorStatus, name: false});
  };
  const workPhoneHandler = (phone: string) => {
    setUser({...user, phone: phone.replace(/[^0-9]/, '')});
    setErrorStatus({...errorStatus, Phone: false, verifiedPhone: false});
  };
  const workEmailHandler = (work_mail: string) => {
    setUser({...user, work_mail});
    setErrorStatus({...errorStatus, mail: false, verifiedEmail: false});
  };
  const businessNameHandler = (business_name: string) => {
    setUser({...user, business_name});
    setErrorStatus({...errorStatus, business_name: false});
  };
  const sebiRegNoHandler = (sebiReg_No: string) => {
    setUser({...user, sebiReg_No});
    setErrorStatus({...errorStatus, sebiReg_No: false});
  };
  const websiteHandler = (website_url: string) => {
    setUser({...user, website_url});
    setErrorStatus({...errorStatus, website_url: false});
  };
  const experienceHandler = (experience: string) => {
    setUser({...user, experience: experience.replace(/[^0-9]/, '')});
    setErrorStatus({...errorStatus, experience: false});
  };
  const DescriptionHandler = (description: string) => {
    setUser({...user, description});
    setErrorStatus({...errorStatus, description: false});
  };

  const dataValidator = () => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (user.name.length == 0) {
      setErrorStatus({...errorStatus, name: true});
      return false;
    } else if (user.phone.length != 10) {
      setErrorStatus({...errorStatus, Phone: true});
      return false;
    } else if (!re.test(user.work_mail)) {
      setErrorStatus({...errorStatus, mail: true});
      return false;
    } else {
      return true;
    }
  };

  const newDataObject = () => {
    let setProfileStatus;
    if (user.Analyst !== UserRoles.ANALYST && isAnalyst) {
      setProfileStatus = ProfileStatus.REQUEST_FOR_ANALYST;
    } else if (user.Analyst == UserRoles.ANALYST && !isAnalyst) {
      setProfileStatus = ProfileStatus.REQUEST_FOR_TRADER;
    } else {
      setProfileStatus = ProfileStatus.NEW_USER;
    }
    // looks for if there is any data change across all fields and returns an object of the values that are changed.
    const updatedUserDetails: any = {};
    props.name !== user.name
      ? (updatedUserDetails['name'] = user.name)
      : undefined;
    props.avatar !== profileImage
      ? (updatedUserDetails['avatar'] = profileImage)
      : undefined;
    props.work_mail !== user.work_mail
      ? (updatedUserDetails['work_mail'] = user.work_mail)
      : undefined;
    roleChange !== isAnalyst
      ? (updatedUserDetails['profileStatus'] = setProfileStatus)
      : undefined;
    parseInt(props.experience) !== parseInt(user.experience) &&
    !isNaN(parseInt(user.experience))
      ? (updatedUserDetails['experience'] = parseInt(
          user.experience?.length > 0 ? user.experience : '0',
        ))
      : undefined;
    props.business_account !== user.business_account
      ? (updatedUserDetails['business_account'] = user.business_account)
      : undefined;
    props.phone !== user.phone
      ? (updatedUserDetails['phone'] = parseInt(user.phone))
      : undefined;
    props.business_name !== user.business_name
      ? (updatedUserDetails['business_name'] = user.business_name)
      : undefined;
    props.website_url !== user.website_url
      ? (updatedUserDetails['website_url'] = user.website_url)
      : undefined;
    props.description !== user.description
      ? (updatedUserDetails['description'] = user.description)
      : undefined;
    moment(props.DOB).format('DD-MMM-YYYY') !==
    moment(user.DOB).format('DD-MMM-YYYY')
      ? (updatedUserDetails['DOB'] = user.DOB)
      : undefined;

    JSON.stringify(props.interests) !== JSON.stringify(user.interests)
      ? (updatedUserDetails['interests'] = user.interests)
      : undefined;
    props.sebiReg_No !== user.sebiReg_No
      ? (updatedUserDetails['sebiReg_No'] = user.sebiReg_No)
      : undefined;
    return updatedUserDetails;
  };

  const submitHandler = async () => {
    //validations of data
    if (!dataValidator()) return;
    else {
    }

    // Checking if phone and email are verified
    if (!errorStatus.verifiedPhone) {
      setErrorStatus({
        ...errorStatus,
        message: 'Phone number not verified',
        error: true,
      });
      return;
    } else if (!errorStatus.verifiedEmail) {
      setErrorStatus({
        ...errorStatus,
        message: 'Email address not verified',
        error: true,
      });
      return;
    }
    //checking if data was changed
    const updatedUserDetails = newDataObject();
    //updation of data
    if (Object.entries(updatedUserDetails).length !== 0) {
      await props.updateUserDetails(updatedUserDetails, user.id);
    }
    if (!props.formUpdationStatus.error) {
      setErrorStatus({...errorStatus, success: true});
      if (
        updatedUserDetails.profileStatus ===
          ProfileStatus.REQUEST_FOR_ANALYST ||
        updatedUserDetails.profileStatus === ProfileStatus.REQUEST_FOR_TRADER
      ) {
        setUser({...user, profileStatus: updatedUserDetails.profileStatus});
      }
    }
  };

  const takePhotoFromCamera = () => {
    void ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((profileImage: any) => {
      setProfileImage(profileImage.path);
      profileImageUpload(profileImage.path);
      bottomSheetRef.current.snapTo(1);
    });
  };

  const choosePhotoFromLibrary = () => {
    void ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((profileImage: any) => {
      setProfileImage(profileImage.path);
      profileImageUpload(profileImage.path);
      bottomSheetRef.current.snapTo(1);
    });
  };

  const renderInnerBS = () => {
    if (BSTrget == 'UpdatePhoto') {
      return renderInnerUploadPhoto();
    } else if (BSTrget == 'UpdatePhone') {
      return renderInnerUpdatePhone();
    } else if (BSTrget == 'UpdateEmail') {
      return renderInnerUpdateEmail();
    } else {
      return null;
    }
  };
  const renderHeader = () => (
    <View style={[styles.header, {backgroundColor: theme.colors.primary}]}>
      <View style={styles.panelHandle} />
    </View>
  );

  const renderInnerUploadPhoto = () => (
    <View style={[styles.panel, {backgroundColor: theme.colors.background}]}>
      <Text style={styles.panelTitle}>Upload Photo</Text>
      <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={takePhotoFromCamera}>
          <View style={styles.column}>
            <Icon name="camera" color={theme.colors.primary} size={60} />
            <Text style={styles.panelButtonTitle}>Camera</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={choosePhotoFromLibrary}>
          <View style={styles.column}>
            <Icon name="image" color={theme.colors.primary} size={60} />
            <Text style={styles.panelButtonTitle}>Gallery</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={() => bottomSheetRef.current.snapTo(1)}>
          <View style={styles.column}>
            <Icon name="delete-circle" color={theme.colors.primary} size={60} />
            <Text style={styles.panelButtonTitle}>Remove</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderInnerUpdatePhone = () => (
    <View style={[styles.panel, {backgroundColor: theme.colors.background}]}>
      <Title>{user.phone}</Title>
      <ProfileOtp
        Status={isPhoneOtpSuccess}
        enteredOtpHandler={phoneOtphandler}
      />
    </View>
  );
  const emailOtphandler = async (code: any) => {
    if (props.otpStatus.error) return;
    else if (props.otp == parseInt(code)) {
      bottomSheetRef.current.snapTo(1);
      await props.updateUserDetails({work_mail: user.work_mail}, user.id);
      let userData = auth().currentUser?.updateEmail(user.work_mail); //updateing Email in Firebase
      console.log(userData);
      setErrorStatus({
        ...errorStatus,
        verifiedEmail: true,
        error: true,
        message: 'Email number verified',
      });
      setIsEmailOtpSuccess(true);
      return true;
    } else {
      setErrorStatus({
        ...errorStatus,
        message: 'Entered otp may be incorrect, please try again',
        error: true,
      });
      setIsEmailOtpSuccess(false);
      return false;
    }
  };
  const phoneOtphandler = async (code: any) => {
    try {
      if (props.verificationId) {
        const credential = await auth.PhoneAuthProvider.credential(
          props.verificationId,
          code,
        );
        if (credential) {
          let userData = await auth().currentUser?.updatePhoneNumber(
            credential,
          );
          bottomSheetRef.current.snapTo(1);
          await props.updateUserDetails({phone: parseInt(user.phone)}, user.id);
          setErrorStatus({
            ...errorStatus,
            verifiedPhone: true,
            error: true,
            message: 'Phone number verified',
          });
          setIsPhoneOtpSuccess(true);
          return true;
        } else {
          setErrorStatus({
            ...errorStatus,
            message: 'Entered otp may be incorrect, please try again',
            error: true,
          });
          setIsPhoneOtpSuccess(false);
          return false;
        }
      } else {
        setErrorStatus({
          ...errorStatus,
          message: 'Entered otp may be incorrect, please try again',
          error: true,
        });
      }
      setIsPhoneOtpSuccess(false);
    } catch (error: any) {
      if (
        error.code === 'auth/invalid-verification-code' ||
        error.code === 'auth/session-expired'
      ) {
        setErrorStatus({
          ...errorStatus,
          message: 'Entered otp may be incorrect, please try again',
          error: true,
        });
      } else {
        setErrorStatus({
          ...errorStatus,
          message: Common_Errors.UNKNOWN_ERROR,
          error: true,
        });
      }
      setIsPhoneOtpSuccess(false);
      return false;
    }
  };
  const OpenBSUpdatePhone = async (value: string) => {
    try {
      if (value.length == 10 && !errorStatus.Phone) {
        if (value === props.phone) {
          setErrorStatus({...errorStatus, verifiedPhone: true});
          return;
        }
        setErrorStatus({...errorStatus, verifiedPhone: false});
        BootomSheetRenderInnerSnap(0, 300, 'UpdatePhone');

        const response = await props.verifyPhoneAndSendOtp('+91' + user.phone);
        if (response.type == AuthOtpActionTypes.OTP_FAILED) {
          bottomSheetRef.current.snapTo(1);
        }
      } else {
        setErrorStatus({...errorStatus, Phone: true});
      }
    } catch (error: any) {
      setErrorStatus({
        ...errorStatus,
        message: Common_Errors.UNKNOWN_ERROR,
        error: true,
      });
    }
  };
  const OpenBSUpdateEmail = (value: any) => {
    if (value != '' && !errorStatus.mail) {
      if (value === props.work_mail) {
        setErrorStatus({...errorStatus, verifiedEmail: true});
        return;
      }
      props.verifyEmail(user.work_mail);
      BootomSheetRenderInnerSnap(0, 260, 'UpdateEmail');
    } else {
      setErrorStatus({...errorStatus, mail: true});
    }
  };

  const renderInnerUpdateEmail = () => (
    <View style={[styles.panel, {backgroundColor: theme.colors.background}]}>
      <Title>{user.work_mail}</Title>
      <ProfileOtp
        Status={isEmailOtpSuccess}
        enteredOtpHandler={emailOtphandler}
      />
    </View>
  );

  const BootomSheetRenderInnerSnap = (
    initialSnap: number,
    DestSnap: number,
    trget: string,
  ) => {
    setBSTrget(trget);
    setDestSnap(DestSnap);
    bottomSheetRef.current.snapTo(initialSnap);
  };
  const handleSegmentChange = (item: any) => {
    setUser({...user, interests: item});
  };

  const onChangeDOB = (_event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || user.DOB;
    setShowDate(Platform.OS === 'ios');
    setUser({...user, DOB: currentDate});
  };

  const showDatepicker = () => {
    setShowDate(true);
  };

  const profileImageUpload = async (uploadUri: string) => {
    if (uploadUri == null) {
      return null;
    }
    setloader(true);
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    const extension = filename.substring(filename.lastIndexOf('.') + 1);
    filename = props.userId + '.' + extension;
    const storageRef = storage().ref(`Profile/${filename}`);
    const task = storageRef.putFile(uploadUri);
    try {
      await task;
      const url = await storageRef.getDownloadURL(); //storing  in database url
      setProfileImage(url);
      await props.updateUserDetails({avatar: url}, user.id);
      setloader(false);
    } catch (e) {
      setloader(false);
      return null;
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        overdragResistanceFactor={0}
        enabledInnerScrolling={false}
        snapPoints={[destSnap, 0]}
        renderContent={renderInnerBS}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
        enabledContentGestureInteraction={false}
      />
      <ScrollView>
        {loader && <ActivityIndicatorloader></ActivityIndicatorloader>}
        <Animated.View
          style={{
            margin: 12,
            opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
          }}>
          <View style={styles.ImageBox}>
            <TouchableOpacity
              style={styles.avatarbackground}
              onPress={() => BootomSheetRenderInnerSnap(0, 260, 'UpdatePhoto')}>
              <Avatar.Image
                size={80}
                source={
                  profileImage
                    ? {uri: profileImage}
                    : require('../../assets/No-User-Avatar.jpeg')
                }
              />
              <Icon
                style={styles.avatarIcon}
                name="circle-edit-outline"
                color={Colors.green500}
                size={18}
              />
            </TouchableOpacity>
            <View style={styles.column}>
              <View style={styles.rowreverse}>
                <Checkbox
                  status={
                    user.profileStatus == ProfileStatus.REQUEST_FOR_ANALYST ||
                    user.profileStatus == ProfileStatus.REQUEST_FOR_TRADER ||
                    isAnalyst
                      ? 'checked'
                      : 'unchecked'
                  }
                  disabled={
                    user.profileStatus == ProfileStatus.REQUEST_FOR_ANALYST ||
                    user.profileStatus == ProfileStatus.REQUEST_FOR_TRADER
                  }
                  onPress={() => {
                    setIsAnalyst(!isAnalyst);
                  }}
                />

                {(user.profileStatus == ProfileStatus.REQUEST_FOR_ANALYST ||
                  user.profileStatus == ProfileStatus.REQUEST_FOR_TRADER) && (
                  <Caption style={styles.verificationText}>
                    Verification pending will contact you shortly
                  </Caption>
                )}
                <Text style={styles.mt8}>
                  Analyst{' '}
                  {user.profileStatus == ProfileStatus.VERIFIED_ANALYST && (
                    <Caption style={{color: theme.colors.notification}}>
                      (Verified)
                    </Caption>
                  )}
                </Text>
              </View>
              <View style={styles.rowreverse}>
                <Checkbox
                  status={user.business_account ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setUser({
                      ...user,
                      business_account: !user.business_account,
                    });
                  }}
                />
                <Text style={styles.mt8}>Business Account</Text>
              </View>
            </View>
          </View>
          <TextInput
            label="Full Name *"
            maxLength={50}
            mode="outlined"
            value={user.name}
            onChangeText={fullNameHandler}
            error={errorStatus.name}
            errorText={UserProfileErrors.profileNameFieldError}
            returnKeyType={'next'}
            textContentType={'name'}
            right={<PaperTextInput.Icon name="account" />}
          />

          <View style={styles.action}>
            <View style={Gwidth.width80}>
              <TextInput
                label="Phone *"
                keyboardType="number-pad"
                mode="outlined"
                maxLength={10}
                value={user.phone}
                onChangeText={workPhoneHandler}
                error={errorStatus.Phone}
                errorText={UserProfileErrors.phoneNumberFieldError}
                returnKeyType={'next'}
                autoCompleteType={'tel'}
                right={<PaperTextInput.Icon name="cellphone-android" />}
                left={<PaperTextInput.Affix text="+91" />}
              />
            </View>
            <View style={[Gwidth.width20, styles.verifiedBtn]}>
              <Button
                mode="contained"
                style={
                  errorStatus.verifiedPhone
                    ? styles.verifiedBadge
                    : styles.verifyBadge
                }
                disabled={user.phone.length != 10 || errorStatus.verifiedPhone}
                compact={true}
                onPress={() => {
                  OpenBSUpdatePhone(user.phone);
                }}>
                <Text
                  style={{
                    fontSize: SIZES.base,
                    fontWeight: 'bold',
                  }}>
                  {errorStatus.verifiedPhone ? 'Verified' : 'Verify'}
                </Text>
              </Button>
            </View>

            {/* <TouchableOpacity
              disabled={user.phone.length != 10 || errorStatus.verifiedPhone}
              style={styles.verifiedBtn}
              onPress={() => {
                OpenBSUpdatePhone(user.phone);
              }}>
              <Badge
                style={
                  errorStatus.verifiedPhone
                    ? styles.verifiedBadge
                    : styles.verifyBadge
                }
                visible={true}>
                {errorStatus.verifiedPhone ? 'Verified' : 'Verify'}
              </Badge>
            </TouchableOpacity> */}
          </View>
          <View style={styles.action}>
            <View style={Gwidth.width80}>
              <TextInput
                label="Email *"
                maxLength={50}
                mode="outlined"
                value={user.work_mail}
                onChangeText={workEmailHandler}
                error={errorStatus.mail}
                errorText={UserProfileErrors.emailAddressFieldError}
                returnKeyType={'next'}
                autoCompleteType={'email'}
                right={<PaperTextInput.Icon name="email" />}
              />
            </View>
            <View style={[Gwidth.width20, styles.verifiedBtn]}>
              <Button
                mode="contained"
                style={
                  errorStatus.verifiedEmail
                    ? styles.verifiedBadge
                    : styles.verifyBadge
                }
                disabled={
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.work_mail) ||
                  errorStatus.verifiedEmail
                }
                compact={true}
                onPress={() => {
                  OpenBSUpdateEmail(user.work_mail);
                }}>
                <Text
                  style={{
                    fontSize: SIZES.base,
                    fontWeight: 'bold',
                  }}>
                  {errorStatus.verifiedEmail ? 'Verified' : 'Verify'}
                </Text>
              </Button>
            </View>

            {/* <TouchableOpacity
              style={styles.verifiedBtn}
              disabled={
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.work_mail) ||
                errorStatus.verifiedEmail
              }
              onPress={() => {
                OpenBSUpdateEmail(user.work_mail);
              }}>
              <Badge
                style={
                  errorStatus.verifiedEmail
                    ? styles.verifiedBadge
                    : styles.verifyBadge
                }
                visible={true}>
                {errorStatus.verifiedEmail ? 'Verified' : 'Verify'}
              </Badge>
            </TouchableOpacity> */}
          </View>
          <View style={styles.action}>
            <View style={styles.width50}>
              <TouchableOpacity onPress={showDatepicker}>
                <TextInput
                  label="DOB *"
                  mode="outlined"
                  value={moment(user.DOB).format('DD-MMM-YYYY')}
                  editable={false}
                  returnKeyType={'next'}
                  right={
                    <PaperTextInput.Icon
                      onPress={() => setShowDate(true)}
                      name="calendar-month"
                    />
                  }
                />
              </TouchableOpacity>
              {showDate && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={user.DOB}
                  mode={'date'}
                  is24Hour={true}
                  display="default"
                  maximumDate={new Date()}
                  onChange={onChangeDOB}
                />
              )}
            </View>
            <View style={styles.width50}>
              <TextInput
                label="Experience *"
                maxLength={2}
                keyboardType="number-pad"
                mode="outlined"
                value={user.experience}
                onChangeText={experienceHandler}
                error={
                  Validators.namesValidator(user.experience) &&
                  errorStatus.experience
                }
                errorText={UserProfileErrors.experienceFieldError}
                returnKeyType={'next'}
                right={<PaperTextInput.Icon name="account-cowboy-hat" />}
              />
            </View>
          </View>
          <View style={styles.Interests}>
            <Caption>Interests</Caption>
            <View style={styles.row}>
              {
                <SegmentChip
                  onValueChange={handleSegmentChange}
                  chipItem={user.interests}
                />
              }
            </View>
          </View>
          {user.Analyst ? (
            <View>
              <TextInput
                label="SEBI Registration No."
                mode="outlined"
                maxLength={12}
                value={user.sebiReg_No}
                onChangeText={sebiRegNoHandler}
                returnKeyType={'next'}
                error={
                  Validators.namesValidator(user.sebiReg_No) &&
                  errorStatus.sebiReg_No
                }
                errorText={UserProfileErrors.sebiRegNo}
                right={<PaperTextInput.Icon name="card-account-details-star" />}
              />
              {user.business_account ? (
                <View>
                  <TextInput
                    label="Company/Business name *"
                    mode="outlined"
                    maxLength={50}
                    value={user.business_name}
                    onChangeText={businessNameHandler}
                    returnKeyType={'next'}
                    error={
                      Validators.namesValidator(user.business_name) &&
                      errorStatus.business_name
                    }
                    errorText={UserProfileErrors.businessNameFieldError}
                    right={<PaperTextInput.Icon name="check-decagram" />}
                  />
                  <TextInput
                    label="Website *"
                    maxLength={50}
                    mode="outlined"
                    value={user.website_url}
                    onChangeText={websiteHandler}
                    returnKeyType={'next'}
                    error={
                      Validators.urlValidator(user.website_url) &&
                      errorStatus.website_url
                    }
                    errorText={UserProfileErrors.websiteFieldError}
                    right={<PaperTextInput.Icon name="web" />}
                  />
                  <TextInput
                    label="Description *"
                    maxLength={500}
                    mode="outlined"
                    multiline={true}
                    value={user.description}
                    onChangeText={DescriptionHandler}
                    returnKeyType={'done'}
                    error={
                      Validators.descriptionValidator(user.description) &&
                      errorStatus.description
                    }
                    errorText={UserProfileErrors.descriptionFieldError}
                    right={<PaperTextInput.Icon name="information" />}
                  />
                </View>
              ) : null}
            </View>
          ) : null}
          <Button
            mode="contained"
            onPress={submitHandler}
            loading={props.formUpdationStatus.loading}
            // disabled={Validators.userValidator(user)}
          >
            Update
          </Button>
        </Animated.View>
      </ScrollView>
      <Snackbar
        visible={
          props.formUpdationStatus.error ||
          props.otpStatus.error ||
          errorStatus.error
        }
        action={{
          label: 'Done',
          onPress: () => {
            props.dismiss();
          },
        }}
        onDismiss={() => {
          props.dismiss();
          setErrorStatus({...errorStatus, error: false, message: ''});
        }}>
        {props.formUpdationStatus.message !== ''
          ? props.formUpdationStatus.message
          : props.otpStatus.message !== ''
          ? props.otpStatus.message
          : errorStatus.message}
      </Snackbar>
      <Snackbar
        visible={errorStatus.success}
        action={{
          label: 'Close',
          onPress: () => {
            props.dismiss();
          },
        }}
        onDismiss={() => {
          props.dismiss();
          setErrorStatus({
            ...errorStatus,
            error: false,
            message: '',
            success: false,
          });
        }}>
        {'Successfully Updated'}
      </Snackbar>
    </SafeAreaView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileForm);

// export default ProfileForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  panel: {
    alignItems: 'center',
    height: SIZES.height,
  },
  header: {
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 10,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHandle: {
    width: SIZES.width,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    marginHorizontal: 22,
    alignContent: 'center',
    alignItems: 'center',
  },
  panelButtonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    padding: 4,
  },
  ImageBox: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowreverse: {
    flexDirection: 'row-reverse',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    flexDirection: 'column',
    // marginLeft: 50,
  },

  action: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  actionError: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  verifiedBtn: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  verifyBadge: {
    borderRadius: 20,
    width: 60,
  },
  verifiedBadge: {
    width: 60,
    borderRadius: 20,
    backgroundColor: Colors.green400,
  },
  avatarbackground: {
    backgroundColor: Colors.black,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  avatarIcon: {
    position: 'absolute',
    margin: 4,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.black,
    borderRadius: 50,
  },
  editIconColor: {
    color: Colors.red400,
  },
  width85: {
    width: '85%',
  },
  width50: {
    width: '48%',
  },
  Interests: {
    top: 0,
    bottom: 10,
  },
  mt8: {
    marginTop: 8,
  },
  verificationText: {
    top: -15,
    color: Colors.red400,
    position: 'absolute',
  },
});
