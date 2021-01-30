import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React, { useState, useEffect } from 'react';
import { Chess, ChessInstance, Square } from 'chess.js';
import { ChessTree, PieceColor } from '../../shared/chessTypes';
import { getUniquePaths } from '../../shared/chessTree';
import {
  areChessPathsEquivalent,
  areChessMovesEquivalent,
  partition,
  randomElem,
  getScoreFromFen,
} from '../../shared/utils';
import ChessMoveSelector from './ChessMoveSelector';
import Beeper from '../beeper';
import Modal from './Modal';
import ChessGuideBoard from './ChessGuideBoard';
import ChessGuideInfo from './ChessGuideInfo';
import ChessGuideControls from './ChessGuideControls';
import { GuideMode } from '../utils/types';

const COMPUTER_THINK_TIME = 250;
const CHECK_MOVE_DELAY = 250;
const SHOW_NEXT_MOVE_DELAY = 500;
const SHOW_DEBUG_BTN = false;
const BEEPER_FREQUENCY = 73;

const useStyles = makeStyles((theme) => ({
  belowChessBoard: {
    marginTop: '8px',
  },
  chessGuideInfo: {
    marginTop: '0rem',
  },
  boardBorderDiv: {
    display: 'inline-block',
    padding: '13px',
    backgroundColor: theme.palette.background.default,
    borderRadius: '5px',
  },
}));

interface Props {
  chessTree: ChessTree;
  boardSizePixels: number;
  // if 'alwaysAutoplay' set to true, always autoplay the computer's moves, even when the
  // step forward button is clicked.
  alwaysAutoplay?: boolean;
  userPlaysAs?: PieceColor;
  guideMode?: GuideMode;
  renderExtraControlsForTesting?: boolean;
}

type PathStats = {
  mode: GuideMode;
  path: string[];
  timesCompleted: number;
};

const ChessGuide: React.FunctionComponent<Props> = ({
  chessTree,
  boardSizePixels,
  alwaysAutoplay = false,
  userPlaysAs = 'white',
  guideMode = 'learn',
  renderExtraControlsForTesting = false,
  ...props
}) => {
  const classes = useStyles({});

  const paths = getUniquePaths(chessTree);

  const [beeper, setBeeper] = useState<Beeper | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<GuideMode>(guideMode);
  const [doesComputerAutoplay, setDoesComputerAutoplay] = useState<boolean>(true);
  const [pathsCompleted, setPathsCompleted] = useState<PathStats[]>([]);
  const [game] = useState<ChessInstance>(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [checkMoveTimeout, setCheckMoveTimeout] = useState<number | undefined>(undefined);
  const [wrongMoveFlashIdx, setWrongMoveFlashIdx] = useState<number>(0);
  const [isShowingMoves, setIsShowingMoves] = useState<boolean>(false);
  const [isDetached, setIsDetached] = useState<boolean>(false);
  const [playedMoves, setPlayedMoves] = useState<string[]>([]);
  const [movesPosition, setMovesPosition] = useState<number>(0);

  // Whenever `movesPosition` changes...
  useEffect(() => {
    // Reset the board to the specified position
    game.reset();
    for (let i = 0; i < movesPosition; i++) {
      game.move(playedMoves[i]);
    }
    window.setTimeout(() => updateBoard(), 350);

    if (movesPosition < playedMoves.length) {
      // If the new `movesPosition` is not at the end of the `playedMoves` array,
      // hide any move arrows and declare that the board `isDetached`.
      if (isShowingMoves) scheduleHideMoves({ delay: 200 });
      setIsDetached(true);
    } else if (isDetached) {
      // If `movesPosition` has been set to the end of `playedMoves` and `isDetached` is
      // currently set to true, then that means that we are coming out of the detached
      // state. In that case, set `isDetached` to false and schedule to show move arrows.
      scheduleShowMoves({ delay: 600 });
      setIsDetached(false);
    }
  }, [movesPosition]);

  const isUsersTurn = (): boolean => {
    return game.turn() === userPlaysAs.charAt(0);
  };

  const clearTimeouts = () => {
    window.clearTimeout(checkMoveTimeout);
    setCheckMoveTimeout(undefined);
  };

  // Initialize all possible 'pathsCompleted' values with their 'timesCompleted' values
  // set to zero.
  const makeInitialPathsCompletedValue = (): PathStats[] => {
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
    }, []);
  };

  // Use this function to set the fen variable, which will update the board position.
  const updateBoard = () => setFen(game.fen());

  const getNextMoveGames = (): ChessInstance[] => {
    const games: ChessInstance[] = [];
    getNextMoves().forEach((move) => {
      const game = new Chess();
      [...playedMoves, move].forEach((m) => {
        if (!game.move(m)) {
          throw new Error(`invalid move: ${m}`);
        }
      });
      games.push(game);
    });
    return games;
  };

  useEffect(() => {
    reset();
    setPathsCompleted(makeInitialPathsCompletedValue());
  }, []);

  useEffect(() => {
    reset();
    setPathsCompleted(makeInitialPathsCompletedValue());
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
  };

  const relevantPaths = (): string[][] => {
    return paths.filter((path) => {
      return playedMoves.every((move, idx) => areChessMovesEquivalent(move, path[idx]));
    });
  };

  const handleMove = (from: Square, to: Square) => {
    const moves = game.moves({ verbose: true });
    for (let i = 0, len = moves.length; i < len; i++) { /* eslint-disable-line */
      if (moves[i].flags.indexOf('p') !== -1 && moves[i].from === from) {
        // setPendingMove([from, to])
        // setSelectVisible(true)
        return;
      }
    }
    if (game.move({ from, to })) {
      updateBoard();
      let nextAction: () => void;
      if (wasLastMoveBad()) {
        nextAction = rectifyBadMove;
      } else {
        setIsShowingMoves(false);
        nextAction = handleGoodMove;
      }
      setCheckMoveTimeout(window.setTimeout(nextAction, CHECK_MOVE_DELAY));
      // setLastMove([from, to])
    }
  };

  const handleGoodMove = () => {
    addMoveToPlayedMoves();
  };

  const addMoveToPlayedMoves = (move?: string): void => {
    if (move == undefined) {
      move = getLastMove();
    }
    const newPlayedMoves = [...playedMoves, move];
    setPlayedMoves(newPlayedMoves);
    setMovesPosition(newPlayedMoves.length);
  };

  const wasLastMoveBad = () => {
    return !getNextMoves().includes(getLastMove());
  };

  const rectifyBadMove = () => {
    if (beeper == undefined) {
      defineBeeper().beep(2);
    } else {
      beeper.beep(2);
    }
    triggerWrongMoveBoardFlash();
    undoMove();
    scheduleShowMoves({ delay: 500 });
  };

  const undoMove = () => {
    game.undo();
    setFen(game.fen());
  };

  const getLastMove = () => {
    const history = game.history();
    return history[history.length - 1];
  };

  const calcMovable = () => {
    const dests = new Map();
    game.SQUARES.forEach((s) => {
      const ms = game.moves({ square: s, verbose: true });
      if (ms.length)
        dests.set(
          s,
          ms.map((m) => m.to),
        );
    });
    return {
      free: false,
      dests,
      showDests: mode === 'practice',
      color: userPlaysAs,
      events: { after: afterMove },
    };
  };

  const defineBeeper = (): Beeper => {
    const newBeeper = new Beeper({ frequency: BEEPER_FREQUENCY });
    setBeeper(newBeeper);
    return newBeeper;
  };

  const afterMove = (): void => {
    if (beeper == undefined) {
      defineBeeper();
    } else {
      beeper.resume();
    }
  };

  const turnColor = () => {
    return game.turn() === 'w' ? 'white' : 'black';
  };

  const doNextMove = (move: string) => {
    if (game.move(move)) {
      updateBoard();
      window.setTimeout(() => addMoveToPlayedMoves(move), 350);
    }
  };

  const reset = () => {
    setPlayedMoves([]);
    setIsDetached(false);
    setMovesPosition(0);
    setDoesComputerAutoplay(true);
    game.reset();
    updateBoard();
    setIsShowingMoves(false);
  };

  const moveBack = () => {
    setMovesPosition((idx) => (idx > 0 ? idx - 1 : idx));
  };

  const moveForward = () => {
    setMovesPosition((idx) => (idx < playedMoves.length ? idx + 1 : idx));
  };

  const jumpToEndOfPlayedMoves = () => {
    setMovesPosition(playedMoves.length);
  };

  const jumpToStartOfPlayedMoves = () => {
    setMovesPosition(0);
  };

  const scheduleShowMoves = (options: { forceShow?: boolean; delay?: number } = {}) => {
    const delay = options.delay == undefined ? SHOW_NEXT_MOVE_DELAY : options.delay;
    if (mode === 'learn' || options.forceShow) {
      setTimeout(() => {
        setIsShowingMoves(true);
      }, delay);
    }
  };

  const scheduleHideMoves = (options = { delay: SHOW_NEXT_MOVE_DELAY }) => {
    setTimeout(() => {
      setIsShowingMoves(false);
    }, options.delay);
  };

  const doComputerMove = () => {
    const moves = getNextMoves();
    if (moves.length === 1 && doesComputerAutoplay) {
      setTimeout(() => {
        doNextMove(moves[0]);
      }, COMPUTER_THINK_TIME);
    } else if (moves.length > 1) {
      // If there is more than one move that the computer can play, the computer randomly
      // selects a move from among the moves that are on paths that have been completed
      // the fewest number of the times.
      const move = randomElem(getMovesThatLeadToLeastCompletedPaths());
      if (move == undefined) {
        throw new Error('No moves returned by getMovesThatLeadToLeastCompletedPaths()');
      }
      setTimeout(() => {
        doNextMove(move);
      }, COMPUTER_THINK_TIME);
    }
  };

  const isAtPathEnd = (): boolean =>
    paths.some((path) => areChessPathsEquivalent(path, playedMoves));

  const getMovesThatLeadToLeastCompletedPaths = (): string[] => {
    // Get the paths that are reachable from the current position forward.
    const relevantPaths = pathsCompleted.filter((p) => {
      return (
        p.mode == mode &&
        playedMoves.every((move, idx) => areChessMovesEquivalent(move, p.path[idx]))
      );
    });
    const lowestTimesCompleted = Math.min(...relevantPaths.map((p) => p.timesCompleted));
    const leastCompletedPaths = relevantPaths.filter(
      (p) => p.timesCompleted === lowestTimesCompleted,
    );
    return leastCompletedPaths.map((p) => p.path[playedMoves.length]);
  };

  const recordPathCompletion = () => {
    const [matchingPaths, nonMatchingPaths] = partition(
      pathsCompleted,
      (p) => areChessPathsEquivalent(p.path, playedMoves) && p.mode === mode,
    );
    if (matchingPaths.length !== 1) {
      throw new Error(`Unexpected number of matchingPaths: ${matchingPaths.length}`);
    } else {
      const updatedPathStats: PathStats = {
        ...matchingPaths[0],
        timesCompleted: matchingPaths[0].timesCompleted + 1,
      };
      setPathsCompleted([...nonMatchingPaths, updatedPathStats]);
    }
  };

  // Whenever `playedMoves` changes
  useEffect(() => {
    if (isAtPathEnd()) {
      recordPathCompletion();
      setIsModalOpen(true);
    } else {
      if (isUsersTurn()) {
        scheduleShowMoves();
      } else {
        doComputerMove();
      }
    }
    // In cleanup, clear timeouts
    return () => {
      clearTimeouts();
    };
  }, [playedMoves]);

  const getNumPathsCompleted = (): number => {
    return pathsCompleted.reduce((acc: number, p) => {
      if (p.mode === mode && p.timesCompleted > 0) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
  };

  const toggleGuideMode = () => {
    mode === 'learn' ? setMode('practice') : setMode('learn');
    reset();
  };

  const triggerWrongMoveBoardFlash = () => {
    setWrongMoveFlashIdx((idx) => idx + 1);
  };

  const getSelectedMoveIdx = (): number | null => {
    if (movesPosition === 0) return null;
    return movesPosition - 1;
  };

  const changeSelectedMoveIdx = (idx: number) => {
    setMovesPosition(idx + 1);
  };

  const childrenWithProps = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        playedMoves,
        selectedMoveIdx: getSelectedMoveIdx(),
        changeSelectedMoveIdx,
      });
    }
    return child;
  });

  const debug = () => {
    console.log('You pressed the debug button');
  };

  return (
    <Grid container direction='row' spacing={2}>
      <Grid item>
        <div className={classes.boardBorderDiv}>
          <ChessGuideBoard
            size={boardSizePixels + 'px'}
            playedMoves={playedMoves}
            boardPosition={fen}
            orientation={userPlaysAs}
            isUsersTurn={isUsersTurn()}
            check={game.in_check()}
            turnColor={turnColor()}
            onMove={handleMove}
            movable={calcMovable()}
            arePiecesDraggable={getNextMoves().length > 0}
            nextMoves={getNextMoves()}
            shouldShowNextMoves={isShowingMoves}
            wrongMoveFlashIdx={wrongMoveFlashIdx}
            isBoardDisabled={isDetached}
          />
        </div>
        <ChessGuideInfo
          numPaths={paths.length}
          numPathsCompleted={getNumPathsCompleted()}
          currentGuideMode={mode}
          score={getScoreFromFen(game.fen())}
        />
        <ChessGuideControls
          areBackBtnsEnabled={movesPosition > 0}
          areForwardBtnsEnabled={playedMoves.length > movesPosition}
          onJumpBackBtnClick={jumpToStartOfPlayedMoves}
          onJumpForwardBtnClick={jumpToEndOfPlayedMoves}
          onStepBackBtnClick={moveBack}
          onStepForwardBtnClick={moveForward}
          onResetBtnClick={reset}
          onModeSwitchBtnClick={toggleGuideMode}
          currentMode={mode}
        />
      </Grid>
      <Grid item>
        <Grid container direction='column' spacing={2}>
          {childrenWithProps &&
            childrenWithProps.map((child, idx) => (
              <Grid key={`ChessGuide child ${idx}`} item>
                {child}
              </Grid>
            ))}
        </Grid>
      </Grid>

      {SHOW_DEBUG_BTN && (
        <Button variant='contained' color='primary' onClick={debug}>
          Debug
        </Button>
      )}

      <Modal
        isModalOpenOrOpening={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        delayOpenFor={500}
      >
        <h3>Path Complete!</h3>
        <p>
          {getNumPathsCompleted()} of {paths.length} paths complete
        </p>
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            reset();
            setIsModalOpen(false);
          }}
        >
          Reset Game to Complete Next Path
        </Button>
      </Modal>

      {renderExtraControlsForTesting && (
        <ChessMoveSelector nextMoveGames={getNextMoveGames()} handleSubmit={handleMove} />
      )}
    </Grid>
  );
};

export default ChessGuide;
