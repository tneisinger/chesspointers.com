import React from 'react';
import RequireChessTraps from '../components/RequireChessTraps';
import DisplayAllChessTraps from '../components/DisplayAllChessTraps';

const ChessTrapsPage: React.FunctionComponent = () => {
  return (
    <RequireChessTraps>
      <DisplayAllChessTraps chessTraps={[]} />
    </RequireChessTraps>
  );
};

export default ChessTrapsPage;
