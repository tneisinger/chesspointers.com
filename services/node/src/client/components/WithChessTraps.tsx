import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';
import Spinner from './Spinner';

interface Props {
  renderWithChessTraps: (chessTraps: ChessTrap[]) => JSX.Element;
}

const WithChessTraps: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const chessTrapsSlice = useSelector((state: RootState) => state.chessTrapsSlice);

  useEffect(() => {
    if (chessTrapsSlice.requestStatus === 'NO_REQUEST_YET') {
      dispatch(getChessTrapsThunk());
    }
  }, []);

  if (chessTrapsSlice.requestStatus === 'ERROR') {
    return <p>An error occurred: {chessTrapsSlice.error}</p>;
  }

  if (chessTrapsSlice.requestStatus !== 'LOADED') {
    return <Spinner />;
  }

  return props.renderWithChessTraps(chessTrapsSlice.traps);
};

export default WithChessTraps;
