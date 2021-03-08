import { configureStore } from '@reduxjs/toolkit';
import { trapsSlice } from './trapsSlice';
import { openingsSlice } from './openingsSlice';

const store = configureStore({
  reducer: {
    trapsSlice: trapsSlice.reducer,
    openingsSlice: openingsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
