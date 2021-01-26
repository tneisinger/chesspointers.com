import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { fetchChessTraps } from '../utils/api';
import { RequestStatus } from '../types/general';
import AppThunk from './appThunk';

export interface ChessTrapsState {
  traps: ChessTrap[];
  error: string | null;
  requestStatus: RequestStatus;
}

const initialState: ChessTrapsState = {
  traps: [],
  error: null,
  requestStatus: 'NO_REQUEST_YET',
};

export const chessTrapsSlice = createSlice({
  name: 'chessTraps',
  initialState,
  reducers: {
    getChessTrapsStart(state) {
      state.requestStatus = 'LOADING';
    },
    getChessTrapsSuccess(state, action: PayloadAction<ChessTrap[]>) {
      state.traps = action.payload;
      state.error = null;
      state.requestStatus = 'LOADED';
    },
    getChessTrapsFailed(state, action: PayloadAction<string>) {
      state.traps = [];
      state.error = action.payload;
      state.requestStatus = 'ERROR';
    },
  },
});

const {
  getChessTrapsStart,
  getChessTrapsSuccess,
  getChessTrapsFailed,
} = chessTrapsSlice.actions;

export function getChessTrapsThunk(): AppThunk {
  return async (dispatch) => {
    dispatch(getChessTrapsStart());
    try {
      const traps = await fetchChessTraps();
      dispatch(getChessTrapsSuccess(traps));
    } catch (err) {
      dispatch(getChessTrapsFailed(err.toString()));
    }
  };
}
