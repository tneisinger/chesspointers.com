import React, { useState } from 'react';
import Chessground from 'react-chessground';
import { calcChessBoardSize } from '../utils';
import { ChessTree, PieceColor } from '../../shared/chessTypes';
import { getUniquePaths } from '../../shared/chessTree';
import { Chess, ChessInstance } from "chess.js";

interface Props {
  chessTree: ChessTree;
  orientation: PieceColor;
}

const ChessTreePreview: React.FC<Props> = (props) => {
  const paths = getUniquePaths(props.chessTree);
  const shortestPath = paths.reduce((oldPath, currentPath) => {
    return currentPath.length < oldPath.length ? currentPath : oldPath;
  }, { length: Infinity }) as string[];

  const endIdx = Math.floor(shortestPath.length * 0.75);
  const shortestPathTrimmed = shortestPath.slice(0, endIdx);

  const chess = new Chess();

  shortestPathTrimmed.forEach((move) => {
    chess.move(move);
  });

  const [boardPosition, setBoardPosition] = useState<string>(chess.fen())
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <>
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Chessground
          coordinates={false}
          fen={boardPosition}
          orientation={props.orientation}
          viewOnly
        />
      </button>
    </>
  );
}

export default ChessTreePreview;
