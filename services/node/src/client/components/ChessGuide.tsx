import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React, { useState, useEffect, useRef } from 'react';
import { Chess, ChessInstance, Square, ShortMove } from 'chess.js';
import {
  ChessTree,
  PieceColor,
  PromotionPiece,
  ChessTreePath,
} from '../../shared/chessTypes';
import { getTreePaths } from '../../shared/chessTree';
import {
  areChessPathsEquivalent,
  areChessMovesEquivalent,
  partition,
  randomElem,
  getScoreFromFen,
} from '../../shared/utils';
import ChessMoveSelector from './ChessMoveSelector';
import Beeper from '../beeper';
import PathCompleteModal from './PathCompleteModal';
import ChessGuideBoard from './ChessGuideBoard';
import ChessGuideInfo from './ChessGuideInfo';
import ChessGuideControls from './ChessGuideControls';
import { GuideMode } from '../utils/types';
import PawnPromoteModal from './PawnPromoteModal';

const COMPUTER_THINK_TIME = 250;
const CHECK_MOVE_DELAY = 250;
const SHOW_NEXT_MOVES_DELAY = 1000;
const SHOW_DEBUG_BTN = false;
const BEEPER_FREQUENCY = 73;

const useStyles = makeStyles((theme) => ({
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
  teachingPriority: number;
};

type MoveFromTo = {
  from: Square;
  to: Square;
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

  const paths = getTreePaths(chessTree, 'verbose');

  const [beeper, setBeeper] = useState<Beeper | undefined>(undefined);
  const [isPathCompleteModalOpen, setIsPathCompleteModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [mode, setMode] = useState<GuideMode>(guideMode);
  const [doesComputerAutoplay, setDoesComputerAutoplay] = useState<boolean>(true);
  const [pathStats, setPathStats] = useState<PathStats[]>([]);
  const [game] = useState<ChessInstance>(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [pendingMove, setPendingMove] = useState<MoveFromTo | undefined>(undefined);
  const [wrongMoveFlashIdx, setWrongMoveFlashIdx] = useState<number>(0);
  const [isShowingMoves, setIsShowingMoves] = useState<boolean>(false);
  const [playedMoves, setPlayedMoves] = useState<string[]>([]);
  const [movesPosition, setMovesPosition] = useState<number>(0);

  // timeout refs
  const checkMoveTimeout = useRef<number | undefined>(undefined);
  const addToPlayedMovesTimeout = useRef<number | undefined>(undefined);
  const showMovesTimeout = useRef<number | undefined>(undefined);
  const hideMovesTimeout = useRef<number | undefined>(undefined);
  const doNextMoveTimeout = useRef<number | undefined>(undefined);
  const updateBoardTimeout = useRef<number | undefined>(undefined);

  const clearTimeouts = () => {
    const allTimeoutRefs = [
      checkMoveTimeout,
      addToPlayedMovesTimeout,
      showMovesTimeout,
      hideMovesTimeout,
      doNextMoveTimeout,
      updateBoardTimeout,
    ];
    allTimeoutRefs.forEach((ref) => window.clearTimeout(ref.current));
  };

  // Clear all the timeouts on unmount
  useEffect(() => {
    return clearTimeouts;
  }, []);

  // Whenever `movesPosition` changes...
  useEffect(() => {
    // Reset the board to the specified position
    game.reset();
    for (let i = 0; i < movesPosition; i++) {
      game.move(playedMoves[i]);
    }
    updateBoardTimeout.current = window.setTimeout(() => updateBoard(), 350);

    if (movesPosition < playedMoves.length) {
      // If the new `movesPosition` is not at the end of the `playedMoves` array,
      // hide all move arrows.
      if (isShowingMoves) scheduleHideMoves({ delay: 200 });
    } else {
      scheduleShowMoves();
    }
  }, [movesPosition]);

  const isUsersTurn = (): boolean => {
    return game.turn() === userPlaysAs.charAt(0);
  };

  // Initialize 'pathStats' for all paths, setting their 'timesCompleted' values
  // set to zero.
  const makeInitialPathStatsValues = (): PathStats[] => {
    return paths.reduce((acc: PathStats[], pathObj) => {
      const practicePath: PathStats = {
        mode: 'practice',
        path: pathObj.path,
        timesCompleted: 0,
        teachingPriority: 0,
      };
      const learnPath: PathStats = {
        mode: 'learn',
        path: pathObj.path,
        timesCompleted: 0,
        teachingPriority: pathObj.teachingPriority,
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
    setPathStats(makeInitialPathStatsValues());
  }, []);

  useEffect(() => {
    reset();
    setPathStats(makeInitialPathStatsValues());
  }, [chessTree, userPlaysAs]);

  const getNextMoves = (): string[] => {
    const result: string[] = [];
    relevantPaths().forEach((pathObj) => {
      const nextMove = pathObj.path[playedMoves.length];
      if (nextMove != undefined && !result.includes(nextMove)) {
        result.push(nextMove);
      }
    });
    return result;
  };

  const relevantPaths = (): ChessTreePath[] => {
    return paths.filter((pathObj) => {
      return playedMoves.every((move, idx) =>
        areChessMovesEquivalent(move, pathObj.path[idx]),
      );
    });
  };

  const handleMove = (from: Square, to: Square) => {
    // If the user tries to play a move while the board is not positioned at the last of
    // the `playedMoves`, do not play the user's move. Instead, move the board back to the
    // last `playedMoves` position.
    if (movesPosition < playedMoves.length) {
      setMovesPosition(playedMoves.length);
      return;
    }

    const moves = game.moves({ verbose: true });
    for (let i = 0, len = moves.length; i < len; i++) { /* eslint-disable-line */
      // If the move involves a pawn promotion, save the move in `pendingMove` and
      // open the `PawnPromoteModal`.
      if (moves[i].flags.indexOf('p') !== -1 && moves[i].from === from) {
        setPendingMove({ from, to });
        setIsPromoteModalOpen(true);
        return;
      }
    }
    attemptMove(from, to);
  };

  const attemptMove = (from: Square, to: Square, promotion?: PromotionPiece) => {
    const move: ShortMove = { from, to };
    if (promotion != undefined) move.promotion = promotion;
    if (game.move(move)) {
      updateBoard();
      let nextAction: () => void;
      if (wasLastMoveCorrect()) {
        setIsShowingMoves(false);
        nextAction = handleGoodMove;
      } else {
        nextAction = rectifyIncorrectMove;
      }
      checkMoveTimeout.current = window.setTimeout(nextAction, CHECK_MOVE_DELAY);
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

  const wasLastMoveCorrect = () => {
    return getNextMoves().includes(getLastMove());
  };

  const rectifyIncorrectMove = () => {
    if (beeper == undefined) {
      defineBeeper().beep(2);
    } else {
      beeper.beep(2);
    }
    triggerWrongMoveBoardFlash();
    undoMove();
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
      free: movesPosition < playedMoves.length,
      dests,
      showDests: mode === 'practice',
      color: movesPosition < playedMoves.length ? 'both' : userPlaysAs,
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
      addToPlayedMovesTimeout.current = window.setTimeout(
        () => addMoveToPlayedMoves(move),
        350,
      );
    }
  };

  const reset = () => {
    clearTimeouts();
    setPlayedMoves([]);
    setMovesPosition(0);
    setDoesComputerAutoplay(true);
    game.reset();
    updateBoard();
    setIsShowingMoves(false);
    scheduleShowMoves();
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
    const delay = options.delay == undefined ? SHOW_NEXT_MOVES_DELAY : options.delay;
    if (mode === 'learn' || options.forceShow) {
      showMovesTimeout.current = window.setTimeout(() => {
        setIsShowingMoves(true);
      }, delay);
    }
  };

  const scheduleHideMoves = (options = { delay: SHOW_NEXT_MOVES_DELAY }) => {
    hideMovesTimeout.current = window.setTimeout(() => {
      setIsShowingMoves(false);
    }, options.delay);
  };

  const doComputerMove = () => {
    const moves = getNextMoves();
    let move: string;
    if (moves.length < 1) {
      return;
    } else if (moves.length === 1 && doesComputerAutoplay) {
      move = moves[0];
    } else {
      // If there is more than one move that the computer can play, the computer randomly
      // selects a move from among the moves that are on paths that have been completed
      // the fewest number of the times.
      const randomMove = randomElem(getBestNextMoves());
      if (randomMove == undefined) {
        throw new Error('No moves returned by getBestNextMoves()');
      }
      move = randomMove;
    }
    doNextMoveTimeout.current = window.setTimeout(() => {
      doNextMove(move);
    }, COMPUTER_THINK_TIME);
  };

  const isAtPathEnd = (): boolean =>
    paths.some((pathObj) => areChessPathsEquivalent(pathObj.path, playedMoves));

  const getBestNextMoves = (): string[] => {
    // Get the paths that are reachable from the current position forward.
    const relevantPaths = pathStats.filter((p) => {
      return (
        p.mode == mode &&
        playedMoves.every((move, idx) => areChessMovesEquivalent(move, p.path[idx]))
      );
    });
    const lowestTimesCompleted = Math.min(...relevantPaths.map((p) => p.timesCompleted));
    const leastCompletedPaths = relevantPaths.filter(
      (p) => p.timesCompleted === lowestTimesCompleted,
    );
    const highestTeachingPriority = Math.max(
      ...leastCompletedPaths.map((p) => p.teachingPriority),
    );
    const bestPaths = leastCompletedPaths.filter(
      (p) => p.teachingPriority === highestTeachingPriority,
    );
    return bestPaths.map((p) => p.path[playedMoves.length]);
  };

  const recordPathCompletion = () => {
    const [matchingPaths, nonMatchingPaths] = partition(
      pathStats,
      (p) => areChessPathsEquivalent(p.path, playedMoves) && p.mode === mode,
    );
    if (matchingPaths.length !== 1) {
      throw new Error(`Unexpected number of matchingPaths: ${matchingPaths.length}`);
    } else {
      const updatedPathStats: PathStats = {
        ...matchingPaths[0],
        timesCompleted: matchingPaths[0].timesCompleted + 1,
      };
      setPathStats([...nonMatchingPaths, updatedPathStats]);
    }
  };

  // Whenever `playedMoves` changes
  useEffect(() => {
    if (isAtPathEnd()) {
      recordPathCompletion();
      setIsPathCompleteModalOpen(true);
    }
    if (!isUsersTurn()) {
      doComputerMove();
    }
  }, [playedMoves]);

  const getNumPathsCompleted = (): number => {
    return pathStats.reduce((acc: number, p) => {
      if (p.mode === mode && p.timesCompleted > 0) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
  };

  const toggleGuideMode = () => {
    mode === 'learn' ? setMode('practice') : setMode('learn');
  };

  // Whenever the mode changes, reset the board
  useEffect(() => {
    reset();
  }, [mode]);

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

  const onPawnPromoteSelection = (promotionPiece: PromotionPiece): void => {
    if (pendingMove == undefined) throw new Error('No pendingMove set for promotion');
    const { from, to } = pendingMove;
    setIsPromoteModalOpen(false);
    attemptMove(from, to, promotionPiece);
  };

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
            inCheck={game.in_check()}
            inCheckmate={game.in_checkmate()}
            turnColor={turnColor()}
            onMove={handleMove}
            movable={calcMovable()}
            arePiecesDraggable={getNextMoves().length > 0}
            nextMoves={getNextMoves()}
            shouldShowNextMoves={isShowingMoves}
            wrongMoveFlashIdx={wrongMoveFlashIdx}
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

      <PathCompleteModal
        isOpenOrOpening={isPathCompleteModalOpen}
        handleClose={() => setIsPathCompleteModalOpen(false)}
        numPaths={paths.length}
        numPathsCompleted={getNumPathsCompleted()}
        currentGuideMode={mode}
        handleResetBtnClick={() => {
          reset();
          setIsPathCompleteModalOpen(false);
        }}
        handleSwitchToPracticeModeBtnClick={() => {
          setIsPathCompleteModalOpen(false);
          toggleGuideMode();
        }}
      />

      <PawnPromoteModal
        isOpenOrOpening={isPromoteModalOpen}
        color={userPlaysAs}
        handlePieceSelected={onPawnPromoteSelection}
      />

      {renderExtraControlsForTesting && (
        <ChessMoveSelector nextMoveGames={getNextMoveGames()} handleSubmit={handleMove} />
      )}
    </Grid>
  );
};

export default ChessGuide;
