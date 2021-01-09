import { configureStore } from '@reduxjs/toolkit';
import { chessTrapsSlice } from './chessTrapsSlice';

const store = configureStore({
  reducer: {
    chessTrapsSlice: chessTrapsSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
