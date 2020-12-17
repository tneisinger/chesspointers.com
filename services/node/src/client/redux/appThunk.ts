import { Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './store';

type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export default AppThunk;

