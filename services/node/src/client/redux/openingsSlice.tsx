import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Lesson } from '../../shared/entity/lesson';
import { fetchOpenings } from '../utils/api';
import AppThunk from './appThunk';
import { SliceState } from './types';

export interface OpeningsSlice extends SliceState {
  openings: Lesson[];
}

interface SuccessPayload {
  openings: Lesson[];
  usingLocalStorage?: boolean;
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
    getOpeningsSuccess(state, action: PayloadAction<SuccessPayload>) {
      state.openings = action.payload.openings;
      state.error = null;
      if (action.payload.usingLocalStorage) {
        state.requestStatus = 'USING_LOCALSTORAGE';
      } else {
        state.requestStatus = 'LOADED';
      }
    },
    getOpeningsFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.requestStatus = 'ERROR';
    },
  },
});

const { getOpeningsStart, getOpeningsSuccess, getOpeningsFailed } = openingsSlice.actions;

export function getOpeningsThunk(): AppThunk {
  return async (dispatch) => {
    dispatch(getOpeningsStart());
    const localStorageOpenings = localStorage.getItem('openings');
    if (localStorageOpenings != null) {
      const openings = JSON.parse(localStorageOpenings);
      dispatch(getOpeningsSuccess({ openings, usingLocalStorage: true }));
    }
    try {
      const openings: Lesson[] = await fetchOpenings();
      localStorage.setItem('openings', JSON.stringify(openings));
      if (localStorageOpenings !== JSON.stringify(openings)) {
        dispatch(getOpeningsSuccess({ openings }));
      }
    } catch (err) {
      dispatch(getOpeningsFailed(err.toString()));
    }
  };
}
