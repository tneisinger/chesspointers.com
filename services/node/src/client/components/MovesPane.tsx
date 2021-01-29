import React from 'react';
import MovesTable from './MovesTable';
import ScrollablePane from './ScrollablePane';

interface Props {
  height: number;
  playedMoves: string[];
  selectedMoveIdx: number | null;
  changeSelectedMoveIdx: (idx: number | null) => void;
}

const MovesPane: React.FC<Props> = (props) => {
  return (
    <ScrollablePane height={props.height} title='Moves' autoScrollDownWhenContentAdded>
      <MovesTable moves={props.playedMoves} {...props} />
    </ScrollablePane>
  );
};

export default MovesPane;
