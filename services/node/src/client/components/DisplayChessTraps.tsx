import React from 'react';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { formatTrapName } from '../../shared/chessTraps/index';

interface Props {
  chessTraps: ChessTrap[]
}

const DisplayChessTraps: React.FC<Props> = ({ chessTraps }) => {
  return (
    <>
      {chessTraps.map(trap => (
        <p>{formatTrapName(trap)}</p>
      ))}
    </>
  );
}

export default DisplayChessTraps;
