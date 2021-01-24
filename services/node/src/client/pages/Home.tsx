import React from 'react';
import { makeStyles, CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import ChessTreePreview from '../components/ChessTreePreview';
import { staffordTrap1 } from '../../shared/chessTraps';

const useStyles = makeStyles(() => ({
  mainCard: {
    padding: '0 40px',
  },
  cardHeader: {
    textAlign: 'center',
    paddingBottom: '0',
    marginBottom: '0',
  },
}));

const HomePage: React.FunctionComponent = () => {
  const classes = useStyles({});

  return (
    <Grid item xs={12}>
      <Grid container direction='row' justify='center' spacing={2}>
        <Grid item>
          <Card className={classes.mainCard}>
            <CardHeader className={classes.cardHeader} title='Home Page' />
            <CardContent>
              <p>Welcome!</p>
              <ChessTreePreview
                chessTree={staffordTrap1.chessTree}
                orientation={staffordTrap1.playedByWhite ? 'white' : 'black'}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;
