import React from 'react';
import { CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const NotFoundPage: React.FunctionComponent = () => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Page Not Found' />
        <CardContent>
          <Typography>There is nothing here :(</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default NotFoundPage;
