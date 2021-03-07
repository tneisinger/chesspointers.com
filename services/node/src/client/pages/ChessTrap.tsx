import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ChessTrap } from '../../shared/entity/chessTrap';
import ChessGuide from '../components/ChessGuide';
import MovesPane from '../components/MovesPane';
import WithTraps from '../components/WithTraps';
import NotFoundPage from '../pages/NotFound';
import { toDashedLowercase } from '../../shared/utils';
import { calcChessBoardSize } from '../utils';
import { useWindowSize } from '../hooks/useWindowSize';

const useStyles = makeStyles((theme: Theme) => ({
  trapName: {
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: '1rem',
    marginBottom: '0',
    [theme.breakpoints.up('sm')]: {
      fontSize: '2.5rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.6rem',
    },
  },
  chessTrapRoot: {
    height: '100%',
    width: 'inherit',
    maxWidth: 'inherit',
  },
}));

const ChessTrapPage: React.FunctionComponent = () => {
  return (
    <WithTraps
      renderWithTraps={(chessTraps) => <ChessTrapPageContent chessTraps={chessTraps} />}
    />
  );
};

const ChessTrapPageContent: React.FC<{ chessTraps: ChessTrap[] }> = ({ chessTraps }) => {
  const classes = useStyles({});
  const { windowWidth, windowHeight } = useWindowSize();
  const { trapName } = useParams<{ trapName: string }>();

  let boardSizePixels;
  if (windowWidth > windowHeight) {
    boardSizePixels = calcChessBoardSize(70, 'vh');
  } else {
    boardSizePixels = calcChessBoardSize(95, 'vw');
  }

  // Find the trap with a name that matches the trapName param
  const trap = chessTraps.find((t) => toDashedLowercase(t.shortName) === trapName);

  // If `trap` is undefined, that means that the trapName param didn't match the name of
  // any of the traps in the db. In that case, treat it as not found.
  if (trap === undefined) {
    return <NotFoundPage />;
  }

  return (
    <Grid
      container
      className={classes.chessTrapRoot}
      direction='column'
      alignItems='center'
      justify='center'
    >
      <Grid item>
        <Typography className={classes.trapName} variant='h4' component='h2'>
          {trap.fullName}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container direction='row' spacing={2}>
          <Grid item>
            <ChessGuide
              chessTree={trap.chessTree}
              userPlaysAs={trap.playedByWhite ? 'white' : 'black'}
              boardSizePixels={boardSizePixels}
            >
              {windowWidth > 1000 && (
                <MovesPane
                  height={boardSizePixels}
                  playedMoves={[]}
                  selectedMoveIdx={null}
                  changeSelectedMoveIdx={(idx) => void idx}
                />
              )}
            </ChessGuide>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChessTrapPage;
