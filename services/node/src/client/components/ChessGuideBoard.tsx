import React from 'react';
import { Chess, ChessInstance, ShortMove, Square } from "chess.js";
import { PieceColor } from '../../shared/chessTypes';
import Chessground from 'react-chessground';

enum BrushColor {
  GREEN  = 'green',
  RED    = 'red',
  BLUE   = 'blue',
  YELLOW = 'yellow',
}

interface ChessboardArrow {
  orig:  string;
  dest:  string;
  brush: BrushColor;
}

interface Props {
  size: string;
  playedMoves: string[];
  boardPosition: string;
  orientation?: PieceColor;
  isUsersTurn: boolean;
  turnColor: string;
  onMove: (startSquare: Square, endSquare: Square) => void;
  movable: Object;
  arePiecesDraggable: boolean;
  nextMoves: string[];
  shouldShowNextMoves: boolean;
  check: boolean;
}


const ChessGuideBoard: React.FunctionComponent<Props> = ({
  size,
  playedMoves,
  boardPosition,
  orientation = 'white',
  turnColor,
  onMove,
  movable,
  nextMoves,
  shouldShowNextMoves,
  check,
}) => {

  const makeNextMoveGames = (): ChessInstance[] => {
    const games: ChessInstance[] = [];
    nextMoves.forEach((move) => {
      const game = new Chess();
      [...playedMoves, move].forEach((m) => {
        if (!game.move(m)) {
          throw new Error(`invalid move: ${m}`);
        };
      });
      games.push(game);
    });
    return games;
  }

  const getNextShortMoves = (): ShortMove[] => {
    return makeNextMoveGames().map((game) => {
      const history = game.history({verbose: true});
      if (history.length < 1) {
        throw new Error('nextMoveGames must have at least one move in their history');
      }
      return history[history.length - 1];
    });
  }

  const makeChessboardArrows = (): ChessboardArrow[] => {
    if (!shouldShowNextMoves) return [];
    const result: ChessboardArrow[] = [];
    const nextMoves = getNextShortMoves();
    if (nextMoves.length > 0) {
      nextMoves.forEach(({from , to}) => {
        result.push({
          orig: from,
          dest: to,
          brush: BrushColor.GREEN,
        });
      });
    }
    return result;
  }

  const makeDrawableProp = () => {
    return {
      enabled: true,
      visible: shouldShowNextMoves,
      eraseOnClick: false,
      defaultSnapToValidMove: true,
      autoShapes: makeChessboardArrows(),
    }
  }

  const drawable = makeDrawableProp();

  return (
    <Chessground
      key={String(drawable.visible) /* rerender when `props.drawable.visible` changes */}
      width={size}
      height={size}
      turnColor={turnColor}
      fen={boardPosition}
      orientation={orientation}
      drawable={makeDrawableProp()}
      onMove={onMove}
      movable={movable}
      resizable={true}
      highlight={{
        check: true,
        lastMove: false,
      }}
      check={check}
    />
  );
}

export default ChessGuideBoard;
