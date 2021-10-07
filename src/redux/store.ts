import { combineReducers, configureStore } from '@reduxjs/toolkit';
import departmentApi from './services/department';
import employeeApi from './services/employee';
import { messageDialogSlice, progressDialogSlice } from './services/dialog';
import { MessageDialogProps } from '@components/dialog/MessageDialog';
import { ProgressDialogProps } from '@components/dialog/ProgressDialog';

const reducer = combineReducers({
  [employeeApi.reducerPath]: employeeApi.reducer,
  [departmentApi.reducerPath]: departmentApi.reducer,
  messageDialog: messageDialogSlice.reducer,
  progressDialog: progressDialogSlice.reducer,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(employeeApi.middleware, departmentApi.middleware),
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const selectMsgDialogState = (state: RootState): MessageDialogProps => state.messageDialog.value;
export const selectProgressDialogState = (state: RootState): ProgressDialogProps => state.progressDialog.value;
