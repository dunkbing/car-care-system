import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageDialogProps } from '@components/dialog/MessageDialog';
import { ProgressDialogProps } from '@components/dialog/ProgressDialog';

interface MsgDialogSliceState {
  value: MessageDialogProps;
}

const initialMsgDialogState: MsgDialogSliceState = {
  value: {
    title: 'Message header',
    message: 'Message body',
    // cancelable: true,
    isOpen: false,
  },
};

/**
 * generate msg dialog action creators, action types, reducers and state.
 */
const messageDialogSlice = createSlice({
  name: 'messageDialog',
  initialState: initialMsgDialogState,
  reducers: {
    showMsgDialog: (state, action?: PayloadAction<MessageDialogProps>) => {
      state.value = {
        ...state.value,
        isOpen: true,
        ...action?.payload,
      };
    },
    hideMsgDialog: (state) => {
      state.value = {
        ...state.value,
        isOpen: false,
      };
    },
  },
});

interface ProgressDialogSliceState {
  value: ProgressDialogProps;
}

const initialProgressDialogState: ProgressDialogSliceState = {
  value: {
    header: 'Vui lòng đợi',
    // cancelable: false,
    isOpen: false,
  },
};

const progressDialogSlice = createSlice({
  name: 'progressDialog',
  initialState: initialProgressDialogState,
  reducers: {
    showProgress: (state, action: PayloadAction<ProgressDialogProps>) => {
      state.value = {
        ...state.value,
        isOpen: true,
        ...action.payload,
      };
    },
  },
});

export const { showMsgDialog, hideMsgDialog } = messageDialogSlice.actions;
export const { showProgress } = progressDialogSlice.actions;
export { messageDialogSlice, progressDialogSlice };
