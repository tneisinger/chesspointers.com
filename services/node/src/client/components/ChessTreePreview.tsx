import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import Chessground from 'react-chessground';
import { ChessTree, PieceColor } from '../../shared/chessTypes';
import { getUniquePaths } from '../../shared/chessTree';
import { Chess, ChessInstance } from "chess.js";
import { calcChessBoardSize, BoardSizeUnits } from '../utils';
import useInterval from 'react-useinterval'

const FEN_START_POS = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

interface StyleProps {
  allowPointerEvents: boolean;
}

const useStyles = makeStyles({
  hoverDiv: {
    pointerEvents: (props: StyleProps) => props.allowPointerEvents ? 'auto' : 'none',
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

  const [chess] = useState<ChessInstance>(new Chess());
  const [paths] = useState<string[][]>(getUniquePaths(chessTree));
  const [previewPos, setPreviewPos] = useState<string>(chess.fen());
  const [boardPosition, setBoardPosition] = useState<string>(chess.fen())
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [moveInterval, setMoveInterval] = useState<number | null>(null);
  const [currentPathIdx, setCurrentPathIdx] = useState<number>(0);
  const [playedMoves, setPlayedMoves] = useState<string[]>([]);

  useEffect(() => {
    const shortestPath = paths.reduce((oldPath, currentPath) => {
      return currentPath.length < oldPath.length ? currentPath : oldPath;
    }, { length: Infinity }) as string[];

    const endIdx = Math.floor(shortestPath.length * 0.75);
    const shortestPathTrimmed = shortestPath.slice(0, endIdx);
    shortestPathTrimmed.forEach((move) => {
      chess.move(move);
    });
    setBoardPosition(chess.fen());
    setPreviewPos(chess.fen());
    if (playMoves === 'always') {
      startMoving();
    }
  }, []);

  const startMoving = () => {
    chess.reset();
    setPlayedMoves([]);
    setBoardPosition(chess.fen());
  }

  const stopMoving = () => {
    if (previewPos !== FEN_START_POS) {
      setBoardPosition(previewPos)
    }
    if (moveInterval != undefined) {
      window.clearInterval(moveInterval);
      setMoveInterval(null);
    }
  }

  useInterval(() => {
    if ((playMoves === 'onHover' && isHovered) || playMoves === 'always') {
      const path = paths[currentPathIdx];
      if (path == undefined) throw new Error('Path undefined!');
      if (playedMoves.length >= path.length) {
        setCurrentPathIdx(idx => (idx < paths.length - 1) ? idx + 1 : 0);
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
  }

  useEffect(() => {
    if (playMoves === 'onHover') {
      isHovered ? startMoving() : stopMoving();
    }

    // Clear the interval in cleanup
    return () => {
      if (moveInterval != undefined) {
        window.clearInterval(moveInterval);
      }
    }
  }, [isHovered]);

  const finalBoardSize = calcBoardSize() + 'px';

  return (
    <div
      className={classes.hoverDiv}
      onMouseEnter={() => (playMoves === 'onHover') ? setIsHovered(true) : void(0)}
      onMouseLeave={() => (playMoves === 'onHover') ? setIsHovered(false) : void(0)}
    >
      <Chessground
        width={finalBoardSize}
        height={finalBoardSize}
        coordinates={false}
        fen={boardPosition}
        orientation={orientation}
        viewOnly
      />
    </div>
  );
}

export default ChessTreePreview;
