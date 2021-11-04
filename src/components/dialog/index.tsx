import { Box } from 'native-base';
import React from 'react';
import MessageDialog from './MessageDialog';
import ProgressDialog from './ProgressDialog';
import { observer } from 'mobx-react';
import DialogStore from '@mobx/stores/dialog';
import Container from 'typedi';

const Dialog = () => {
  const dialogStore = Container.get(DialogStore);
  const { msgDialogState, progressDialogState } = dialogStore;
  return (
    <Box>
      <MessageDialog
        title={msgDialogState.title}
        message={msgDialogState.message}
        type={msgDialogState.type}
        state={msgDialogState.state}
        onRefused={msgDialogState.onRefused}
        onAgreed={msgDialogState.onAgreed}
        onClosed={() => dialogStore.closeMsgDialog()}
      />
      <ProgressDialog
        title={progressDialogState.title}
        state={progressDialogState.state}
        onClosed={() => dialogStore.closeProgressDialog()}
      />
    </Box>
  );
};

export default observer(Dialog);
