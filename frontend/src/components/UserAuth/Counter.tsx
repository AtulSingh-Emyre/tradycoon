import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import Badge from '../../templates/Badge';
import {theme} from '../../constants/theme';
import {memo} from 'react';

interface ICounterProps {
  setkey: React.Dispatch<React.SetStateAction<number>>;
  key: number;
  setreset: React.Dispatch<React.SetStateAction<boolean>>;
}

const Counter = (props: ICounterProps) => {
  const [currentCount, setCountDown] = React.useState(45);
  const timer = () => setCountDown(currentCount - 1);

  // const OtpResetHandler = () => {
  //   setCountDown(45);
  //   props.setkey(props.key + 1);
  // };
  React.useEffect(() => {
    if (currentCount <= 0) {
      props.setreset(true);
      return;
    }
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, [currentCount]);

  return (
    <View style={styles.container}>
      <Badge key={1} visible={true} style={styles.countDown}>
        {'00 : ' + currentCount + 'Sec'}
      </Badge>
    </View>
  );
};

export default memo(Counter);

const styles = StyleSheet.create({
  container: {},
  countDown: {
    backgroundColor: theme.colors.accent,
    marginTop: 12,
    fontSize: 16,
  },
});
