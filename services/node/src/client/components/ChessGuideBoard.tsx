import { makeStyles } from '@material-ui/core';
import React from 'react';
import Chessboard from "chessboardjsx";
import { Chess, ChessInstance, ShortMove } from "chess.js";
import { ChessBoardMove, PieceColor } from '../../shared/chessTypes';

const MOVE_HIGHLIGHT_STYLE = 'inset 0 0 2px 4px';
const USER_MOVE_HIGHLIGHT_COLOR = 'orange';
const COMPUTER_MOVE_HIGHLIGHT_COLOR = 'purple';

export const USER_HIGHLIGHT_SQUARE_STYLE =
  `${MOVE_HIGHLIGHT_STYLE} ${USER_MOVE_HIGHLIGHT_COLOR}`;
export const COMPUTER_HIGHLIGHT_SQUARE_STYLE =
  `${MOVE_HIGHLIGHT_STYLE} ${COMPUTER_MOVE_HIGHLIGHT_COLOR}`;

const useStyles = makeStyles(() => ({
  root: {
    background: 'radial-gradient(rgb(131, 86, 49) 70%, rgb(81, 36, 0))',
    padding: '18px',
    width: 'fit-content',
  }
}));

interface Props {
  playedMoves: string[];
  boardPosition: string;
  orientation?: PieceColor;
  isUsersTurn: boolean;
  handleMove: (move: ChessBoardMove) => any;
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
  handleMove,
  onDragOverSquare,
  arePiecesDraggable,
  nextMoves,
  shouldShowNextMoves,
}) => {
  const classes = useStyles({});

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

  const makeShowMovesSquareStyles = () => {
    const result = {};
    const moveHighlights: Object[] = [];
    const nextMoves = getNextShortMoves();
    if (shouldShowNextMoves && nextMoves.length > 0) {
      const style = isUsersTurn ? USER_HIGHLIGHT_SQUARE_STYLE
                                : COMPUTER_HIGHLIGHT_SQUARE_STYLE;
      const highlight = {
        boxShadow: style,
      };
      nextMoves.forEach(({from , to}) => {
        moveHighlights.push({[from]: highlight, [to]: highlight });
      });
    }
    Object.assign(result, ...moveHighlights);
    return result;
  }

  return (
    <div className={classes.root}>
      <Chessboard
        width={650}
        position={boardPosition}
        undo
        boardStyle={{
            margin: 'auto',
        }}
        squareStyles={makeShowMovesSquareStyles()}
        orientation={orientation}
        onDrop={handleMove}
        onDragOverSquare={onDragOverSquare}
        draggable={arePiecesDraggable}
      />
    </div>
  );
}

export default ChessGuideBoard;
