import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import startupReducer from './slices/startupSlice';
import investorReducer from './slices/investorSlice';
import advisorReducer from './slices/advisorSlice';
import matchReducer from './slices/matchSlice';
import messageReducer from './slices/messageSlice';
import meetingReducer from './slices/meetingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    startup: startupReducer,
    investor: investorReducer,
    advisor: advisorReducer,
    match: matchReducer,
    message: messageReducer,
    meeting: meetingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

