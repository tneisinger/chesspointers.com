import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import Chessground from 'react-chessground';
import { ChessTree, PieceColor } from '../../shared/chessTypes';
import { getUniquePaths } from '../../shared/chessTree';
import { Chess, ChessInstance } from "chess.js";
import { calcChessBoardSize, BoardSizeUnits } from '../utils';

const FEN_START_POS = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const useStyles = makeStyles({
  button: {
    margin: 0,
    padding: 0,
    border: 'none',
  }
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
  const classes = useStyles({});

  const [chess, setChess] = useState<ChessInstance>(new Chess());
  const [paths] = useState<string[][]>(getUniquePaths(chessTree));
  const [previewPos, setPreviewPos] = useState<string>(chess.fen());
  const [boardPosition, setBoardPosition] = useState<string>(chess.fen())
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [moveInterval, setMoveInterval] = useState<number | null>(null);
  const [currentPathIdx] = useState<number>(0);
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
    const newChess = new Chess();
    setChess(newChess);
    setBoardPosition(newChess.fen());
    setupMoveInterval(newChess);
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

  const setupMoveInterval = (newChess: ChessInstance) => {
    const interval = window.setInterval(() => {
      const path = paths[currentPathIdx];
      setPlayedMoves(currentPlayedMoves => {
        const nextMove = path[currentPlayedMoves.length];
        if (nextMove != undefined) {
          newChess.move(nextMove);
          setBoardPosition(newChess.fen());
          return [...currentPlayedMoves, nextMove];
        }
        return currentPlayedMoves;
      });
    }, msBetweenMoves);
    setMoveInterval(interval);
  }

  const calcBoardSize = (): number => {
    if (boardSizeUnits === 'px') return boardSize;
    return calcChessBoardSize(boardSize, boardSizeUnits);
  }

  useEffect(() => {
    isHovered ? startMoving() : stopMoving();

    // Clear the interval in cleanup
    return () => {
      if (moveInterval != undefined) {
        window.clearInterval(moveInterval);
      }
    }
  }, [isHovered]);

  const finalBoardSize = calcBoardSize() + 'px';

  return (
    <>
      <button
        className={classes.button}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Chessground
          width={finalBoardSize}
          height={finalBoardSize}
          coordinates={false}
          fen={boardPosition}
          orientation={orientation}
          viewOnly
        />
      </button>
    </>
  );
}

export default ChessTreePreview;
