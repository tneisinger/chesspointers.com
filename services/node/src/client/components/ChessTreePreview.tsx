import React, { useState, useEffect } from 'react';
import Chessground from 'react-chessground';
import { ChessTree, PieceColor, ChessTreePath } from '../../shared/chessTypes';
import { getTreePaths, getPreviewPositionPath } from '../../shared/chessTree';
import { Chess, ChessInstance } from 'chess.js';
import { calcChessBoardSize, BoardSizeUnits } from '../utils';
import { basicCompare } from '../../shared/utils';

interface Props {
  chessTree: ChessTree;
  orientation: PieceColor;
  stepper: number;
  onHoverChange: (isHovered: boolean) => void;
  boardSize?: number;
  boardSizeUnits?: BoardSizeUnits;
}

const ChessTreePreview: React.FC<Props> = ({
  chessTree,
  orientation,
  stepper,
  onHoverChange,
  boardSize = 350,
  boardSizeUnits = 'px',
}) => {
  // Try to get the PreviewPosPath from the chessTree. If the chessTree doesn't have a
  // node with isPreviewPosition === true, then just pick a spot somewhere in the middle
  // of the tree.
  const getPreviewPosPath = (): string[] => {
    const previewPosPath = getPreviewPositionPath(chessTree);
    if (previewPosPath != null) {
      return previewPosPath;
    }
    return calcPreviewPosPath();
  };

  // If the ChessTree does not have a node with 'isPreviewPosition' set, use this function
  // to select a preview position instead. Just pick a spot somewhere in the middle of the
  // tree.
  const calcPreviewPosPath = (): string[] => {
    const shortestPathObj = paths.reduce(
      (oldPathObj, currentPathObj) => {
        if (currentPathObj.path.length < oldPathObj.path.length) {
          return currentPathObj;
        } else {
          return oldPathObj;
        }
      },
      { path: { length: Infinity } },
    ) as ChessTreePath;

    const endIdx = Math.floor(shortestPathObj.path.length * 0.75);
    return shortestPathObj.path.slice(0, endIdx);
  };

  const [chess] = useState<ChessInstance>(new Chess());
  const [boardPosition, setBoardPosition] = useState<string>(chess.fen());
  const [currentPathIdx, setCurrentPathIdx] = useState<number>(0);
  const [playedMoves, setPlayedMoves] = useState<string[]>([]);
  const [previewPosPath] = useState<string[]>(getPreviewPosPath());
  const [paths] = useState<ChessTreePath[]>(
    getTreePaths(chessTree, 'verbose').sort((p1, p2) =>
      basicCompare(p1.teachingPriority, p2.teachingPriority, { descending: true }),
    ),
  );

  useEffect(() => {
    setBoardToPreviewPosition();
  }, []);

  const setBoardToPreviewPosition = () => {
    chess.reset();
    previewPosPath.forEach((move) => {
      if (!chess.move(move)) {
        throw new Error(`Invalid move ${move} in previewPosPath`);
      }
    });
    setBoardPosition(chess.fen());
  };

  const playNextMove = () => {
    const pathObj = paths[currentPathIdx];
    if (pathObj == undefined) throw new Error('Path undefined!');
    if (playedMoves.length >= pathObj.path.length) {
      setCurrentPathIdx((idx) => (idx < paths.length - 1 ? idx + 1 : 0));
      chess.reset();
      setBoardPosition(chess.fen());
      setPlayedMoves([]);
      return;
    }
    const nextMove = pathObj.path[playedMoves.length];
    if (nextMove != undefined) {
      chess.move(nextMove);
      setBoardPosition(chess.fen());
      setPlayedMoves([...playedMoves, nextMove]);
    }
  };

  const resetBoardToStartPos = () => {
    chess.reset();
    setBoardPosition(chess.fen());
    setPlayedMoves([]);
  };

  useEffect(() => {
    if (stepper < 0) {
      setBoardToPreviewPosition();
    } else if (stepper === 0) {
      resetBoardToStartPos();
    } else {
      playNextMove();
    }
  }, [stepper]);

  const finalBoardSize = calcChessBoardSize(boardSize, boardSizeUnits) + 'px';

  return (
    <div
      onTouchStart={() => onHoverChange(true)}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <Chessground
        width={finalBoardSize}
        height={finalBoardSize}
        coordinates={false}
        fen={boardPosition}
        orientation={orientation}
        viewOnly
        highlight={{ check: true }}
        check={chess.in_check()}
        turnColor={chess.turn() === 'w' ? 'white' : 'black'}
      />
    </div>
  );
};

export default ChessTreePreview;
