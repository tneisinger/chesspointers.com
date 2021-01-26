import React from 'react';
import { NavLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ChessLessonPreview from './ChessLessonPreview';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { formatTrapName } from '../../shared/chessTraps/index';
import { toDashedLowercase } from '../../shared/utils';

interface Props {
  chessTraps: ChessTrap[];
}

const DisplayChessTraps: React.FC<Props> = ({ chessTraps }) => {
  return (
    <Grid container direction='column' spacing={6}>
      {chessTraps.map((trap) => (
        <Grid key={trap.name} item>
          <NavLink to={`/traps/${toDashedLowercase(trap.name)}`}>
            <ChessLessonPreview
              chessTree={trap.chessTree}
              orientation={trap.playedByWhite ? 'white' : 'black'}
              title={formatTrapName(trap)}
            />
          </NavLink>
        </Grid>
      ))}
    </Grid>
  );
};

export default DisplayChessTraps;
