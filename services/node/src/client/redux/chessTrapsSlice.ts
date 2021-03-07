import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Trap } from '../../shared/entity/chessTrap';
import { fetchTraps } from '../utils/api';
import { RequestStatus } from '../types/general';
import AppThunk from './appThunk';

export interface TrapsState {
  traps: Trap[];
  error: string | null;
  requestStatus: RequestStatus;
}

const initialState: TrapsState = {
  traps: [],
  error: null,
  requestStatus: 'NO_REQUEST_YET',
};

export const chessTrapsSlice = createSlice({
  name: 'chessTraps',
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

const { getTrapsStart, getTrapsSuccess, getTrapsFailed } = chessTrapsSlice.actions;

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
