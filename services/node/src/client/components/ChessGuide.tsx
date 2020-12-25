import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, { useState, useEffect } from 'react';
import Chessboard from "chessboardjsx";
import { Chess, ChessInstance, ShortMove } from "chess.js";
import { ChessSequence } from '../types/chess';
import ChessNavBtns from './ChessNavBtns';

const COMPUTER_THINK_TIME = 500;

const SHOW_NEXT_MOVE_DELAY = 1000;

const SHOW_NEW_COMMENT_DELAY = 1500;

const INITIAL_MESSAGE = "Welcome!";

export const HIGHLIGHTED_SQUARE_BOX_SHADOW = 'inset 0 0 2px 4px orange';

const useStyles = makeStyles(() => ({
  mainCard: {
    padding: '0 40px',
  },
  comment: {
    textAlign: 'center',
    marginTop: '16px',
    marginBottom: 0,
    paddingBottom: 0,
    height: '20px',
  },
  cardContent: {
    margin: 'auto',
  },
  cardHeader: {
    textAlign: 'center',
    paddingBottom: '0',
    marginBottom: '0',
  },
  belowChessBoard: {
    marginTop: '8px',
  },
  chessBoardDiv: {
    background: 'radial-gradient(rgb(131, 86, 49) 70%, rgb(81, 36, 0))',
    padding: '18px',
  }
}));

interface Props {
  chessSequence: ChessSequence

  // if set to true, always autoplay the computer's moves, even when the step forward
  // button is clicked.
  alwaysAutoplay?: boolean
}

const ChessGuide: React.FunctionComponent<Props> = ({
  chessSequence,
  alwaysAutoplay,
}) => {
  const classes = useStyles({});

  const [comment, setComment] = useState<string>(INITIAL_MESSAGE);

  const [userColor] = useState<'w' | 'b'>('w');

  // The index of the next moved to be played
  const [nextMoveIdx, setNextMoveIdx] = useState<number>(0);

  const [doesComputerAutoplay, setDoesComputerAutoplay] = useState<boolean>(true);

  const [shouldHideOutdatedComments, setShouldHideOutdatedComments] =
    useState<boolean>(false);

  const [commentUpdateTimeout, setCommentUpdateTimeout] =
    useState<number | undefined>(undefined);

  const isUsersTurn = (): boolean => {
    return game.turn() === userColor;
  }

  const haveAllMovesBeenPlayed = (): boolean => {
    return nextMoveIdx >= chessSequence.moves.length;
  }

  // The state of the game as it is on the board
  const [game] = useState<ChessInstance>(new Chess());

  // Determines the layout of the pieces on the board
  const [fen, setFen] = useState(game.fen());

  // Use this function to set the fen variable, which will update the board position.
  const updateBoard = () => setFen(game.fen());

  // The state of the game one move ahead. This is used to highlight the user's next
  // correct move, and/or to validate that the user's next move is the correct one.
  const [gameNextMove] = useState<ChessInstance>(new Chess());

  // Advance the gameNextMove state by one move, using the first move
  useEffect(() => {
    // gameNextMove.move(chessSequence.moves[0].move);
    reset();
  }, []);

  const getNextUserMove = (): (ShortMove | null) => {
    if (isUsersTurn()) {
      return gameNextMove.history({ verbose: true})[nextMoveIdx];
    }
    return null;
  }

  const [isShowingMove, setIsShowingMove] = useState<boolean>(false);

  const showMove = () => {
    const nextUserMove = getNextUserMove();
    if (isShowingMove && nextUserMove) {
      const { from, to } = nextUserMove
      const highlight = {
        boxShadow: HIGHLIGHTED_SQUARE_BOX_SHADOW,
      };
      return {
        [from]: highlight,
        [to]: highlight,
      };
    }
    return {};
  }

  const sameMoves = (move1: ShortMove, move2: ShortMove): boolean => (
    move1.from === move2.from && move1.to === move2.to
  );

  const handleMove = (move: ShortMove) => {
    const nextUserMove = getNextUserMove();
    if (nextUserMove && sameMoves(move, nextUserMove)) {
      // If the user presses either of the arrow buttons, then `doesComputerAutoplay`
      // will be turned off. When the user plays by moving a piece on the board, make sure
      // that `doesComputerAutoplay` is turned back on.
      setDoesComputerAutoplay(true);
      doNextMove();
    }
  };

  const doNextMove = () => {
    setShouldHideOutdatedComments(false);
    const nextMove = chessSequence.moves[nextMoveIdx];
    if (nextMove != undefined) {
      if (game.move(nextMove.move)) {
        advanceGameNextMove();
        setNextMoveIdx(nextMoveIdx + 1)
        updateBoard();
      }
    }
  };

  const advanceGameNextMove = () => {
    const nextMove = chessSequence.moves[gameNextMove.history().length];
    if (nextMove != undefined) {
      gameNextMove.move(nextMove.move);
    }
  };

  const reset = () => {
    setNextMoveIdx(0);
    game.reset();
    updateBoard();
    gameNextMove.reset();

    gameNextMove.move(chessSequence.moves[0].move);
    setIsShowingMove(false);
    setComment(INITIAL_MESSAGE);
  };

  const updateComment = (msg?: string) => {
    if (haveAllMovesBeenPlayed()) {
      scheduleCommentUpdate(chessSequence.finalComment);
      return;
    }
    scheduleCommentUpdate(msg);
  }

  const scheduleCommentUpdate = (msg?: string) => {
    if ( msg == undefined
         && getNextMove().comment == undefined
         && shouldHideOutdatedComments) {
      setComment("");
      window.clearTimeout(commentUpdateTimeout);
      return;
    }

    const timeout = window.setTimeout(() => {
      if (msg != undefined) {
        setComment(msg);
        return;
      }

      const nextMove = getNextMove();
      if (nextMove.comment != undefined) {
        setComment(nextMove.comment);
      }
    }, SHOW_NEW_COMMENT_DELAY);

    setCommentUpdateTimeout(timeout);
  }

  const getNextMove = () => chessSequence.moves[nextMoveIdx];

  const moveBack = () => {
    // When the user clicks the back button, turn off doesComputerAutoplay
    setDoesComputerAutoplay(false);

    setShouldHideOutdatedComments(true);

    // Normally, `gameNextMove` should stay one move ahead of `game`, but
    // if all the moves have been played, then `gameNextMove` will be in the
    // same state as `game`. Because of that, when the user presses the
    // back arrow button, we only want to undo a move from `gameNextMove` if
    // it is currently ahead of `game`.
    if (gameNextMove.history().length > game.history().length) {
      gameNextMove.undo();
    }

    game.undo();
    updateBoard();
    setNextMoveIdx(nextMoveIdx - 1);
  }

  const moveForward = () => {
    // Unless the `alwaysAutoplay` prop is set to true, whenever the user clicks
    // the forward button, turn off doesComputerAutoplay
    if (alwaysAutoplay != undefined) {
      setDoesComputerAutoplay(alwaysAutoplay);
    } else {
      setDoesComputerAutoplay(false);
    }
    doNextMove();
  }

  const jumpToEnd = () => {
    const remainingMoves = chessSequence.moves.slice(nextMoveIdx);
    remainingMoves.forEach(({ move }) => {
      game.move(move);
      advanceGameNextMove();
    });
    setNextMoveIdx(chessSequence.moves.length);
    setFen(game.fen());
  }

  // Whenever `nextMoveIdx` changes
  useEffect(() => {
    updateComment();
    if (isUsersTurn()) {
      setTimeout(() => {
        setIsShowingMove(true);
      }, SHOW_NEXT_MOVE_DELAY);

    } else {
      // Do not highlight moves while it is the computer's turn
      setIsShowingMove(false);

      // If the computer shouldn't play automatically, quit this function early.
      if (!doesComputerAutoplay) {
        return;
      }

      // The computer makes its move move after waiting a moment
      setTimeout(() => {
        doNextMove();
      }, COMPUTER_THINK_TIME);
    }
  }, [nextMoveIdx]);

  const debug = () => {
    console.log('You pressed the debug button');
  }


  return (
    <>
      <div className={classes.chessBoardDiv}>
        <Chessboard
          width={650}
          position={fen}
          undo
          boardStyle={{
              margin: 'auto',
          }}
          squareStyles={showMove()}
          onDrop={(move) =>
            handleMove({
              from: move.sourceSquare,
              to: move.targetSquare,
              promotion: 'q',
            })
          }
        />
      </div>
      <Typography className={classes.comment}>
        {comment}
      </Typography>
      <Grid
        className={classes.belowChessBoard}
        container
        direction='row'
        justify='center'
        spacing={2} >
        <ChessNavBtns
          atStart={nextMoveIdx === 0}
          atEnd={haveAllMovesBeenPlayed()}
          jumpToStart={reset}
          jumpToEnd={jumpToEnd}
          stepForward={moveForward}
          stepBack={moveBack}
        />
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={debug}
          >
            Debug
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default ChessGuide;
