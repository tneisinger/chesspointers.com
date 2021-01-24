import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import DisplayChessTraps from './DisplayChessTraps';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { partition, sortChessTrapsByName } from '../../shared/utils';

interface Props {
  chessTraps: ChessTrap[]
}

const DisplayAllChessTraps: React.FC<Props> = ({ chessTraps }) => {
  const [whiteTraps, blackTraps] = partition(chessTraps, (trap) => trap.playedByWhite);
  sortChessTrapsByName(whiteTraps);
  sortChessTrapsByName(blackTraps);

  return (
    <Grid item xs={12}>
      <Grid container direction='row' justify='center' spacing={2}>
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant='h4' component='h2' align='center'>
                White
              </Typography>
              <DisplayChessTraps chessTraps={whiteTraps} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant='h4' component='h2' align='center'>
                Black
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
