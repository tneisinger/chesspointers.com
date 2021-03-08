import React, { useEffect, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { SliceState } from '../redux/types';
import AppThunk from '../redux/appThunk';
import Spinner from './Spinner';

interface Props<Slice extends SliceState> {
  WrappedComponent: React.FC<Slice>;
  reduxThunk: () => AppThunk;
  reduxSelector: (state: RootState) => Slice;
}

const WithReduxSlice = <Slice extends SliceState>(props: Props<Slice>): ReactElement => {
  const dispatch = useDispatch();

  const slice = useSelector(props.reduxSelector);

  useEffect(() => {
    if (slice.requestStatus === 'NO_REQUEST_YET') {
      dispatch(props.reduxThunk());
    }
  }, []);

  if (slice.requestStatus === 'ERROR') {
    return <p>An error occurred: {slice.error}</p>;
  }

  if (slice.requestStatus !== 'LOADED') {
    return <Spinner />;
  }

  return <props.WrappedComponent {...slice} />;
};

export default WithReduxSlice;
