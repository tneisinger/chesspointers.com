import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ChessTreePreview from './ChessTreePreview';
import { ChessTree, PieceColor } from '../../shared/chessTypes';

interface Props {
  chessTree: ChessTree;
  orientation: PieceColor;
  title: string;
}

const ChessLessonPreview: React.FC<Props> = (props) => {
  return (
    <Grid container direction='column' spacing={2}>
      <Grid item>
        <Typography variant='h5' component='h4' align='center'>
          {props.title}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container direction='row' justify='center'>
          <Grid item>
            <ChessTreePreview
              chessTree={props.chessTree}
              orientation={props.orientation}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChessLessonPreview;
