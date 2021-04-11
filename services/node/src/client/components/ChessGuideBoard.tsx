import React, { useState, useEffect } from 'react';
import { ShortMove, Square } from 'chess.js';
import { PieceColor } from '../../shared/chessTypes';
import { makeStyles } from '@material-ui/core';
import { GuideMode } from '../utils/types';
import Chessground from 'react-chessground';
import ColorFlashOverlay from './ColorFlashOverlay';
import CheckmateOverlay from './CheckmateOverlay';
import DisablerOverlay from './DisablerOverlay';
import { DrawableProp, ChessboardArrow, BrushColor } from '../utils/types';

export const BOARD_ANIMATION_DURATION = 200;

const useStyles = makeStyles({
  chessGuideBoardWrapper: {
    position: 'relative',
    width: (props: Props) => props.size,
    height: (props: Props) => props.size,
  },
});

interface Props {
  size: string;
  boardPosition: string;
  turnColor: string;
  onMove: (startSquare: Square, endSquare: Square) => void;
  movable: Record<string, unknown>;
  getNextShortMoves: () => ShortMove[];
  shouldShowNextMoves: boolean;
  inCheck: boolean;
  inCheckmate: boolean;
  wrongMoveFlashIdx: number;
  updateDrawableIdx: number;
  doesMoveLeadToDeadEnd: (move: string | ShortMove) => boolean;
  highlightedSquares: string[];
  guideMode: GuideMode;
  isUsersTurn: () => boolean;
  onMouseDown?: () => void;
  orientation?: PieceColor;
  disabled?: boolean;
}

const ChessGuideBoard: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);

  const makeChessboardArrows = (): ChessboardArrow[] => {
    if (!props.shouldShowNextMoves) return [];
    const result: ChessboardArrow[] = [];
    const nextShortMoves = props.getNextShortMoves();
    if (nextShortMoves.length > 0) {
      nextShortMoves.forEach((shortMove) => {
        // In practice mode, don't show the user arrows for their own moves if they
        // haven't completed that line yet. Once that line has been completed, show
        // the arrow next time so the user knows that they've already played that move.
        if (
          props.guideMode === 'practice' &&
          props.isUsersTurn() &&
          !props.doesMoveLeadToDeadEnd(shortMove)
        ) {
          // don't include the move arrow
          return;
        }
        result.push({
          orig: shortMove.from,
          dest: shortMove.to,
          brush: props.doesMoveLeadToDeadEnd(shortMove)
            ? BrushColor.YELLOW
            : BrushColor.GREEN,
        });
      });
    }
    return result;
  };

  const makeDrawableProp = (): DrawableProp => {
    return {
      enabled: true,
      visible: props.shouldShowNextMoves,
      eraseOnClick: false,
      defaultSnapToValidMove: true,
      autoShapes: makeChessboardArrows(),
    };
  };

  const [drawableProp, setDrawableProp] = useState<DrawableProp>(makeDrawableProp());

  useEffect(() => {
    setDrawableProp(makeDrawableProp());
  }, [props.updateDrawableIdx]);

  return (
    <div
      className={classes.chessGuideBoardWrapper}
      onMouseDown={props.onMouseDown ? props.onMouseDown : () => Function.prototype()}
    >
      <DisablerOverlay
        width={props.size}
        height={props.size}
        isDisabling={Boolean(props.disabled)}
        disabledCursor='default'
      />
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
        key={String(drawableProp.visible) /* rerender when `drawable.visible` changes */}
        width={props.size}
        lastMove={props.highlightedSquares}
        height={props.size}
        turnColor={props.turnColor}
        fen={props.boardPosition}
        orientation={props.orientation}
        drawable={drawableProp as any}
        onMove={props.onMove}
        movable={props.movable}
        resizable={true}
        animation={{
          enabled: true,
          duration: BOARD_ANIMATION_DURATION,
        }}
        highlight={{
          check: true,
          lastMove: true,
        }}
        check={props.inCheck}
      />
    </div>
  );
};

export default ChessGuideBoard;
