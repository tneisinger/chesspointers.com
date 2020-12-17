import { makeStyles, CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(() => ({
  secretMessage: {
    color: 'red',
  },
}));

export const PrivatePage: React.FunctionComponent = () => {
  const classes = useStyles({});
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='This page is PRIVATE!' />
        <CardContent>
          <Typography className={classes.secretMessage}>
            This page should only be accessable if you are logged in!
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PrivatePage;
