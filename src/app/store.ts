import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import toggleMode from '../actions/ToggleMode';
import userAuth from "../actions/UserAuth"

export const store = configureStore({
  reducer: {
    mode: toggleMode,
    userAuth: userAuth
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
