import React from 'react';
import { AlertDialog, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';

export enum DialogState {
  OPEN,
  CLOSE,
}

export type ProgressDialogProps = {
  title: any;
  state?: DialogState;
  onClosed?: () => void;
};

const ProgressDialog = ({ title, state, onClosed }: ProgressDialogProps) => {
  const cancelRef = React.useRef<TouchableOpacity>(null);

  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={state === DialogState.OPEN} onClose={onClosed}>
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        {title && <AlertDialog.Header>{title}</AlertDialog.Header>}
        <AlertDialog.Body>
          <Spinner size='lg' accessibilityLabel='Updating department' />
        </AlertDialog.Body>
        {/* <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button variant='solid' colorScheme='secondary' onPress={onClosed}>
              Hủy
            </Button>
          </Button.Group>
        </AlertDialog.Footer> */}
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export default observer(ProgressDialog);
