import { Box } from 'native-base';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showMsgDialog, showProgress } from '@redux/services/dialog';
import { selectMsgDialogState, selectProgressDialogState } from '@redux/store';
import { MessageDialog } from './MessageDialog';
import { ProgressDialog } from './ProgressDialog';

export default function Dialog() {
  const msgDialogState = useSelector(selectMsgDialogState);
  const progressDialogState = useSelector(selectProgressDialogState);
  const dispatch = useDispatch();
  return (
    <Box>
      <MessageDialog
        header={msgDialogState.header}
        body={msgDialogState.header}
        isOpen={msgDialogState.isOpen}
        onClosed={() => dispatch(showMsgDialog({ ...msgDialogState, isOpen: false }))}
      />
      <ProgressDialog
        header={progressDialogState.header}
        isOpen={progressDialogState.isOpen}
        onClosed={() => dispatch(showProgress({ ...progressDialogState, isOpen: false }))}
      />
    </Box>
  );
}
