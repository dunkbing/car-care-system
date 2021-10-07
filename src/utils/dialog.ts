import { MessageDialogResult } from '@components/dialog/MessageDialog';
import { showMsgDialog, hideMsgDialog } from '@redux/services/dialog';
import store from '@redux/store';

function open(message: string, title: string, onClose: (dialogResult: MessageDialogResult) => void | Promise<void>) {
  const onClosed = () => {
    store.dispatch(hideMsgDialog());
  };

  const onAgreed = () => {
    void onClose(MessageDialogResult.OK);
    onClosed();
  };

  const onRefused = () => {
    void onClose(MessageDialogResult.CANCEL);
    onClosed();
  };

  // open the dialog
  store.dispatch(
    showMsgDialog({
      isOpen: true,
      title,
      message,
      onAgreed,
      onRefused,
      onClosed,
    }),
  );
}

function close() {
  // close the dialog
  store.dispatch(hideMsgDialog());
}

export default { open, close };
