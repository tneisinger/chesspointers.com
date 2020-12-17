import { makeStyles, CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(() => ({
  LogoImg: {
    width: 150,
    paddingBottom: 25,
  },
}));

const HomePage: React.FunctionComponent = () => {
  const classes = useStyles({});
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='FullStack React with TypeScript' />
        <CardContent>
          <img src='/assets/images/logo.png' className={classes.LogoImg} />
          <Typography>
            This is a starter kit to get you up and running with React & TypeScript on top
            of material-ui.
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default HomePage;
