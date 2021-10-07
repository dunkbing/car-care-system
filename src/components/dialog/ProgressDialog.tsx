import React, { ReactElement } from 'react';
import { AlertDialog, Button, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native';

export type ProgressDialogProps = {
  header: any;
  isOpen?: boolean;
  onClosed?: () => void;
};

export function ProgressDialog({ header, isOpen, onClosed }: ProgressDialogProps): ReactElement {
  const cancelRef = React.useRef<TouchableOpacity>(null);

  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClosed}>
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
}
