import React from 'react';
import Typography from '@material-ui/core/Typography'
import { NavLink }  from 'react-router-dom'
import { ChessTrap } from '../../shared/entity/chessTrap';
import { formatTrapName } from '../../shared/chessTraps/index';
import { toDashedLowercase } from '../../shared/utils';

interface Props {
  chessTraps: ChessTrap[]
}

const DisplayChessTraps: React.FC<Props> = ({ chessTraps }) => {
  return (
    <>
      {chessTraps.map(trap => (
        <Typography>
          <NavLink key={trap.name} to={`/traps/${toDashedLowercase(trap.name)}`}>
            {formatTrapName(trap)}
          </NavLink>
        </Typography>
      ))}
    </>
  );
}

export default DisplayChessTraps;
