import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Opening } from '../../shared/entity/opening';
import { fetchOpenings } from '../utils/api';
import AppThunk from './appThunk';
import { SliceState } from './types';

export interface OpeningsSlice extends SliceState {
  openings: Opening[];
}

const initialState: OpeningsSlice = {
  openings: [],
  error: null,
  requestStatus: 'NO_REQUEST_YET',
};

export const openingsSlice = createSlice({
  name: 'traps',
  initialState,
  reducers: {
    getOpeningsStart(state) {
      state.requestStatus = 'LOADING';
    },
    getOpeningsSuccess(state, action: PayloadAction<Opening[]>) {
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
      const traps = await fetchOpenings();
      dispatch(getOpeningsSuccess(traps));
    } catch (err) {
      dispatch(getOpeningsFailed(err.toString()));
    }
  };
}
