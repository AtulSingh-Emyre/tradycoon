/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
// import {RootState} from '../../redux/reducers';
import TextInput from '../../templates/TextInput';
import Button from '../../templates/Button';
import {AdminRepository} from '../../services/Admin/AdminRepository';

interface IAdminNotificationHandlerStateProps {}

interface IAdminNotificationHandlerDispatchProps {
  postNotification: (notif: any) => {};
}

const mapStateToProps = (): IAdminNotificationHandlerStateProps => {
  return {};
};

const mapDispatchToProps = (
  dispatch: any,
): IAdminNotificationHandlerDispatchProps => {
  return {
    postNotification: async (notif: any) =>
      dispatch(await AdminRepository.postNotification(notif)),
  };
};

interface IAdminNotificationHandlerProps
  extends IAdminNotificationHandlerStateProps,
    IAdminNotificationHandlerDispatchProps {}

const AdminNotificationHandler = (props: IAdminNotificationHandlerProps) => {
  const [Query, setQuery] = React.useState({
    title: '',
    body: '',
    custom: '',
    type: '',
  });
  const [loading, setLoading] = React.useState(false);
  const onChangeQuery = (header: string, val: string) => {
    setQuery({...Query, [header]: val});
  };
  const handleSubmit = async () => {
    setLoading(true);
    await props.postNotification(Query);
    setLoading(false);
    setQuery({body: '', custom: '', title: '', type: ''});
  };
  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        keyboardType="ascii-capable"
        mode="outlined"
        maxLength={100}
        onChangeText={(val: string) => onChangeQuery('title', val)}
        value={Query.title}
      />
      <TextInput
        label="Body"
        keyboardType="ascii-capable"
        mode="outlined"
        maxLength={100}
        onChangeText={(val: string) => onChangeQuery('body', val)}
        value={Query.body}
      />
      <TextInput
        label="Custom"
        keyboardType="ascii-capable"
        mode="outlined"
        maxLength={100}
        onChangeText={(val: string) => onChangeQuery('custom', val)}
        value={Query.custom}
      />
      <TextInput
        label="Type"
        keyboardType="ascii-capable"
        mode="outlined"
        maxLength={100}
        onChangeText={(val: string) => onChangeQuery('type', val)}
        value={Query.type}
      />
      <Button
        mode="contained"
        disabled={loading}
        loading={loading}
        onPress={handleSubmit}>
        Submit
      </Button>
    </View>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminNotificationHandler);

const styles = StyleSheet.create({
  container: {},
});
