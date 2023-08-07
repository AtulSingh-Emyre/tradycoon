import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {RootState} from '../../redux/reducers';
import {UserProfileRepository} from '../../services/UserProfile/UserProfileRepository';
import {connect} from 'react-redux';
import {UserReportActions} from '../../redux/actions/TertiaryUserDetails/AnalystReportActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Caption,
  Card,
  Colors,
  Paragraph,
  ProgressBar,
  Text,
  Title,
} from 'react-native-paper';
import {SIZES} from '../../styles/theme';
import {FC, useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';

interface IAnalystReportState {
  analystReport: any;
  analystReportStatus: {
    error: boolean;
    loading: boolean;
    message: string;
  };
  userId: string;
}

interface IAnalystReportDispatch {
  getReport: (id: string) => {};
  dismiss: () => {};
}

interface ReportsAnalyst extends IAnalystReportDispatch, IAnalystReportState {
  id: string;
}

const mapStateToProps = ({
  reportReducer,
  userProfileViewReducer,
}: RootState): IAnalystReportState => {
  return {
    analystReport: reportReducer.analystReport,
    analystReportStatus: reportReducer.analystReportStatus,
    userId: userProfileViewReducer.userId,
  };
};

const mapDispatchToProps = (dispatch: any): IAnalystReportDispatch => {
  return {
    getReport: async (id: string) =>
      dispatch(await UserProfileRepository.analystReportData(id)),
    dismiss: async () =>
      dispatch(
        await UserReportActions.analystReportStatusAction({
          error: false,
          loading: false,
          message: '',
        }),
      ),
  };
};

const ReportsAnalyst: FC<ReportsAnalyst> = props => {
  useEffect(() => {
    const get = async () => {
      await props.getReport(props.userId);
    };
    get();
  }, [props.userId]);
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.row}>
          <Card style={styles.signalCard}>
            <Card.Content>
              <View style={styles.cardContent}>
                <Text style={styles.cardContentTitle}>Active</Text>
                <Caption style={styles.cardContentCaption}>Signal</Caption>
              </View>
              <View style={styles.cardSubContent}>
                <Icon name="bell-ring" color={Colors.green500} size={50} />
                <Title style={styles.cardSubContentData}>
                  {props.analystReport.activeSignal}
                </Title>
              </View>
            </Card.Content>
          </Card>
          <Card style={styles.signalCard}>
            <Card.Content>
              <View style={styles.cardContent}>
                <Text style={styles.cardContentTitle}>Close</Text>
                <Caption style={styles.cardContentCaption}>Signal</Caption>
              </View>
              <View style={styles.cardSubContent}>
                <Icon name="bell-off" color={Colors.deepOrange500} size={50} />
                <Title style={styles.cardSubContentData}>
                  {props.analystReport.deactivateSignal}
                </Title>
              </View>
            </Card.Content>
          </Card>
          <Card style={styles.signalCard}>
            <Card.Content>
              <View style={styles.cardContent}>
                <Text style={styles.cardContentTitle}>Free</Text>
                <Caption style={styles.cardContentCaption}>Signal</Caption>
              </View>
              <View style={styles.cardSubContent}>
                <Icon
                  name="chart-scatter-plot"
                  color={Colors.amber600}
                  size={50}
                />
                <Title style={styles.cardSubContentData}>
                  {props.analystReport.freeSignal}
                </Title>
              </View>
            </Card.Content>
          </Card>
          <Card style={styles.signalCard}>
            <Card.Content>
              <View style={styles.cardContent}>
                <Text style={styles.cardContentTitle}>Paid</Text>
                <Caption style={styles.cardContentCaption}>Signal</Caption>
              </View>
              <View style={styles.cardSubContent}>
                <Icon name="chart-bar" color={Colors.cyan400} size={50} />
                <Title style={styles.cardSubContentData}>
                  {props.analystReport.paidSignal}
                </Title>
              </View>
            </Card.Content>
          </Card>
        </View>
        {/* <ProgressBar progress={0.5} color={Colors.red800} />
      <ProgressBar progress={0.5} color={Colors.red800} />
      <ProgressBar progress={0.5} color={Colors.red800} /> */}
      </ScrollView>
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportsAnalyst);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 2,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  signalCard: {
    width: SIZES.width * 0.48,
    minWidth: 145,
    margin: 2,
  },
  cardContent: {
    flexDirection: 'row',
  },
  cardContentTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
  },
  cardContentCaption: {
    marginHorizontal: 6,
    marginVertical: 6,
  },
  cardSubContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardSubContentData: {
    fontSize: SIZES.h1,
    color: Colors.blue500,
    marginHorizontal: 10,
  },
});
