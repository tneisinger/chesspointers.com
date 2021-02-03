import React from 'react';
import { Chess, ChessInstance, ShortMove, Square } from 'chess.js';
import { PieceColor } from '../../shared/chessTypes';
import { makeStyles } from '@material-ui/core';
import Chessground from 'react-chessground';
import ColorFlashOverlay from './ColorFlashOverlay';
import CheckmateOverlay from './CheckmateOverlay';

enum BrushColor {
  GREEN = 'green',
  RED = 'red',
  BLUE = 'blue',
  YELLOW = 'yellow',
}

const useStyles = makeStyles({
  chessGuideBoardWrapper: {
    position: 'relative',
    width: (props: Props) => props.size,
    height: (props: Props) => props.size,
  },
});

interface ChessboardArrow {
  orig: string;
  dest: string;
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
  movable: Record<string, unknown>;
  arePiecesDraggable: boolean;
  nextMoves: string[];
  shouldShowNextMoves: boolean;
  inCheck: boolean;
  inCheckmate: boolean;
  wrongMoveFlashIdx: number;
}

const ChessGuideBoard: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);

  const makeNextMoveGames = (): ChessInstance[] => {
    const games: ChessInstance[] = [];
    props.nextMoves.forEach((move) => {
      const game = new Chess();
      [...props.playedMoves, move].forEach((m) => {
        if (!game.move(m)) {
          throw new Error(`invalid move: ${m}`);
        }
      });
      games.push(game);
    });
    return games;
  };

  const getNextShortMoves = (): ShortMove[] => {
    return makeNextMoveGames().map((game) => {
      const history = game.history({ verbose: true });
      if (history.length < 1) {
        throw new Error('nextMoveGames must have at least one move in their history');
      }
      return history[history.length - 1];
    });
  };

  const makeChessboardArrows = (): ChessboardArrow[] => {
    if (!props.shouldShowNextMoves) return [];
    const result: ChessboardArrow[] = [];
    const nextMoves = getNextShortMoves();
    if (nextMoves.length > 0) {
      nextMoves.forEach(({ from, to }) => {
        result.push({
          orig: from,
          dest: to,
          brush: BrushColor.GREEN,
        });
      });
    }
    return result;
  };

  const makeDrawableProp = () => {
    return {
      enabled: true,
      visible: props.shouldShowNextMoves,
      eraseOnClick: false,
      defaultSnapToValidMove: true,
      autoShapes: makeChessboardArrows(),
    };
  };

  const drawable = makeDrawableProp();

  return (
    <div className={classes.chessGuideBoardWrapper}>
      <CheckmateOverlay
        inCheckmate={props.inCheckmate}
        width={props.size}
        height={props.size}
      />
      <ColorFlashOverlay
        flashIdx={props.wrongMoveFlashIdx}
        width={props.size}
        height={props.size}
        color='red'
      />
      <Chessground
        key={
          String(drawable.visible) /* rerender when `props.drawable.visible` changes */
        }
        width={props.size}
        height={props.size}
        turnColor={props.turnColor}
        fen={props.boardPosition}
        orientation={props.orientation}
        drawable={makeDrawableProp()}
        onMove={props.onMove}
        movable={props.movable}
        resizable={true}
        highlight={{
          check: true,
          lastMove: false,
        }}
        check={props.inCheck}
      />
    </div>
  );
};

export default ChessGuideBoard;
