import { configureStore } from '@reduxjs/toolkit';
import { usersSlice } from './usersSlice';

const store = configureStore({
  reducer: {
    usersSlice: usersSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
