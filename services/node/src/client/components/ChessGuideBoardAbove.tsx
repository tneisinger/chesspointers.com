import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { GuideMode } from '../utils/types';
import { CheckMateStatus } from '../../shared/chessTypes';

interface Props {
  numPaths: number;
  numPathsCompleted: number;
  currentGuideMode: GuideMode;
  checkMateStatus: CheckMateStatus;
}

// This component creates the content that goes above the ChessGuideBoard
const ChessGuideBoardAbove: React.FunctionComponent<Props> = ({
  numPaths,
  numPathsCompleted,
  currentGuideMode,
  checkMateStatus,
}) => {

  const makeCheckMateString = () => {
    switch (checkMateStatus) {
      case 'not in check':
        return '';
      case 'check':
        return 'check!';
      case 'checkmate':
        return 'checkmate!';
    }
  }

  return (
          <Grid
            container
            direction='row'
            justify='space-between'
          >
            <Grid item>
              <Typography variant='caption'>
                Paths completed: {numPathsCompleted}/{numPaths}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='caption'>
                {makeCheckMateString()}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='caption'>
                Current mode: {currentGuideMode}
              </Typography>
            </Grid>
          </Grid>
        );
}

export default ChessGuideBoardAbove;
