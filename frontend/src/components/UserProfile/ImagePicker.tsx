import React, {useState, createRef, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import Animated from 'react-native-reanimated';
import {theme} from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
interface ImagePickerProps {
  setImage: any;
  action: any;
}

const ImagePickerz = (props: ImagePickerProps) => {
  const bottomSheetRef: any = createRef();
  const [open, setopen] = useState(props.action);
  const fall = new Animated.Value(1);
  const [Image, setImage] = useState(
    'https://api.adorable.io/avatars/80/abott@adorable.png',
  );
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((profileImage: any) => {
      setImage(profileImage.path);
      //setUser({...user, prof_pic: profileImage.path});

      bottomSheetRef.current.snapTo(1);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((profileImage: any) => {
      setImage(profileImage.path);
      // setUser({...user, prof_pic: profileImage.path});
      bottomSheetRef.current.snapTo(1);
    });
  };
  const renderInner = () => (
    <View style={styles.panel}>
      <View>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
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

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );
  return (
    <BottomSheet
      ref={bottomSheetRef}
      overdragResistanceFactor={8}
      enabledInnerScrolling={false}
      snapPoints={[300, 0]}
      renderContent={renderInner}
      renderHeader={renderHeader}
      initialSnap={open}
      callbackNode={fall}
      enabledGestureInteraction={true}
    />
  );
};

export default ImagePickerz;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191714',
    flex: 1,
    alignItems: 'center',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },

  panel: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingTop: 20,
  },
  header: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.background,
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 10,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.text,
    marginBottom: 10,
  },
  panelTitle: {
    color: theme.colors.text,
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 22,
  },
  panelButtonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    margin: 10,
  },
  ImageBox: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
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
  editIconBtn: {
    marginLeft: 10,
    marginTop: 14,
  },
  verifiedBtn: {
    marginLeft: 10,
    marginTop: 16,
  },

  editIconColor: {
    color: theme.colors.accent,
  },
  width75: {
    width: '75%',
  },
  width50: {
    width: '48%',
  },
  Interests: {
    //marginTop:-25,
    top: -25,
    bottom: 10,
  },
  mt8: {
    marginTop: 8,
  },
  mt4: {
    marginTop: 4,
  },
});
