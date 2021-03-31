import React, { useEffect, useState, useRef } from 'react';
import MovesTable from './MovesTable';
import ScrollablePane from './ScrollablePane';

interface Props {
  height: number;
  playedMoves: string[];
  selectedMoveIdx: number | null;
  changeSelectedMoveIdx: (idx: number | null) => void;
}

const MovesPane: React.FC<Props> = (props) => {
  const [triggerScrollToBottomIdx, setTriggerScrollToBottomIdx] = useState<number>(0);

  const previousPlayedMoves = useRef<string[] | null>(null);

  // Whenever `props.playedMoves` changes...
  useEffect(() => {
    // If the new playedMoves array is longer than the previousPlayedMoves, scroll to the
    // bottom.
    if (
      previousPlayedMoves.current == null ||
      props.playedMoves.length > previousPlayedMoves.current.length
    ) {
      setTriggerScrollToBottomIdx((idx) => idx + 1);
    }
    previousPlayedMoves.current = props.playedMoves;
  }, [props.playedMoves]);

  return (
    <ScrollablePane
      height={props.height}
      title='Moves'
      triggerScrollToBottomIdx={triggerScrollToBottomIdx}
    >
      <MovesTable moves={props.playedMoves} {...props} />
    </ScrollablePane>
  );
};

export default MovesPane;
