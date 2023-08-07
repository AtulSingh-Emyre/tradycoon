import React, {memo} from 'react';
import {Badge as PaperBadge} from 'react-native-paper';

type Props = React.ComponentProps<typeof PaperBadge>;

const Badge = ({...props}: Props) => <PaperBadge {...props} />;

export default memo(Badge);
