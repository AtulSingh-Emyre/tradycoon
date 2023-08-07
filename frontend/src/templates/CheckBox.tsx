import React, {memo} from 'react';
import {Checkbox as PaperCheckbox} from 'react-native-paper';

type Props = React.ComponentProps<typeof PaperCheckbox>;

const Checkbox = ({...props}: Props) => <PaperCheckbox {...props} />;

export default memo(Checkbox);
