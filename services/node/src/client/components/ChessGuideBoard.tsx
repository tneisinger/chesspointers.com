import React from 'react';
import Chessboard from "chessboardjsx";
import { Chess, ChessInstance, ShortMove, Square } from "chess.js";
import { ChessBoardMove, PieceColor } from '../../shared/chessTypes';
import ChessBoard from '../components/ChessBoard';
import { Dests } from 'chessground/types';

const MOVE_HIGHLIGHT_STYLE = 'inset 0 0 2px 4px';
const USER_MOVE_HIGHLIGHT_COLOR = 'orange';
const COMPUTER_MOVE_HIGHLIGHT_COLOR = 'purple';

export const USER_HIGHLIGHT_SQUARE_STYLE =
  `${MOVE_HIGHLIGHT_STYLE} ${USER_MOVE_HIGHLIGHT_COLOR}`;
export const COMPUTER_HIGHLIGHT_SQUARE_STYLE =
  `${MOVE_HIGHLIGHT_STYLE} ${COMPUTER_MOVE_HIGHLIGHT_COLOR}`;

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
  playedMoves: string[];
  boardPosition: string;
  orientation?: PieceColor;
  isUsersTurn: boolean;
  handleMove: (move: ChessBoardMove) => void;
  onMove: (startSquare: Square, endSquare: Square) => void;
  onDragOverSquare: (square: string) => void;
  arePiecesDraggable: boolean;
  nextMoves: string[];
  shouldShowNextMoves: boolean;
}

const ChessGuideBoard: React.FunctionComponent<Props> = ({
  playedMoves,
  boardPosition,
  orientation = 'white',
  isUsersTurn,
  onMove,
  arePiecesDraggable,
  nextMoves,
  shouldShowNextMoves,
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
    const result: ChessboardArrow[] = [];
    const nextMoves = getNextShortMoves();
    if (shouldShowNextMoves && nextMoves.length > 0) {
      nextMoves.forEach(({from , to}) => {
        result.push({
          orig: from,
          dest: to,
          brush: isUsersTurn ? BrushColor.GREEN : BrushColor.RED,
        });
      });
    }
    return result;
  }

  const makeDrawableProp = () => {
    return {
      enabled: true,
      visible: true,
      eraseOnClick: false,
      defaultSnapToValidMove: true,
      autoShapes: makeChessboardArrows(),
    }
  }

  const makeDests = (): Dests => {
    const dests = new Map();
    const shortMoves = getNextShortMoves()
    shortMoves.forEach(({ from, to }) => {
      if (dests.has(from)) {
        dests.set(from, [...dests.get(from), to]);
      } else {
        dests.set(from, [to]);
      }
    });
    return dests;
  }

  return (
    <ChessBoard
      key={String(shouldShowNextMoves) /* rerender on 'shouldShowNextMoves' changes */ }
      width="36vw"
      height="36vw"
      fen={boardPosition}
      drawable={makeDrawableProp()}
      onMove={onMove}
      movable={{ free: false, showDests: false, dests: makeDests() }}
      animation={{ duration: 250 }}
    />
  );
}

export default ChessGuideBoard;
