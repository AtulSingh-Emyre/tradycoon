import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {Snackbar as PaperSnackbar, useTheme} from 'react-native-paper';

type Props = React.ComponentProps<typeof PaperSnackbar>;

const Snackbar = ({children, ...props}: Props) => {
  const theme = useTheme();
  return (
    <PaperSnackbar theme={theme} {...props}>
      {children}
    </PaperSnackbar>
  );
};

export default memo(Snackbar);
