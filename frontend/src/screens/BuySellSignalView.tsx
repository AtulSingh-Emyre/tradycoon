/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import SignalView from '../components/BuySellSignalList/SignalView';
interface BuySellSignalViewProps {
  navigation: any;
}
const BuySellSignalView: React.FC<BuySellSignalViewProps> = props => {
  return (
    <SignalView
      siginalEdit={false}
      showChip={true}
      queryType={'main-signal-view'}
    />
  );
};

export default BuySellSignalView;
