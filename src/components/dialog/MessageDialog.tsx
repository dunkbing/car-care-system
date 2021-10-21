import React, { ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';
import { AlertDialog, Button, Center, Text } from 'native-base';
import { DialogState } from './ProgressDialog';

export type MessageDialogProps = {
  title: any;
  message: any;
  state?: DialogState;
  cancel?: boolean;
  onClosed?: () => void;
  onAgreed?: () => void;
  onRefused?: () => void;
};

export enum MessageDialogResult {
  OK,
  CANCEL,
}

export function MessageDialog({ title, message, state, cancel, onRefused, onAgreed, onClosed }: MessageDialogProps): ReactElement {
  const cancelRef = React.useRef<TouchableOpacity>(null);

  const buttons = () => {
    if (cancel) {
      return (
        <Button.Group space={2}>
          <Button variant='solid' colorScheme='secondary' onPress={onRefused}>
            Hủy
          </Button>
          <Button variant='solid' colorScheme='primary' onPress={onAgreed} ref={cancelRef}>
            Xác nhận
          </Button>
        </Button.Group>
      );
    }
    return (
      <Center>
        <Button variant='solid' colorScheme='primary' onPress={onAgreed} ref={cancelRef}>
          Xác nhận
        </Button>
      </Center>
    );
  };
  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={state === DialogState.OPEN} onClose={onClosed}>
      <AlertDialog.Content backgroundColor='white'>
        {/* <AlertDialog.CloseButton /> */}
        {title && <AlertDialog.Header>{title}</AlertDialog.Header>}
        <AlertDialog.Body>
          <Text fontSize='24' textAlign='center'>
            {message}
          </Text>
        </AlertDialog.Body>
        <AlertDialog.Footer alignSelf='center' backgroundColor='white'>
          {buttons()}
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
