import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { Trap } from '../../shared/entity/trap';
import { getTrapsThunk } from '../redux/trapsSlice';
import Spinner from './Spinner';

interface Props {
  renderWithTraps: (traps: Trap[]) => JSX.Element;
}

const WithTraps: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const trapsSlice = useSelector((state: RootState) => state.trapsSlice);

  useEffect(() => {
    if (trapsSlice.requestStatus === 'NO_REQUEST_YET') {
      dispatch(getTrapsThunk());
    }
  }, []);

  if (trapsSlice.requestStatus === 'ERROR') {
    return <p>An error occurred: {trapsSlice.error}</p>;
  }

  if (trapsSlice.requestStatus !== 'LOADED') {
    return <Spinner />;
  }

  return props.renderWithTraps(trapsSlice.traps);
};

export default WithTraps;
