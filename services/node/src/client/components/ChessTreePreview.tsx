import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import Chessground from 'react-chessground';
import { ChessTree, PieceColor } from '../../shared/chessTypes';
import { getUniquePaths, getPreviewPositionPath } from '../../shared/chessTree';
import { Chess, ChessInstance } from 'chess.js';
import { calcChessBoardSize, BoardSizeUnits } from '../utils';
import useInterval from 'react-useinterval';

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
  boardSize = calcChessBoardSize(350, 'px'),
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
    const shortestPath = paths.reduce(
      (oldPath, currentPath) => {
        return currentPath.length < oldPath.length ? currentPath : oldPath;
      },
      { length: Infinity },
    ) as string[];

    const endIdx = Math.floor(shortestPath.length * 0.75);
    return shortestPath.slice(0, endIdx);
  };

  const [chess] = useState<ChessInstance>(new Chess());
  const [paths] = useState<string[][]>(getUniquePaths(chessTree));
  const [boardPosition, setBoardPosition] = useState<string>(chess.fen());
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [currentPathIdx, setCurrentPathIdx] = useState<number>(0);
  const [playedMoves, setPlayedMoves] = useState<string[]>([]);
  const [previewPosPath] = useState<string[]>(getPreviewPosPath());

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

  const startMoving = () => {
    chess.reset();
    setPlayedMoves([]);
    setBoardPosition(chess.fen());
  };

  useInterval(() => {
    if ((playMoves === 'onHover' && isHovered) || playMoves === 'always') {
      const path = paths[currentPathIdx];
      if (path == undefined) throw new Error('Path undefined!');
      if (playedMoves.length >= path.length) {
        setCurrentPathIdx((idx) => (idx < paths.length - 1 ? idx + 1 : 0));
        chess.reset();
        setBoardPosition(chess.fen());
        setPlayedMoves([]);
        return;
      }
      const nextMove = path[playedMoves.length];
      if (nextMove != undefined) {
        chess.move(nextMove);
        setBoardPosition(chess.fen());
        setPlayedMoves([...playedMoves, nextMove]);
      }
    }
  }, msBetweenMoves);

  const calcBoardSize = (): number => {
    if (boardSizeUnits === 'px') return boardSize;
    return calcChessBoardSize(boardSize, boardSizeUnits);
  };

  useEffect(() => {
    if (playMoves === 'onHover') {
      isHovered ? startMoving() : setBoardToPreviewPosition();
    }
  }, [isHovered]);

  const finalBoardSize = calcBoardSize() + 'px';

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
