import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import DisplayChessTraps from './DisplayChessTraps';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { partition, sortChessTrapsByName } from '../../shared/utils';

const useStyles = makeStyles({
  cardContent: {
    padding: '0 3rem 0 3rem'
  },
  cardTitle: {
    marginTop: '1rem',
    marginBottom: '1rem',
  }
});

interface Props {
  chessTraps: ChessTrap[]
}

const DisplayAllChessTraps: React.FC<Props> = ({ chessTraps }) => {
  const classes = useStyles({});
  const [whiteTraps, blackTraps] = partition(chessTraps, (trap) => trap.playedByWhite);
  sortChessTrapsByName(whiteTraps);
  sortChessTrapsByName(blackTraps);

  return (
    <Grid item xs={12}>
      <Grid container direction='row' justify='center' spacing={2}>
        <Grid item>
          <Card>
            <CardContent className={classes.cardContent}>
              <Typography
                variant='h4'
                component='h2'
                align='center'
                className={classes.cardTitle}
              >
                Traps for White
              </Typography>
              <DisplayChessTraps chessTraps={whiteTraps} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent className={classes.cardContent}>
              <Typography
                variant='h4'
                component='h2'
                align='center'
                className={classes.cardTitle}
              >
                Traps for Black
              </Typography>
              <DisplayChessTraps chessTraps={blackTraps} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DisplayAllChessTraps;
