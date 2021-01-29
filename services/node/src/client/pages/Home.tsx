import React, { useState } from 'react';
import { makeStyles, CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import ChessTrapFilters from '../components/ChessTrapFilters';
import allChessTraps from '../../shared/chessTraps';
import { ChessTrap } from '../../shared/entity/chessTrap';

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

  const [selectedTraps, setSelectedTraps] = useState<ChessTrap[]>(allChessTraps);

  return (
    <Grid item xs={12}>
      <Grid container direction='row' justify='center' spacing={2}>
        <Grid item>
          <Card className={classes.mainCard}>
            <CardHeader className={classes.cardHeader} title='Home Page' />
            <CardContent>
              <p>Welcome!</p>
              <ChessTrapFilters
                allTraps={allChessTraps}
                setSelectedTraps={setSelectedTraps}
              />
              <div>
                {selectedTraps.map((trap) => (
                  <p key={trap.shortName}>{trap.shortName}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;
