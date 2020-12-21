import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '../../shared/entity/user';
import { fetchUsers } from '../utils/api';
import { RequestStatus } from '../types/general';
import AppThunk from './appThunk';

export interface UsersState {
  users: User[]
  error: string | null
  requestStatus: RequestStatus
}

const initialState: UsersState = {
  users: [],
  error: null,
  requestStatus: 'NO_REQUEST_YET'
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsersStart(state) {
      state.requestStatus = 'LOADING';
    },
    getUsersSuccess(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
      state.error = null;
      state.requestStatus = 'LOADED';
    },
    getUsersFailed(state, action: PayloadAction<string>) {
      state.users = [];
      state.error = action.payload;
      state.requestStatus = 'ERROR';
    }
  }
});

const { getUsersStart, getUsersSuccess, getUsersFailed } = usersSlice.actions;

export function getUsersThunk(): AppThunk {
  return (async dispatch => {
    dispatch(getUsersStart())
    try {
      const users = await fetchUsers();
      dispatch(getUsersSuccess(users));
    } catch (err) {
      dispatch(getUsersFailed(err.toString()));
    }
  });
}
