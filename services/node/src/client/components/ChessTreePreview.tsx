import React, { useState, useEffect, useRef } from 'react';
import Chessground from 'react-chessground';
import { ChessTree, PieceColor, ChessTreeLine } from '../../shared/chessTypes';
import { getTreeLines, getPreviewPositionLine } from '../../shared/chessTree';
import { Chess, ChessInstance, ShortMove } from 'chess.js';
import { calcChessBoardSize, BoardSizeUnits } from '../utils';
import { basicCompare, playMoveOrErr } from '../../shared/utils';
import { DrawableProp, ChessboardArrow, BrushColor } from '../utils/types';

export const BOARD_ANIMATION_DURATION = 200;

export interface Props {
  chessTree: ChessTree;
  orientation: PieceColor;
  stepper: number;
  usePreviewPosition?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
  boardSize?: number;
  boardSizeUnits?: BoardSizeUnits;
  showArrows?: boolean;
}

const ChessTreePreview: React.FC<Props> = ({
  chessTree,
  orientation,
  stepper,
  usePreviewPosition = false,
  onHoverChange = () => void 0,
  boardSize = 350,
  boardSizeUnits = 'px',
  showArrows = false,
}) => {
  const playMoveTimeout = useRef<number | undefined>(undefined);

  // The number returned by this function determines when the move arrow should be shown.
  // When `orientation` is white, the move arrow should be shown before either color
  // moves, so return 1. When `orientation` is black, the move arrow should be shown after
  // white has moved, so return 2.
  const getShowArrowsStepNum = () => orientation === 'white' ? 1 : 2;

  const getLines = (): ChessTreeLine[] => (
    getTreeLines(chessTree, 'verbose').sort((p1, p2) =>
      basicCompare(p1.teachingPriority, p2.teachingPriority, { descending: true })
    )
  );

  const getNextShortMove = (): ShortMove | undefined => {
    const nextMove = getNextMove();
    if (nextMove == undefined) return undefined;
    playMoveOrErr(chess, nextMove);
    const history = chess.history({ verbose: true });
    chess.undo();
    return history[history.length - 1];
  }

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

  // Get the number of steps that have occurred since switching chess move lines.
  const stepNum = () => stepper - stepperBase;

  const shouldShowMoveArrows = (): boolean => (
    showArrows &&
    chess.turn() === orientation.charAt(0) &&
    stepNum() > 0 &&
    stepNum() % 3 === showArrowsNthStep
  );

  const makeNextMoveArrows = (): ChessboardArrow[] => {
    if (shouldShowMoveArrows()) {
      const shortMove = getNextShortMove();
      if (shortMove == undefined) return [];
      return [{
        orig: shortMove.from,
        dest: shortMove.to,
        brush: BrushColor.GREEN,
      }];
    }
    return [];
  }

  const makeDrawableProp = (shapes?: ChessboardArrow[]): DrawableProp => {
    const autoShapes = shapes == undefined ? makeNextMoveArrows() : shapes;
    return {
      enabled: true,
      visible: true,
      eraseOnClick: false,
      defaultSnapToValidMove: true,
      autoShapes,
    }
  }

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

  const reset = (): void => {
    chess.reset();
    setBoardPosition(chess.fen());
    setCurrentLineIdx(0);
    setPlayedMoves([]);
    setPreviewPosLine(getPreviewPosLine());
    setLines(getLines());
    setStepperBase(0);
  }

  const setBoardToPreviewPosition = () => {
    chess.reset();
    previewPosLine.forEach((move) => {
      if (!chess.move(move)) {
        throw new Error(`Invalid move ${move} in previewPosLine`);
      }
    });
    setBoardPosition(chess.fen());
  };

  const getCurrentLine = (): ChessTreeLine => {
    const lineObj = lines[currentLineIdx];
    if (lineObj == undefined) throw new Error('Line undefined');
    return lineObj;
  }

  const playNextMove = () => {
    const lineObj = getCurrentLine();
    if (playedMoves.length >= lineObj.line.length) {
      setCurrentLineIdx((idx) => (idx < lines.length - 1 ? idx + 1 : 0));
      chess.reset();
      setBoardPosition(chess.fen());
      setPlayedMoves([]);
      setStepperBase(stepper);
      return;
    }
    const nextMove = lineObj.line[playedMoves.length];
    if (nextMove != undefined) {
      chess.move(nextMove);
      clearArrows();
      playMoveTimeout.current =
        window.setTimeout(() => {
          setBoardPosition(chess.fen());
          setPlayedMoves([...playedMoves, nextMove]);
        }, 20);
    }
  };

  const getNextMove = (): string | undefined => {
    return getCurrentLine().line[playedMoves.length];
  }

  const clearArrows = () => setDrawableProp(makeDrawableProp([]));

  const resetBoardToStartPos = () => {
    chess.reset();
    setBoardPosition(chess.fen());
    setPlayedMoves([]);
  };

  const doNextStep = () => {
    if (showArrows && stepNum() > 0 && stepNum() % 3 === showArrowsNthStep) {
      setDrawableProp(makeDrawableProp());
      return;
    }
    playNextMove();
  }

  const finalBoardSize = calcChessBoardSize(boardSize, boardSizeUnits) + 'px';

  const [showArrowsNthStep, setShowArrowsNthStep] = useState<number>(
    getShowArrowsStepNum()
  );
  const [currentLineIdx, setCurrentLineIdx] = useState<number>(0);

  // Set this value to the current stepper value whenever we switch chessTree lines.
  // The stepper value always increases by one. We store this value so we can always tell
  // how many steps have occurred since the last time we switched ChessTree lines.
  // This is useful because we determine whether or not to show arrows based on how many
  // steps have occurred since the last time the ChessTree line was changed.
  const [stepperBase, setStepperBase] = useState<number>(0);

  const [chess] = useState<ChessInstance>(new Chess());
  const [boardPosition, setBoardPosition] = useState<string>(chess.fen());
  const [playedMoves, setPlayedMoves] = useState<string[]>([]);
  const [previewPosLine, setPreviewPosLine] = useState<string[]>(getPreviewPosLine());
  const [lines, setLines] = useState<ChessTreeLine[]>(getLines());
  const [drawableProp, setDrawableProp] = useState<DrawableProp>(makeDrawableProp());

  useEffect(() => {
    setShowArrowsNthStep(getShowArrowsStepNum());
  }, [orientation]);

  // Clear the timeout on unmount
  useEffect(() => {
    return () => window.clearTimeout(playMoveTimeout.current);
  }, []);

  useEffect(() => {
    if (usePreviewPosition) {
      setBoardToPreviewPosition();
    }
  }, []);

  useEffect(() => {
    reset();
  }, [chessTree]);

  useEffect(() => {
    if (stepper < 0) {
      if (usePreviewPosition) setBoardToPreviewPosition();
    } else if (stepper === 0) {
      resetBoardToStartPos();
    } else {
      doNextStep();
    }
  }, [stepper]);

  return (
    <div
      onTouchStart={() => onHoverChange(true)}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <Chessground
        key={String(drawableProp.autoShapes)}
        width={finalBoardSize}
        height={finalBoardSize}
        coordinates={false}
        fen={boardPosition}
        orientation={orientation}
        animation={{ duration: BOARD_ANIMATION_DURATION }}
        viewOnly
        highlight={{ check: true }}
        check={chess.in_check()}
        turnColor={chess.turn() === 'w' ? 'white' : 'black'}
        drawable={drawableProp as any}
      />
    </div>
  );
};

export default ChessTreePreview;
