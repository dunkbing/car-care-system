import React, { ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';
import { AlertDialog, Button } from 'native-base';

export type MessageDialogProps = {
  title: any;
  message: any;
  isOpen?: boolean;
  onClosed?: () => void;
  onAgreed?: () => void;
  onRefused?: () => void;
};

export enum MessageDialogResult {
  OK,
  CANCEL,
}

export function MessageDialog({ title, message, isOpen, onRefused, onAgreed, onClosed }: MessageDialogProps): ReactElement {
  const cancelRef = React.useRef<TouchableOpacity>(null);

  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClosed}>
      <AlertDialog.Content>
        {/* <AlertDialog.CloseButton /> */}
        <AlertDialog.Header>{title}</AlertDialog.Header>
        <AlertDialog.Body>{message}</AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button variant='solid' colorScheme='secondary' onPress={onRefused}>
              Cancel
            </Button>
            <Button variant='solid' colorScheme='primary' onPress={onAgreed} ref={cancelRef}>
              Ok
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
