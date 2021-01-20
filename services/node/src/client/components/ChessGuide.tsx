import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React, { useState, useEffect } from 'react';
import { Chess, ChessInstance, ShortMove, Square } from "chess.js";
import { ChessTree, ChessBoardMove, PieceColor } from '../../shared/chessTypes';
import { getUniquePaths } from '../../shared/chessTree';
import {
  areChessPathsEquivalent,
  areChessMovesEquivalent,
  partition,
  randomElem,
  getScoreFromFen,
  sameMoves,
} from '../../shared/utils';
import ChessMoveSelector from './ChessMoveSelector';
import Beeper from '../beeper';
import Modal from './Modal';
import MovesTable from './MovesTable';
import TabsPane from './TabsPane';
import ChessGuideBoard from './ChessGuideBoard';
import ChessGuideInfo from './ChessGuideInfo';
import ChessGuideControls from './ChessGuideControls';
import { GuideMode } from '../utils/types';

const COMPUTER_THINK_TIME = 500;

const SHOW_NEXT_MOVE_DELAY = 1000;

const SHOW_DEBUG_BTN = false;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '920px',
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
    width: 'fit-content',
  },
  chessGuideInfo: {
    marginTop: '0rem',
  },
  chessGuideBoardDiv: {
    padding: '14px',
    paddingRight: 0,
    backgroundColor: theme.palette.background.default,
    borderRadius: '5px',
  }
}));

interface Props {
  chessTree: ChessTree;
  // if 'alwaysAutoplay' set to true, always autoplay the computer's moves, even when the
  // step forward button is clicked.
  alwaysAutoplay?: boolean;
  userPlaysAs?: PieceColor;
  guideMode?: GuideMode;
  renderExtraControlsForTesting?: boolean
}

type PathStats = {
  mode: GuideMode,
  path: string[],
  timesCompleted: number,
}

const ChessGuide: React.FunctionComponent<Props> = ({
  chessTree,
  alwaysAutoplay,
  userPlaysAs = 'white',
  guideMode,
  renderExtraControlsForTesting,
}) => {
  const classes = useStyles({});

  const paths = getUniquePaths(chessTree);

  if (userPlaysAs == undefined) {
    userPlaysAs = 'white';
  }

  const [beeper] = useState(new Beeper({ frequency: 115 }));

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mode, setMode] =
    useState<GuideMode>(guideMode == undefined ? 'learn' : guideMode);

  const [playedMoves, setPlayedMoves] = useState<string[]>([]);

  const [doesComputerAutoplay, setDoesComputerAutoplay] = useState<boolean>(true);

  const isUsersTurn = (): boolean => {
    return game.turn() === userPlaysAs.charAt(0);
  }

  // Initialize all possible 'pathsCompletedThisSession' values with their
  // 'timesCompleted' values set to zero.
  const makeInitialPathsCompletedThisSession = (): PathStats[] => {
    return paths.reduce((acc: PathStats[], path) => {
      const practicePath: PathStats = {
        mode: 'practice',
        path,
        timesCompleted: 0,
      };
      const learnPath: PathStats = {
        mode: 'learn',
        path,
        timesCompleted: 0,
      };
      return [...acc, practicePath, learnPath];
    }, [])
  }

  const [pathsCompletedThisSession, setPathsCompletedThisSession] =
    useState<PathStats[]>(makeInitialPathsCompletedThisSession);

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

  useEffect(() => {
    reset();
    setPathsCompletedThisSession(makeInitialPathsCompletedThisSession());
  }, [chessTree, userPlaysAs]);

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
      return playedMoves.every((move, idx) => areChessMovesEquivalent(move, path[idx]));
    });
  }

  const [isShowingMoves, setIsShowingMoves] = useState<boolean>(false);

  const onMove = (startSquare: Square, endSquare: Square): void => {
    const shortMove: ShortMove = {
      from: startSquare,
      to: endSquare,
    };
    const nextMoveGames = getNextMoveGames().filter((game) => {
      const history = game.history({verbose: true});
      return sameMoves(history[history.length - 1], shortMove);
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
  }

  // TODO: remove this function when the old Chessboard component can be thrown out
  const handleMove = (move: ChessBoardMove) => {
    // If the user picks up and drops a piece back at its sourceSquare, do nothing.
    if (move.sourceSquare === move.targetSquare) return;
    const shortMove: ShortMove = {
      from: move.sourceSquare,
      to: move.targetSquare,
      promotion: 'q',
    };
    const nextMoveGames = getNextMoveGames().filter((game) => {
      const history = game.history({verbose: true});
      return sameMoves(history[history.length - 1], shortMove);
    });
    if (nextMoveGames.length > 0) {
      // If the user presses either of the arrow buttons, then `doesComputerAutoplay`
      // will be turned off. When the user plays by moving a piece on the board, make sure
      // that `doesComputerAutoplay` is turned back on.
      setDoesComputerAutoplay(true);
      const history = nextMoveGames[0].history();
      const nextMove = history[history.length - 1];
      doNextMove(nextMove);
    } else {
      // If the user plays a move that is not in the ChessTree, beep at them
      beeper.beep(2);
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

  const jumpToEndOrNextTreeFork = () => {
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

  const scheduleShowMoves = (shouldForceShow?: boolean) => {
    if (mode === 'learn' || shouldForceShow) {
      setTimeout(() => {
        setIsShowingMoves(true);
      }, SHOW_NEXT_MOVE_DELAY);
    }
  }

  const doComputerTurn = () => {
    const moves = getNextMoves();
    if (moves.length === 1 && doesComputerAutoplay) {
      // Do not highlight moves while the computer is playing
      setIsShowingMoves(false);

      setTimeout(() => {
        doNextMove(moves[0]);
      }, COMPUTER_THINK_TIME);
    } else if (moves.length > 1) {
      // If there is more than one move that the computer can play, the computer randomly
      // selects a move from among the moves that are on paths that have been completed
      // the fewest number of the times.
      const move = randomElem(getMovesThatLeadToLeastCompletedPaths());
      if (move == undefined) {
        throw new Error("No moves returned by getMovesThatLeadToLeastCompletedPaths()");
      }
      setTimeout(() => {
        doNextMove(move);
      }, COMPUTER_THINK_TIME);
    }
  }

  const isAtPathEnd = (): boolean =>
    paths.some(path => areChessPathsEquivalent(path, playedMoves));

  const getMovesThatLeadToLeastCompletedPaths = (): string[] => {
    // Get the paths that are reachable from the current position forward.
    const relevantPaths = pathsCompletedThisSession.filter(p => {
      return (
        p.mode == mode
        && playedMoves.every((move, idx) => areChessMovesEquivalent(move, p.path[idx]))
      );
    });
    const lowestTimesCompleted = Math.min(...relevantPaths.map(p => p.timesCompleted));
    const leastCompletedPaths =
      relevantPaths.filter(p => p.timesCompleted === lowestTimesCompleted);
    return leastCompletedPaths.map(p => p.path[playedMoves.length]);
  }

  const recordPathCompletion = () => {
    const [matchingPaths, nonMatchingPaths] = partition(
      pathsCompletedThisSession,
      (p) => areChessPathsEquivalent(p.path, playedMoves) && p.mode === mode
    );
    if (matchingPaths.length !== 1) {
      throw new Error(`Unexpected number of matchingPaths: ${matchingPaths.length}`);
    } else {
      const updatedPathStats: PathStats = {
        ...matchingPaths[0],
        timesCompleted: matchingPaths[0].timesCompleted + 1,
      }
      setPathsCompletedThisSession([...nonMatchingPaths, updatedPathStats]);
    }
  }

  // Whenever `playedMoves` changes
  useEffect(() => {
    if (isAtPathEnd()) {
      recordPathCompletion();
      setIsModalOpen(true);
    }

    setIsShowingMoves(false);

    if (isUsersTurn()) {
      scheduleShowMoves();
    } else {
      doComputerTurn();
    }
  }, [playedMoves]);

  const getNumPathsCompleted = (): number => {
    return pathsCompletedThisSession.reduce((acc: number, p) => {
      if (p.mode === mode && p.timesCompleted > 0) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
  }

  const toggleGuideMode = () => {
    mode === 'learn' ? setMode('practice') : setMode('learn');
    reset();
  }

  const debug = () => {
    console.log('You pressed the debug button');
  }

  return (
    <div className={classes.root}>
      <Grid container direction='row' justify='space-between' spacing={2}>
        <Grid item lg={9}>
          <div className={classes.chessGuideBoardDiv}>
            <ChessGuideBoard
              playedMoves={playedMoves}
              boardPosition={fen}
              orientation={userPlaysAs}
              isUsersTurn={isUsersTurn()}
              handleMove={handleMove}
              onMove={onMove}
              onDragOverSquare={() => beeper.resume()}
              arePiecesDraggable={getNextMoves().length > 0}
              nextMoves={getNextMoves()}
              shouldShowNextMoves={isShowingMoves}
            />
          </div>
          <div className={classes.chessGuideInfo}>
            <ChessGuideInfo
              numPaths={paths.length}
              numPathsCompleted={getNumPathsCompleted()}
              currentGuideMode={mode}
              score={getScoreFromFen(game.fen())}
            />
          </div>
          <ChessGuideControls
            areBackBtnsEnabled={playedMoves.length === 0}
            areForwardBtnsEnabled={getNextMoves().length !== 1}
            onJumpBackBtnClick={reset}
            onJumpForwardBtnClick={jumpToEndOrNextTreeFork}
            onStepBackBtnClick={moveBack}
            onStepForwardBtnClick={moveForward}
            onResetBtnClick={reset}
            onModeSwitchBtnClick={toggleGuideMode}
            currentMode={mode}
          />
        </Grid>
        <Grid item lg={3}>
          <TabsPane
            tabs={
              [
                {
                  name: 'Moves',
                  content: <MovesTable moves={playedMoves} />
                },
              ]
            }

          />
        </Grid>
      </Grid>

      {SHOW_DEBUG_BTN &&
        <Button
          variant="contained"
          color="primary"
          onClick={debug}
        >
          Debug
        </Button>
      }

      <Modal
        isModalOpenOrOpening={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        delayOpenFor={500}
      >
        <h3>Path Complete!</h3>
        <p>{getNumPathsCompleted()} of {paths.length} paths complete</p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            reset();
            setIsModalOpen(false);
          }}
        >
          Reset Game to Complete Next Path
        </Button>
      </Modal>

      {renderExtraControlsForTesting &&
        <ChessMoveSelector
          nextMoveGames={getNextMoveGames()}
          handleSubmit={handleMove}
        />
      }
    </div>
  );
}

export default ChessGuide;
