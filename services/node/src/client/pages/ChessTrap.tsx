import React, { useState, useCallback } from 'react';
import { Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ChessTrap } from '../../shared/entity/chessTrap';
import ChessGuide from '../components/ChessGuide';
import MovesPane from '../components/MovesPane';
import WithChessTraps from '../components/WithChessTraps';
import NotFoundPage from '../pages/NotFound';
import { toDashedLowercase } from '../../shared/utils';
import { calcChessBoardSize } from '../utils';
import { useWindowSize } from '../hooks/useWindowSize';

const useStyles = makeStyles((theme: Theme) => ({
  mainCard: {
    padding: '32px',
  },
  gridItem: {
    paddingTop: '0px!important',
    paddingBottom: '0px!important',
  },
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
}));

const ChessTrapPage: React.FunctionComponent = () => {
  return (
    <WithChessTraps
      renderWithChessTraps={(chessTraps) => (
        <ChessTrapPageContent chessTraps={chessTraps} />
      )}
    />
  );
};

const ChessTrapPageContent: React.FC<{ chessTraps: ChessTrap[] }> = ({ chessTraps }) => {
  const classes = useStyles({});
  const { windowWidth } = useWindowSize();
  const { trapName } = useParams<{ trapName: string }>();

  const boardSizePixels = calcChessBoardSize(70, 'vh');
  const [containerHeight, setContainerHeight] = useState<number>(boardSizePixels);

  const gridContainerRef = useCallback((card) => {
    if (card != null) {
      setContainerHeight(card.clientHeight);
    }
  }, []);

  // Find the trap with a name that matches the trapName param
  const trap = chessTraps.find((t) => toDashedLowercase(t.shortName) === trapName);

  // If `trap` is undefined, that means that the trapName param didn't match the name of
  // any of the traps in the db. In that case, treat it as not found.
  if (trap === undefined) {
    return <NotFoundPage />;
  }

  return (
    <Grid container direction='row' justify='center'>
      <Grid item className={classes.gridItem}>
        <Typography className={classes.trapName} variant='h4' component='h2'>
          {trap.fullName}
        </Typography>
        <Card className={classes.mainCard}>
          <Grid container ref={gridContainerRef} direction='row' spacing={2}>
            <Grid item className={classes.gridItem}>
              <ChessGuide
                chessTree={trap.chessTree}
                userPlaysAs={trap.playedByWhite ? 'white' : 'black'}
                boardSizePixels={boardSizePixels}
              >
                {windowWidth > 1000 && (
                  <MovesPane
                    height={containerHeight}
                    playedMoves={[]}
                    selectedMoveIdx={null}
                    changeSelectedMoveIdx={(idx) => void idx}
                  />
                )}
              </ChessGuide>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChessTrapPage;
