import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';

interface Props {
}

const RequireChessTraps: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const chessTrapsSlice = useSelector((state: RootState) => state.chessTrapsSlice);

  useEffect(() => {
    if (chessTrapsSlice.requestStatus === 'NO_REQUEST_YET') {
      dispatch(getChessTrapsThunk());
    }
  }, []);

  if (chessTrapsSlice.requestStatus === 'ERROR') {
    return (
      <p>An error occurred: {chessTrapsSlice.error}</p>
    );
  }

  if (chessTrapsSlice.requestStatus !== 'LOADED') {
    return (
      <p>Loading...</p>
    );
  }

  const childrenWithSlice = React.Children.map(props.children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { chessTraps: chessTrapsSlice.traps });
    }
    return child;
  });

  return <>{childrenWithSlice}</>;
}

export default RequireChessTraps;
