import * as React from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../redux/reducers';

interface ILoadMoreLoaderStateProps {
  signalViewLoadMoreIsLoading: boolean;
}

interface ILoadMoreLoaderDispatchProps {}

const mapStateToProps = ({
  signalViewReducer,
}: RootState): ILoadMoreLoaderStateProps => {
  return {
    signalViewLoadMoreIsLoading: signalViewReducer.signalViewLoadMoreLoading,
  };
};

const mapDispatchToProps = (dispatch: any): ILoadMoreLoaderDispatchProps => {
  return {};
};

interface ILoadMoreLoaderProps
  extends ILoadMoreLoaderStateProps,
    ILoadMoreLoaderDispatchProps {}

const LoadMoreLoader = (props: ILoadMoreLoaderProps) => {
  return (
    <View style={styles.container}>
      {props.signalViewLoadMoreIsLoading ? <ActivityIndicator /> : <></>}
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadMoreLoader);

const styles = StyleSheet.create({
  container: {},
});
