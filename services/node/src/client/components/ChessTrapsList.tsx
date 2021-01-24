import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/List';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';
import { toDashedLowercase } from '../../shared/utils';
import { formatTrapName } from '../../shared/chessTraps/index';

const ChessTrapsList: React.FC = () => {
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

  return (
    <List>
      { chessTrapsSlice.traps.map(trap => {
        return (
          <ListItem  key={trap.name}>
            <NavLink to={`/traps/${toDashedLowercase(trap.name)}`} >
              {formatTrapName(trap)}
            </NavLink>
          </ListItem>
        );
      })}
    </List>
  );
}

export default ChessTrapsList;
