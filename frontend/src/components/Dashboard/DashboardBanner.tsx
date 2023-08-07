import * as React from 'react';
import {Image} from 'react-native';
import {Banner, Caption} from 'react-native-paper';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {ScreenNames} from '../../navigation/RootNavigation';

interface IDashboardBanner {
  visible: boolean;
}

const DashboardBanner: React.FC<IDashboardBanner> = props => {
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(props.visible);
  const bannerContent = `How to Become an Analyst ?\n1. Complete your Profile.\n2. Select Analyst in the edit profile screen.\n3. Wait for ~24hours for the response.\n4. Verified Analyst able to create Buy/Sell Signals and Manage client.`;
  return (
    <Banner
      visible={visible}
      actions={[
        {
          label: 'Later',
          onPress: () => setVisible(false),
        },
        {
          label: 'Complete',
          onPress: () => {
            navigation.dispatch(
              CommonActions.navigate({
                name: ScreenNames.PROFILEEDIT,
              }),
            );
          },
        },
      ]}
      icon={({size}) => (
        <Image
          source={require('../../assets/Tradycoon_logo_2.png')}
          style={{
            width: 75,
            height: 75,
            backgroundColor: 'black',
            borderRadius: 5,
            marginTop: 6,
          }}
        />
      )}>
      {bannerContent}
    </Banner>
  );
};

export default DashboardBanner;
