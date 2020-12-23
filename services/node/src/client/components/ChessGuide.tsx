import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import React, { useState, useEffect } from 'react';
import Chessboard from "chessboardjsx";
import { Chess, ChessInstance, ShortMove } from "chess.js";
import { ChessSequence } from '../types/chess';

const COMPUTER_THINK_TIME = 500;

const SHOW_NEXT_MOVE_DELAY = 1000;

const SHOW_NEW_COMMENT_DELAY = 1500;

const INITIAL_MESSAGE = "Welcome!";

const useStyles = makeStyles(() => ({
  mainCard: {
    padding: '0 40px',
  },
  comment: {
    textAlign: 'center',
    marginTop: '16px',
    marginBottom: 0,
    paddingBottom: 0,
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
  arrowButton: {
    marginTop: '-10px',
  },
}));

interface Props {
  chessSequence: ChessSequence
}

const ChessGuide: React.FunctionComponent<Props> = ({
  chessSequence,
}) => {
  const classes = useStyles({});

  const [comment, setComment] = useState<string>(INITIAL_MESSAGE);

  const [userColor] = useState<'w' | 'b'>('w');

  // The index of the next moved to be played
  const [nextMoveIdx, setNextMoveIdx] = useState<number>(0);

  const [doesComputerAutoplay, setDoesComputerAutoplay] = useState<boolean>(true);

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
        boxShadow: 'inset 0 0 2px 4px orange',
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

  const incrementNextMoveIdx = () => setNextMoveIdx(nextMoveIdx + 1);

  const decrementNextMoveIdx = () => setNextMoveIdx(nextMoveIdx - 1);

  const doNextMove = () => {
    const nextMove = chessSequence.moves[nextMoveIdx];
    if (nextMove != undefined) {
      if (game.move(nextMove.move)) {
        advanceGameNextMove();
        incrementNextMoveIdx();
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
    setTimeout(() => {
      if (msg != undefined) {
        setComment(msg);
        return;
      }

      const nextMove = getNextMove();
      if (nextMove.comment != undefined) {
        setComment(nextMove.comment);
      }
    }, SHOW_NEW_COMMENT_DELAY);
  }

  const getNextMove = () => chessSequence.moves[nextMoveIdx];

  const moveBack = () => {
    // When the user clicks the back button, turn off doesComputerAutoplay
    setDoesComputerAutoplay(false);

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
    decrementNextMoveIdx();
  }

  const moveForward = () => {
    // When the user clicks the forward button, turn off doesComputerAutoplay
    setDoesComputerAutoplay(false);
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
      <Chessboard
        width={650}
        position={fen}
        undo
        boardStyle={{margin: 'auto', marginBottom: '12px'}}
        squareStyles={showMove()}
        onDrop={(move) =>
          handleMove({
            from: move.sourceSquare,
            to: move.targetSquare,
            promotion: 'q',
          })
        }
      />
      <Typography className={classes.comment}>
        {comment}
      </Typography>
      <Grid
        className={classes.belowChessBoard}
        container
        direction='row'
        justify='center'
        spacing={2} >
        <Grid item>
          <IconButton
            className={classes.arrowButton}
            aria-label="jump to start"
            onClick={reset}
            disabled={nextMoveIdx === 0}
          >
            <SkipPreviousIcon />
          </IconButton>
          <IconButton
            className={classes.arrowButton}
            aria-label="back"
            onClick={moveBack}
            disabled={nextMoveIdx === 0}
          >
            <ArrowLeftIcon fontSize='large'/>
          </IconButton>
          <IconButton
            className={classes.arrowButton}
            aria-label="forward"
            onClick={moveForward}
            disabled={haveAllMovesBeenPlayed()}
          >
            <ArrowRightIcon fontSize='large' />
          </IconButton>
          <IconButton
            className={classes.arrowButton}
            aria-label="jump to end"
            onClick={jumpToEnd}
            disabled={haveAllMovesBeenPlayed()}
          >
            <SkipNextIcon />
          </IconButton>
        </Grid>
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
