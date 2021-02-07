import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import Chessground from 'react-chessground';
import { ChessTree, PieceColor, ChessTreePath } from '../../shared/chessTypes';
import { getTreePaths, getPreviewPositionPath } from '../../shared/chessTree';
import { Chess, ChessInstance } from 'chess.js';
import { calcChessBoardSize, BoardSizeUnits } from '../utils';
import useInterval from 'react-useinterval';
import { basicCompare } from '../../shared/utils';

const MIN_MS_BEFORE_FIRST_MOVE = 250;

interface StyleProps {
  allowPointerEvents: boolean;
}

const useStyles = makeStyles({
  hoverDiv: {
    pointerEvents: (props: StyleProps) => (props.allowPointerEvents ? 'auto' : 'none'),
  },
});

interface Props {
  chessTree: ChessTree;
  orientation: PieceColor;
  boardSize?: number;
  boardSizeUnits?: BoardSizeUnits;
  msBetweenMoves?: number;
  playMoves?: 'always' | 'onHover';
}

const ChessTreePreview: React.FC<Props> = ({
  chessTree,
  orientation,
  boardSize = 350,
  boardSizeUnits = 'px',
  msBetweenMoves = 600,
  playMoves = 'onHover',
}) => {
  const classes = useStyles({
    allowPointerEvents: playMoves === 'onHover',
  });

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
  const [isHovered, setIsHovered] = useState<boolean>(false);
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
    if (playMoves === 'always') {
      startMoving();
    }
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

  const startMovingStartTime = useRef<number>(0);

  const startMoving = () => {
    startMovingStartTime.current = Date.now();
    chess.reset();
    setPlayedMoves([]);
    setCurrentPathIdx(0);
    setBoardPosition(chess.fen());
  };

  const shouldPlayMove = (): boolean =>
    (playMoves === 'onHover' && isHovered) || playMoves === 'always';

  const hasEnoughTimePassed = (): boolean =>
    Date.now() - startMovingStartTime.current > MIN_MS_BEFORE_FIRST_MOVE;

  useInterval(() => {
    if (shouldPlayMove() && hasEnoughTimePassed()) {
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
    }
  }, msBetweenMoves);

  useEffect(() => {
    if (playMoves === 'onHover') {
      isHovered ? startMoving() : setBoardToPreviewPosition();
    }
  }, [isHovered]);

  const finalBoardSize = calcChessBoardSize(boardSize, boardSizeUnits) + 'px';

  return (
    <div
      className={classes.hoverDiv}
      onMouseEnter={() => (playMoves === 'onHover' ? setIsHovered(true) : void 0)}
      onMouseLeave={() => (playMoves === 'onHover' ? setIsHovered(false) : void 0)}
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
