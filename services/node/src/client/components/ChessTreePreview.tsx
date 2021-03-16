import React, { useState, useEffect } from 'react';
import Chessground from 'react-chessground';
import { ChessTree, PieceColor, ChessTreeLine } from '../../shared/chessTypes';
import { getTreeLines, getPreviewPositionLine } from '../../shared/chessTree';
import { Chess, ChessInstance } from 'chess.js';
import { calcChessBoardSize, BoardSizeUnits } from '../utils';
import { basicCompare } from '../../shared/utils';

interface Props {
  chessTree: ChessTree;
  orientation: PieceColor;
  stepper: number;
  usePreviewPosition?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
  boardSize?: number;
  boardSizeUnits?: BoardSizeUnits;
}

const ChessTreePreview: React.FC<Props> = ({
  chessTree,
  orientation,
  stepper,
  usePreviewPosition = false,
  onHoverChange = () => void 0,
  boardSize = 350,
  boardSizeUnits = 'px',
}) => {
  // Try to get the PreviewPosLine from the chessTree. If the chessTree doesn't have a
  // node with isPreviewPosition === true, then just pick a spot somewhere in the middle
  // of the tree.
  const getPreviewPosLine = (): string[] => {
    const previewPosLine = getPreviewPositionLine(chessTree);
    if (previewPosLine != null) {
      return previewPosLine;
    }
    return calcPreviewPosLine();
  };

  // If the ChessTree does not have a node with 'isPreviewPosition' set, use this function
  // to select a preview position instead. Just pick a spot somewhere in the middle of the
  // tree.
  const calcPreviewPosLine = (): string[] => {
    const lines = getTreeLines(chessTree, 'verbose');
    const shortestLineObj = lines.reduce(
      (oldLineObj, currentLineObj) => {
        if (currentLineObj.line.length < oldLineObj.line.length) {
          return currentLineObj;
        } else {
          return oldLineObj;
        }
      },
      { line: { length: Infinity } },
    ) as ChessTreeLine;

    const endIdx = Math.floor(shortestLineObj.line.length * 0.75);
    return shortestLineObj.line.slice(0, endIdx);
  };

  const [chess] = useState<ChessInstance>(new Chess());
  const [boardPosition, setBoardPosition] = useState<string>(chess.fen());
  const [currentLineIdx, setCurrentLineIdx] = useState<number>(0);
  const [playedMoves, setPlayedMoves] = useState<string[]>([]);
  const [previewPosLine] = useState<string[]>(getPreviewPosLine());
  const [lines] = useState<ChessTreeLine[]>(
    getTreeLines(chessTree, 'verbose').sort((p1, p2) =>
      basicCompare(p1.teachingPriority, p2.teachingPriority, { descending: true }),
    ),
  );

  useEffect(() => {
    if (usePreviewPosition) {
      setBoardToPreviewPosition();
    }
  }, []);

  const setBoardToPreviewPosition = () => {
    chess.reset();
    previewPosLine.forEach((move) => {
      if (!chess.move(move)) {
        throw new Error(`Invalid move ${move} in previewPosLine`);
      }
    });
    setBoardPosition(chess.fen());
  };

  const playNextMove = () => {
    const lineObj = lines[currentLineIdx];
    if (lineObj == undefined) throw new Error('Line undefined!');
    if (playedMoves.length >= lineObj.line.length) {
      setCurrentLineIdx((idx) => (idx < lines.length - 1 ? idx + 1 : 0));
      chess.reset();
      setBoardPosition(chess.fen());
      setPlayedMoves([]);
      return;
    }
    const nextMove = lineObj.line[playedMoves.length];
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
      if (usePreviewPosition) setBoardToPreviewPosition();
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
