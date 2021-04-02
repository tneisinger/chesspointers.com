import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Lesson } from '../../shared/entity/lesson';
import { fetchTraps } from '../utils/api';
import AppThunk from './appThunk';
import { EntitiesSlice, Entities } from './types';

interface SuccessPayload extends Entities<Lesson> {
  usingLocalStorage?: boolean;
}

const initialState: EntitiesSlice<Lesson> = {
  entities: [],
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
    getTrapsSuccess(state, action: PayloadAction<SuccessPayload>) {
      state.entities = action.payload.entities;
      state.error = null;
      if (action.payload.usingLocalStorage) {
        state.requestStatus = 'USING_LOCALSTORAGE';
      } else {
        state.requestStatus = 'LOADED';
      }
    },
    getTrapsFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.requestStatus = 'ERROR';
    },
  },
});

const { getTrapsStart, getTrapsSuccess, getTrapsFailed } = trapsSlice.actions;

export function getTrapsThunk(): AppThunk {
  return async (dispatch) => {
    dispatch(getTrapsStart());
    const localStorageTraps = localStorage.getItem('traps');
    if (localStorageTraps != null) {
      const traps = JSON.parse(localStorageTraps);
      dispatch(getTrapsSuccess({ entities: traps, usingLocalStorage: true }));
    }
    try {
      const traps: Lesson[] = await fetchTraps();
      localStorage.setItem('traps', JSON.stringify(traps));
      if (localStorageTraps !== JSON.stringify(traps)) {
        dispatch(getTrapsSuccess({ entities: traps }));
      }
    } catch (err) {
      dispatch(getTrapsFailed(err.toString()));
    }
  };
}
