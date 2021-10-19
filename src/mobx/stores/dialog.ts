import { MessageDialogProps } from '@components/dialog/MessageDialog';
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
  msgDialogState: MessageDialogProps = { title: '', message: '', state: DialogState.CLOSE };
  progressDialogState: ProgressDialogProps = { header: 'Vui lòng đợi', state: DialogState.CLOSE };

  public openMsgDialog() {
    runInAction(() => (this.msgDialogState = { ...this.msgDialogState, state: DialogState.OPEN }));
  }

  public closeMsgDialog() {
    runInAction(() => (this.msgDialogState = { ...this.msgDialogState, state: DialogState.CLOSE }));
  }

  public openProgressDialog() {
    runInAction(() => (this.progressDialogState = { ...this.progressDialogState, state: DialogState.OPEN }));
  }

  public closeProgressDialog() {
    runInAction(() => (this.progressDialogState = { ...this.progressDialogState, state: DialogState.CLOSE }));
  }
}

export default createContext(new DialogStore());
