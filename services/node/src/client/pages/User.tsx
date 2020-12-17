import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CardHeader, makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getUsersThunk } from '../redux/usersSlice';
import NotFoundPage from "../pages/NotFound";

const useStyles = makeStyles(() => ({
  table: {
    backgroundColor: '#f5f5f5',
    width: '600px',
  },
}));

const UserPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const classes = useStyles({});

  const { userId } = useParams<{ userId: string }>();

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

  // Find the user that matches the userId param
  const user = usersSlice.users.find((u) => String(u.id) === userId);

  // If `user` is undefined, that means that the userId param didn't match an id of
  // any of the users that we have. In that case, treat it as not found.
  if (user === undefined) {
    return <NotFoundPage />
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Fetched User Data From the Database' />
        <CardContent>
          <TableContainer>
            <Table className={classes.table}>
              <TableBody>
                <UserTableRow label="First Name" value={user.firstName} />
                <UserTableRow label="Last Name" value={user.lastName} />
                <UserTableRow label="Age" value={String(user.age)} />
                <UserTableRow label="Email" value={user.email} />
                <UserTableRow label="Joined On" value={String(user.joinedOn)} />
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>
  );
};

type PropsUTR = {
  label: string,
  value: string,
}

const UserTableRow: React.FunctionComponent<PropsUTR> = ({ label, value }) => {
  return (
    <TableRow>
      <TableCell>
        <strong>{label}:</strong>
      </TableCell>
      <TableCell>
        {value}
      </TableCell>
    </TableRow>
  );
}

export default UserPage;
