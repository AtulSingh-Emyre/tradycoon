import * as React from 'react';
import {RootState} from '../redux/reducers';
import {connect} from 'react-redux';
import UserProfileView from '../components/UserProfile/UserProfileView';

interface IProfileProps {
  id: string;
}
interface IProfileDispatchProps {}

interface IProfileDetailsProps extends IProfileDispatchProps, IProfileProps {
  UersId?: any;
  route: {params: {id: string}};
  navigation: any;
}

const mapStateToProps = ({userReducer}: RootState): IProfileProps => {
  return {
    id: userReducer.user.parsedData.user.id,
  };
};

const mapDispatchToProps = (dispatch: any): IProfileDispatchProps => {
  return {};
};
// var name:string,workMail,businessName,website,experience;
const ProfileDetails: React.FC<IProfileDetailsProps> = props => {
  return <UserProfileView route={props.route} />;
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileDetails);
