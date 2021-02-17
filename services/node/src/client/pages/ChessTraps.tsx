import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';
import DisplayChessTraps from '../components/DisplayChessTraps';
import { useWindowSize } from '../hooks/useWindowSize';

const MAX_WIDTH = 1200;

const ChessTrapsPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const { windowWidth } = useWindowSize();

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
    return <p>Loading...</p>;
  }

  const trapsPerRow = windowWidth > 650 ? 2 : 1;
  const parentWidth = Math.min(MAX_WIDTH, windowWidth);

  console.log('trapsPerRow:', trapsPerRow);
  console.log('parentWidth:', parentWidth);

  return (
    <DisplayChessTraps
      chessTraps={chessTrapsSlice.traps}
      parentWidth={parentWidth}
      trapsPerRow={trapsPerRow}
    />
  );
};

export default ChessTrapsPage;
