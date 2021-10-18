import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authApi from './services/auth';
import { messageDialogSlice, progressDialogSlice } from './services/dialog';
import { MessageDialogProps } from '@components/dialog/MessageDialog';
import { ProgressDialogProps } from '@components/dialog/ProgressDialog';
import garageApi from './services/garage';

const reducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [garageApi.reducerPath]: garageApi.reducer,
  messageDialog: messageDialogSlice.reducer,
  progressDialog: progressDialogSlice.reducer,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(authApi.middleware, garageApi.middleware),
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const selectMsgDialogState = (state: RootState): MessageDialogProps => state.messageDialog.value;
export const selectProgressDialogState = (state: RootState): ProgressDialogProps => state.progressDialog.value;
