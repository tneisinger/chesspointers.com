import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/List';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';
import { toDashedLowercase } from '../../shared/utils';
import { formatTrapName } from '../../shared/chessTraps/index';

const useStyles = makeStyles(() => ({
  navLink: {
    color: 'white',
    textDecoration: 'none',
    '&:visited': {
      color: '#d6d8de'
    },
    '&:hover': {
      textDecoration: 'underline',
    }
  },
}));

const ChessTrapsList: React.FC<void> = () => {
  const classes = useStyles();

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
            <NavLink
              className={classes.navLink}
              to={`/traps/${toDashedLowercase(trap.name)}`} >
              {formatTrapName(trap)}
            </NavLink>
          </ListItem>
        );
      })}
    </List>
  );
}

export default ChessTrapsList;
