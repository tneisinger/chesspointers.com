import React from 'react';
import { makeStyles, CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import ChessGuide from '../components/ChessGuide';
import bsgTrap from '../../shared/chessTraps/blackburneShillingGambit';
import { useParams } from 'react-router-dom';

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

const LearnTrapPage: React.FunctionComponent = () => {

  console.log(bsgTrap);

  const classes = useStyles({});

  const { trap } = useParams<{ trap: string }>();

  return (
    <Grid item xs={12}>
      <Grid container direction='row' justify='center' spacing={2}>
        <Grid item>
          <Card className={classes.mainCard}>
            <CardHeader className={classes.cardHeader} title='Trap Name Here' />
            <CardContent>
              <p>Add the ChessGuide component for <b>{trap}</b> here</p>
              <ChessGuide chessTree={bsgTrap.moves} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LearnTrapPage;
