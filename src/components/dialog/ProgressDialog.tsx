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
        <AlertDialog.Body h={100} alignItems='center' justifyContent='center'>
          <Spinner size='lg' accessibilityLabel='Loading' />
        </AlertDialog.Body>
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export default observer(ProgressDialog);
