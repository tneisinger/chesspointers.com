import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Lesson } from '../../shared/entity/lesson';
import { fetchOpenings } from '../utils/api';
import AppThunk from './appThunk';
import { SliceState } from './types';

export interface OpeningsSlice extends SliceState {
  openings: Lesson[];
}

const initialState: OpeningsSlice = {
  openings: [],
  error: null,
  requestStatus: 'NO_REQUEST_YET',
};

export const openingsSlice = createSlice({
  name: 'openings',
  initialState,
  reducers: {
    getOpeningsStart(state) {
      state.requestStatus = 'LOADING';
    },
    getOpeningsSuccess(state, action: PayloadAction<Lesson[]>) {
      state.openings = action.payload;
      state.error = null;
      state.requestStatus = 'LOADED';
    },
    getOpeningsFailed(state, action: PayloadAction<string>) {
      state.openings = [];
      state.error = action.payload;
      state.requestStatus = 'ERROR';
    },
  },
});

const { getOpeningsStart, getOpeningsSuccess, getOpeningsFailed } = openingsSlice.actions;

export function getOpeningsThunk(): AppThunk {
  return async (dispatch) => {
    dispatch(getOpeningsStart());
    try {
      const openings = await fetchOpenings();
      dispatch(getOpeningsSuccess(openings));
    } catch (err) {
      dispatch(getOpeningsFailed(err.toString()));
    }
  };
}
