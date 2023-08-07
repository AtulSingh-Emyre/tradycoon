import React, {memo} from 'react';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';

interface Props {
  title: string;
  message: string;
  type?: string; // success error warning
  actions: (s: string) => void;
  isVisible: boolean;
}
const DialogBox = ({title, message, type, actions, isVisible}: Props) => {
  return (
    <Portal>
      <Dialog
        visible={isVisible}
        onDismiss={() => {
          actions('Cancle');
        }}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              actions('Cancle');
            }}>
            Cancle
          </Button>
          <Button
            onPress={() => {
              actions('Done');
            }}>
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default memo(DialogBox);
