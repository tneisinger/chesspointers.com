import React, { useEffect, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { SliceState } from '../redux/types';
import AppThunk from '../redux/appThunk';
import Spinner from './Spinner';

interface Props<S extends SliceState, P> {
  WrappedComponent: React.FC<P & S>;
  reduxThunk: () => AppThunk;
  reduxSelector: (state: RootState) => S;
  componentExtraProps?: P;
}

const WithReduxSlice = <S extends SliceState, P>(props: Props<S, P>): ReactElement => {
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

  if (slice.requestStatus === 'LOADING') {
    return <Spinner />;
  }

  return <props.WrappedComponent {...slice} {...props.componentExtraProps} />;
};

export default WithReduxSlice;
