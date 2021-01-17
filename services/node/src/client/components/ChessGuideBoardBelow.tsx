import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';

interface Props {
  score: number
}

// This component creates the content that goes above the ChessGuideBoard
const ChessGuideBoardBelow: React.FunctionComponent<Props> = ({
  score,
}) => {
  return (
          <Grid
            container
            direction='row'
            justify='space-between'
          >
            <Grid item>
              <Typography variant='caption'>
                Score: {score}
              </Typography>
            </Grid>
          </Grid>
        );
}

export default ChessGuideBoardBelow;
