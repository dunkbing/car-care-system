import React from 'react';
import { AlertDialog, Button, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native';

export enum DialogState {
  OPEN,
  CLOSE,
}

export type ProgressDialogProps = {
  header: any;
  state?: DialogState;
  onClosed?: () => void;
};

export const ProgressDialog = ({ header, state, onClosed }: ProgressDialogProps) => {
  const cancelRef = React.useRef<TouchableOpacity>(null);

  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={state === DialogState.OPEN} onClose={onClosed}>
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>{header}</AlertDialog.Header>
        <AlertDialog.Body>
          <Spinner size='lg' accessibilityLabel='Updating department' />
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button variant='solid' colorScheme='secondary' onPress={onClosed}>
              Cancel
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};
