import React from 'react';
import MovesTable from './MovesTable';
import ScrollablePane from './ScrollablePane';

interface Props {
  height: number;
  playedMoves: string[];
}

const MovesPane: React.FC<Props> = (props) => {
  return (
    <ScrollablePane
      height={props.height}
      title='Moves'
      autoScrollDownWhenContentAdded
    >
      <MovesTable moves={props.playedMoves} />
    </ScrollablePane>
  );
}

export default MovesPane;
