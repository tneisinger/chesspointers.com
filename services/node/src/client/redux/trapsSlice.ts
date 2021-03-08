import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Trap } from '../../shared/entity/trap';
import { fetchTraps } from '../utils/api';
import AppThunk from './appThunk';
import { SliceState } from './types';

export interface TrapsSlice extends SliceState {
  traps: Trap[];
}

const initialState: TrapsSlice = {
  traps: [],
  error: null,
  requestStatus: 'NO_REQUEST_YET',
};

export const trapsSlice = createSlice({
  name: 'traps',
  initialState,
  reducers: {
    getTrapsStart(state) {
      state.requestStatus = 'LOADING';
    },
    getTrapsSuccess(state, action: PayloadAction<Trap[]>) {
      state.traps = action.payload;
      state.error = null;
      state.requestStatus = 'LOADED';
    },
    getTrapsFailed(state, action: PayloadAction<string>) {
      state.traps = [];
      state.error = action.payload;
      state.requestStatus = 'ERROR';
    },
  },
});

const { getTrapsStart, getTrapsSuccess, getTrapsFailed } = trapsSlice.actions;

export function getTrapsThunk(): AppThunk {
  return async (dispatch) => {
    dispatch(getTrapsStart());
    try {
      const traps = await fetchTraps();
      dispatch(getTrapsSuccess(traps));
    } catch (err) {
      dispatch(getTrapsFailed(err.toString()));
    }
  };
}
