import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { Trap } from '../../shared/entity/chessTrap';
import { getTrapsThunk } from '../redux/chessTrapsSlice';
import Spinner from './Spinner';

interface Props {
  renderWithTraps: (chessTraps: Trap[]) => JSX.Element;
}

const WithTraps: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const chessTrapsSlice = useSelector((state: RootState) => state.chessTrapsSlice);

  useEffect(() => {
    if (chessTrapsSlice.requestStatus === 'NO_REQUEST_YET') {
      dispatch(getTrapsThunk());
    }
  }, []);

  if (chessTrapsSlice.requestStatus === 'ERROR') {
    return <p>An error occurred: {chessTrapsSlice.error}</p>;
  }

  if (chessTrapsSlice.requestStatus !== 'LOADED') {
    return <Spinner />;
  }

  return props.renderWithTraps(chessTrapsSlice.traps);
};

export default WithTraps;
