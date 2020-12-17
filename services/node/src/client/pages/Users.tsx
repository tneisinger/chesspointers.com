import { CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import UsersList from '../components/UsersList';

const UsersPage: React.FunctionComponent = () => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Fetch Data From the Database' />
        <CardContent>
          <Typography>
            The data below was fetched from the postgres database that lives in a separate
            docker container.
          </Typography>
          <UsersList />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default UsersPage;
