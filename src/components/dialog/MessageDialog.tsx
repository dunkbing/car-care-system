import React, { ReactElement, useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { AlertDialog, Button, Center, Text } from 'native-base';
import { DialogState } from './ProgressDialog';
import DialogStore from '@mobx/stores/dialog';

export enum DIALOG_TYPE {
  CANCEL,
  CONFIRM,
  BOTH,
}

export type MessageDialogProps = {
  title?: any;
  message: any;
  state?: DialogState;
  type?: DIALOG_TYPE;
  onClosed?: () => void;
  onAgreed?: () => void;
  onRefused?: () => void;
};

export enum MessageDialogResult {
  OK,
  CANCEL,
}

export function MessageDialog({ title, message, state, type, onRefused, onAgreed, onClosed }: MessageDialogProps): ReactElement {
  const cancelRef = React.useRef<TouchableOpacity>(null);
  const dialogStore = useContext(DialogStore);
  function handleClose(close: (() => void) | undefined) {
    return function () {
      close?.();
      dialogStore.closeMsgDialog();
    };
  }

  const buttons = () => {
    if (type === DIALOG_TYPE.BOTH) {
      return (
        <Button.Group space={2}>
          <Button variant='solid' colorScheme='secondary' onPress={handleClose(onRefused)}>
            Hủy
          </Button>
          <Button variant='solid' colorScheme='primary' onPress={handleClose(onAgreed)} ref={cancelRef}>
            Xác nhận
          </Button>
        </Button.Group>
      );
    } else if (type === DIALOG_TYPE.CANCEL) {
      return (
        <Button variant='solid' colorScheme='secondary' onPress={handleClose(onRefused)} ref={cancelRef}>
          Hủy
        </Button>
      );
    } else {
      return (
        <Center>
          <Button variant='solid' colorScheme='primary' onPress={handleClose(onAgreed)} ref={cancelRef}>
            Xác nhận
          </Button>
        </Center>
      );
    }
  };

  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={state === DialogState.OPEN} onClose={handleClose(onClosed)}>
      <AlertDialog.Content backgroundColor='white'>
        {/* <AlertDialog.CloseButton /> */}
        {title && (
          <Center>
            <AlertDialog.Header>{title}</AlertDialog.Header>
          </Center>
        )}
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
