import { configureStore } from '@reduxjs/toolkit';
import { trapsSlice } from './trapsSlice';

const store = configureStore({
  reducer: {
    trapsSlice: trapsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
