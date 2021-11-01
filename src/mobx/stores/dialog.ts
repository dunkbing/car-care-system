import { DIALOG_TYPE, MessageDialogProps } from '@components/dialog/MessageDialog';
import { DialogState, ProgressDialogProps } from '@components/dialog/ProgressDialog';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { createContext } from 'react';

class DialogStore {
  constructor() {
    makeObservable(this, {
      msgDialogState: observable,
      progressDialogState: observable,
      openMsgDialog: action,
      closeMsgDialog: action,
      openProgressDialog: action,
      closeProgressDialog: action,
    });
  }
  msgDialogState: MessageDialogProps = {
    title: '',
    message: '',
    state: DialogState.CLOSE,
    type: DIALOG_TYPE.CANCEL,
  };
  progressDialogState: ProgressDialogProps = {
    title: 'Vui lòng đợi',
    state: DialogState.CLOSE,
  };

  public openMsgDialog(config: MessageDialogProps = { message: '' }) {
    runInAction(
      () =>
        (this.msgDialogState = {
          title: config.title,
          message: config.message,
          type: config.type,
          onAgreed: config.onAgreed,
          onClosed: config.onClosed,
          onRefused: config.onRefused,
          state: DialogState.OPEN,
        }),
    );
  }

  public closeMsgDialog() {
    runInAction(() => (this.msgDialogState = { ...this.msgDialogState, state: DialogState.CLOSE }));
  }

  public openProgressDialog(config: ProgressDialogProps = { title: '' }) {
    runInAction(() => (this.progressDialogState = { title: config.title, onClosed: config.onClosed, state: DialogState.OPEN }));
  }

  public closeProgressDialog() {
    runInAction(() => (this.progressDialogState = { ...this.progressDialogState, state: DialogState.CLOSE }));
  }
}

export const dialogStore = new DialogStore();

export default createContext(dialogStore);
