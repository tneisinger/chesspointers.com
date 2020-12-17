import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getUserFullName } from '../../shared/utils';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/List';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getUsersThunk } from '../redux/usersSlice';

const UsersList = () => {
  const dispatch = useDispatch();
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  useEffect(() => {
    if (usersSlice.requestStatus === 'NO_REQUEST_YET') {
      dispatch(getUsersThunk());
    }
  }, []);

  if (usersSlice.requestStatus === 'ERROR') {
    return (
      <p>An error occurred: {usersSlice.error}</p>
    );
  }

  if (usersSlice.requestStatus !== 'LOADED') {
    return (
      <p>Loading...</p>
    );
  }

  return (
    <List>
      { usersSlice.users.map((user, idx) => {
        const userFullName = getUserFullName(user);
        return (
          <ListItem key={userFullName + idx}>
            <NavLink to={`/users/${user.id}`} >
              {userFullName}
            </NavLink>
          </ListItem>
        );
      })}
    </List>
  );
}

export default UsersList;
