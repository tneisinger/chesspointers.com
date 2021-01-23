import React, { Dispatch, SetStateAction } from 'react';
import ScrollablePane from './ScrollablePane';
import ChessTrapsSelector from './ChessTrapsSelector';
import allChessTraps from '../../shared/chessTraps/index';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { PieceColor } from '../../shared/chessTypes';

interface Props {
  height: number;
  setSelectedTraps: Dispatch<SetStateAction<ChessTrap[]>>;
  userColor: PieceColor;
  setUserColor: Dispatch<SetStateAction<PieceColor>>;

}

const SelectTrapsPane: React.FC<Props> = (props) => {
  return (
    <ScrollablePane
      height={props.height}
      title='Traps'
    >
      <ChessTrapsSelector
        allChessTraps={allChessTraps}
        setSelectedTraps={props.setSelectedTraps}
        userColor={props.userColor}
        setUserColor={props.setUserColor}
      />
    </ScrollablePane>
  );
}

export default SelectTrapsPane;
