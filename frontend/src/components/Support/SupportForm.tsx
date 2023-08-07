import * as React from 'react';
import {Text, View, StyleSheet, Keyboard, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../redux/reducers';
import TextInput from '../../templates/TextInput';
import {SupportActions} from '../../redux/actions/SupportActions';
import {SupportRepository} from '../../services/Support/SupportRepository';
import Snackbar from '../../templates/Snackbar';
import {SIZES} from '../../styles/theme';
import {Title, Button} from 'react-native-paper';

interface ISupportFormStateProps {
  isLoading: boolean;
  error: boolean;
  errorMessage: string;
  userid: string;
}

interface ISupportFormDispatchProps {
  dismiss: () => {};
  postQuery: (userId: string, query: string) => {};
}

const mapStateToProps = ({
  supportReducer,
  userReducer,
}: RootState): ISupportFormStateProps => {
  return {
    error: supportReducer.postStatus.error,
    errorMessage: supportReducer.postStatus.message,
    isLoading: supportReducer.postStatus.loading,
    userid: userReducer.user.parsedData.user.id,
  };
};

const mapDispatchToProps = (dispatch: any): ISupportFormDispatchProps => {
  return {
    dismiss: async () =>
      dispatch(await SupportActions.supportStatusAction(false, false, '')),
    postQuery: async (userId: string, query: string) =>
      dispatch(await SupportRepository.postQuery(userId, query)),
  };
};

interface ISupportFormProps
  extends ISupportFormStateProps,
    ISupportFormDispatchProps {}

const SupportForm = (props: ISupportFormProps) => {
  const [Query, setQuery] = React.useState('');
  const [errorQuery, setErrorQuery] = React.useState(false);
  const onChangeQuery = (val: string) => {
    setQuery(val);
    setErrorQuery(false);
  };
  const handleSubmit = async () => {
    const text = Query.trim();
    if (text.length < 1) {
      setQuery('');
      setErrorQuery(true);
    } else {
      Keyboard.dismiss();
      await props.postQuery(props.userid, Query);
      setQuery('');
    }
  };
  return (
    <>
      <View style={styles.container}>
        <Title>We're Here to Help you !</Title>
        <TextInput
          mode="outlined"
          multiline={true}
          numberOfLines={5}
          label="Query *"
          error={errorQuery}
          errorText={'Please enter a query of length 1-1000 letters'}
          maxLength={1000}
          onChangeText={onChangeQuery}
          returnKeyType={'next'}
          value={Query}
        />
        <View style={styles.row}>
          <Button mode="contained" onPress={() => setQuery('')}>
            Clear
          </Button>
          <Button
            mode="contained"
            disabled={props.isLoading}
            loading={props.isLoading}
            onPress={handleSubmit}>
            Submit
          </Button>
        </View>
      </View>
      <Snackbar visible={props.error} onDismiss={() => props.dismiss()}>
        {<Text>{props.errorMessage}</Text>}
      </Snackbar>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SupportForm);

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    width: SIZES.width * 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
  },
});
