import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React, { useState, useEffect } from 'react';
import Chessboard from "chessboardjsx";
import { Chess, ChessInstance, ShortMove } from "chess.js";
import { ChessTree } from '../../shared/chessTypes';
import { getUniquePaths } from '../../shared/chessTree';
import { arraysEqual } from '../../shared/utils';
import ChessNavBtns from './ChessNavBtns';

const COMPUTER_THINK_TIME = 500;

const SHOW_NEXT_MOVE_DELAY = 1000;

const MOVE_HIGHLIGHT_STYLE = 'inset 0 0 2px 4px';
const USER_MOVE_HIGHLIGHT_COLOR = 'orange';
const COMPUTER_MOVE_HIGHLIGHT_COLOR = 'purple';

export const USER_HIGHLIGHT_SQUARE_STYLE =
  `${MOVE_HIGHLIGHT_STYLE} ${USER_MOVE_HIGHLIGHT_COLOR}`;
export const COMPUTER_HIGHLIGHT_SQUARE_STYLE =
  `${MOVE_HIGHLIGHT_STYLE} ${COMPUTER_MOVE_HIGHLIGHT_COLOR}`;

const useStyles = makeStyles(() => ({
  mainCard: {
    padding: '0 40px',
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
  chessTree: ChessTree;

  // if set to true, always autoplay the computer's moves, even when the step forward
  // button is clicked.
  alwaysAutoplay?: boolean;
  userPlaysAs?: ('white' | 'black');
}

const ChessGuide: React.FunctionComponent<Props> = ({
  chessTree,
  alwaysAutoplay,
  userPlaysAs,
}) => {
  const classes = useStyles({});

  const paths = getUniquePaths(chessTree);

  const [userColor] = useState<'white' | 'black'>(
    (userPlaysAs == undefined) ? 'white' : userPlaysAs
  );

  const [playedMoves, setPlayedMoves] = useState<string[]>([]);

  const [doesComputerAutoplay, setDoesComputerAutoplay] = useState<boolean>(true);

  const isUsersTurn = (): boolean => {
    return game.turn() === userColor.charAt(0);
  }

  const isAtPathEnd = (): boolean => {
    return relevantPaths().every((path) => playedMoves.length >= path.length);
  }

  // The state of the game as it is on the board
  const [game] = useState<ChessInstance>(new Chess());

  // Determines the layout of the pieces on the board
  const [fen, setFen] = useState(game.fen());

  // Use this function to set the fen variable, which will update the board position.
  const updateBoard = () => setFen(game.fen());

  const getNextMoveGames = (): ChessInstance[] => {
    const games: ChessInstance[] = [];
    getNextMoves().forEach((move) => {
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

  useEffect(() => {
    reset();
  }, []);

  const getNextMoves = (): string[] => {
    const result: string[] = [];
    relevantPaths().forEach((path) => {
      const nextMove = path[playedMoves.length];
      if (nextMove != undefined && !result.includes(nextMove)) {
        result.push(nextMove);
      }
    });
    return result;
  }

  const relevantPaths = (): string[][] => {
    return paths.filter((path) => {
      return arraysEqual(path.slice(0, playedMoves.length), playedMoves);
    });
  }

  const getNextShortMoves = (): ShortMove[] => {
    return getNextMoveGames().map((game) => {
      const history = game.history({verbose: true});
      if (history.length < 1) {
        throw new Error('nextMoveGames must have at least one move in their history');
      }
      return history[history.length - 1];
    });
  }

  const [isShowingMoves, setIsShowingMoves] = useState<boolean>(false);

  const showMoves = () => {
    const result = {};
    const moveHighlights: Object[] = [];
    const nextMoves = getNextShortMoves();
    if (isShowingMoves && nextMoves.length > 0) {
      const style = isUsersTurn() ? USER_HIGHLIGHT_SQUARE_STYLE
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

  const sameMoves = (move1: ShortMove, move2: ShortMove): boolean => (
    move1.from === move2.from && move1.to === move2.to
  );

  const handleMove = (move: ShortMove) => {
    const nextMoveGames = getNextMoveGames().filter((game) => {
      const history = game.history({verbose: true});
      return sameMoves(history[history.length - 1], move);
    });
    if (nextMoveGames.length > 0) {
      // If the user presses either of the arrow buttons, then `doesComputerAutoplay`
      // will be turned off. When the user plays by moving a piece on the board, make sure
      // that `doesComputerAutoplay` is turned back on.
      setDoesComputerAutoplay(true);
      const history = nextMoveGames[0].history();
      const nextMove = history[history.length - 1];
      doNextMove(nextMove);
    }
  };

  const doNextMove = (move: string) => {
    if (game.move(move)) {
      setPlayedMoves([...playedMoves, move]);
      updateBoard();
    }
  };

  const reset = () => {
    setPlayedMoves([]);
    setDoesComputerAutoplay(true);
    game.reset();
    updateBoard();
    setIsShowingMoves(false);
  };

  const moveBack = () => {
    // When the user clicks the back button, turn off doesComputerAutoplay
    setDoesComputerAutoplay(false);
    setPlayedMoves(playedMoves.slice(0,-1));
    game.undo();
    updateBoard();
  }

  const moveForward = () => {
    // Unless the `alwaysAutoplay` prop is set to true, whenever the user clicks
    // the forward button, turn off doesComputerAutoplay
    if (alwaysAutoplay != undefined) {
      setDoesComputerAutoplay(alwaysAutoplay);
    } else {
      setDoesComputerAutoplay(false);
    }
    const nextMoves = getNextMoves();
    if (nextMoves.length === 1) {
      doNextMove(nextMoves[0]);
    }
  }

  const jumpToEndOrNextBranch = () => {
    const movesToPlay: string[] = [];
    const forwardPaths: string[][] = relevantPaths().map(
      (path) => (path.slice(playedMoves.length))
    );
    const shortestPathLen = Math.min(...forwardPaths.map((p) => p.length));

    let moveIdx = 0;
    let branchesMatchSoFar = true;
    do {
      const moves = forwardPaths.map((p) => p[moveIdx]);
      if (moves.every((m) => m === moves[0])) {
        movesToPlay.push(moves[0]);
      } else {
        branchesMatchSoFar = false;
      }
      moveIdx++;
    } while (moveIdx < shortestPathLen && branchesMatchSoFar);

    if (movesToPlay.length > 0) {
      setIsShowingMoves(false);
      movesToPlay.forEach((move) => {
        game.move(move);
      });
      setPlayedMoves([...playedMoves, ...movesToPlay]);
      setFen(game.fen());
      scheduleShowMoves();
    }
  }

  const scheduleShowMoves = () => {
    setTimeout(() => {
      setIsShowingMoves(true);
    }, SHOW_NEXT_MOVE_DELAY);
  }

  const doComputerTurn = () => {
    const moves = getNextMoves();
    if (moves.length === 1 && doesComputerAutoplay) {
      // Do not highlight moves while the computer is playing
      setIsShowingMoves(false);

      setTimeout(() => {
        doNextMove(moves[0]);
      }, COMPUTER_THINK_TIME);
    } else {
      scheduleShowMoves();
    }
  }

  // Whenever `nextMoveIdx` changes
  useEffect(() => {
    setIsShowingMoves(false);

    if (isUsersTurn()) {
      scheduleShowMoves();
    } else {
      doComputerTurn();
    }
  }, [playedMoves]);

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
          squareStyles={showMoves()}
          orientation={userColor}
          onDrop={(move) =>
            handleMove({
              from: move.sourceSquare,
              to: move.targetSquare,
              promotion: 'q',
            })
          }
        />
      </div>
      <Grid
        className={classes.belowChessBoard}
        container
        direction='row'
        justify='center'
        spacing={2} >
        <ChessNavBtns
          atStart={playedMoves.length === 0}
          atEnd={getNextMoves().length !== 1}
          jumpToStart={reset}
          jumpToEnd={jumpToEndOrNextBranch}
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
