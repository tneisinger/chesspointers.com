import { makeStyles, CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Chessboard from "chessboardjsx";

const useStyles = makeStyles(() => ({
  msg: {
    marginTop: '20px',
  },
}));

const HomePage: React.FunctionComponent = () => {
  const classes = useStyles({});
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Something here' />
        <CardContent>
          <Chessboard
            width={650}
            position="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          />
          <Typography className={classes.msg}>
            Play!
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default HomePage;
