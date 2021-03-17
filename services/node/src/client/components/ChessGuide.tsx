import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React, { useState, useEffect, useRef } from 'react';
import { Chess, ChessInstance, Square, ShortMove } from 'chess.js';
import { ChessTree, PieceColor, PromotionPiece } from '../../shared/chessTypes';
import { getTreeLines } from '../../shared/chessTree';
import {
  areChessLinesEquivalent,
  areChessMovesEquivalent,
  partition,
  randomElem,
  getScoreFromFen,
} from '../../shared/utils';
import ChessMoveSelector from './ChessMoveSelector';
import Beeper from '../beeper';
import ChessGuideBoard from './ChessGuideBoard';
import ChessGuideInfo from './ChessGuideInfo';
import ChessGuideControls from './ChessGuideControls';
import { GuideMode } from '../utils/types';
import LineCompleteModal from './LineCompleteModal';
import PawnPromoteModal from './PawnPromoteModal';
import DeadEndModal from './DeadEndModal';
import { LessonType } from '../../shared/entity/lesson';

const COMPUTER_THINK_TIME = 250;
const CHECK_MOVE_DELAY = 250;
const SHOW_NEXT_MOVES_DELAY = 1000;
const SHOW_DEBUG_BTN = false;
const BEEPER_FREQUENCY = 73;
const BOARD_BORDER_WIDTH = '13px';
const SWITCH_TO_PRACTICE_MODE_DELAY = 300;

const useStyles = makeStyles((theme) => ({
  boardBorderDiv: {
    display: 'inline-block',
    padding: BOARD_BORDER_WIDTH,
    backgroundColor: theme.palette.background.default,
    borderRadius: '5px',
  },
  childrenContainer: {
    paddingTop: BOARD_BORDER_WIDTH,
  },
}));

interface Props {
  chessTree: ChessTree;
  lessonType: LessonType;
  boardSizePixels: number;
  userPlaysAs?: PieceColor;
  guideMode?: GuideMode;
  renderExtraControlsForTesting?: boolean;
}

type LineStats = {
  mode: GuideMode;
  line: string[];
  timesCompleted: number;
  teachingPriority: number;
};

type MoveFromTo = {
  from: Square;
  to: Square;
};

const ChessGuide: React.FunctionComponent<Props> = ({
  chessTree,
  lessonType,
  boardSizePixels,
  userPlaysAs = 'white',
  guideMode = 'learn',
  renderExtraControlsForTesting = false,
  ...props
}) => {
  const classes = useStyles({});

  const lines = getTreeLines(chessTree, 'verbose');

  const [beeper, setBeeper] = useState<Beeper | undefined>(undefined);
  const [isLineCompleteModalOpen, setIsLineCompleteModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isDeadEndModalOpen, setIsDeadEndModalOpen] = useState(false);
  const [mode, setMode] = useState<GuideMode>(guideMode);
  const [lineStats, setLineStats] = useState<LineStats[]>([]);
  const [game] = useState<ChessInstance>(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [pendingMove, setPendingMove] = useState<MoveFromTo | undefined>(undefined);
  const [wrongMoveFlashIdx, setWrongMoveFlashIdx] = useState<number>(0);
  const [isShowingMoves, setIsShowingMoves] = useState<boolean>(false);
  const [playedMoves, setPlayedMoves] = useState<string[]>([]);
  const [movesPosition, setMovesPosition] = useState<number>(0);
  const [isBoardDisabled, setIsBoardDisabled] = useState<boolean>(false);
  const [didPcPlayLastMove, setDidPcPlayLastMove] = useState<boolean>(true);

  // timeout refs
  const checkMoveTimeout = useRef<number | undefined>(undefined);
  const addToPlayedMovesTimeout = useRef<number | undefined>(undefined);
  const showMovesTimeout = useRef<number | undefined>(undefined);
  const hideMovesTimeout = useRef<number | undefined>(undefined);
  const doNextMoveTimeout = useRef<number | undefined>(undefined);
  const updateBoardTimeout = useRef<number | undefined>(undefined);
  const switchToPracticeModeTimeout = useRef<number | undefined>(undefined);

  const clearTimeouts = () => {
    const allTimeoutRefs = [
      checkMoveTimeout,
      addToPlayedMovesTimeout,
      showMovesTimeout,
      hideMovesTimeout,
      doNextMoveTimeout,
      updateBoardTimeout,
      switchToPracticeModeTimeout,
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
      // If the computer played the last move, we need to delay showing moves to wait for
      // the board animation to complete. If the user played the move, we don't need to
      // wait as long.
      if (didPcPlayLastMove) {
        scheduleShowMoves();
      } else {
        scheduleShowMoves({ delay: 100 });
      }
    }
  }, [movesPosition]);

  const isUsersTurn = (): boolean => {
    return game.turn() === userPlaysAs.charAt(0);
  };

  // Initialize 'lineStats' for all lines, setting their 'timesCompleted' values
  // to zero.
  const makeInitialLineStatsValues = (): LineStats[] => {
    return lines.reduce((acc: LineStats[], lineObj) => {
      const practiceLine: LineStats = {
        mode: 'practice',
        line: lineObj.line,
        timesCompleted: 0,
        teachingPriority: 0,
      };
      const learnLine: LineStats = {
        mode: 'learn',
        line: lineObj.line,
        timesCompleted: 0,
        teachingPriority: lineObj.teachingPriority,
      };
      return [...acc, practiceLine, learnLine];
    }, []);
  };

  // Use this function to set the `fen` value, which will update the board position.
  const updateBoard = () => setFen(game.fen());

  const getNextMoveGames = (): ChessInstance[] => {
    const games: ChessInstance[] = [];
    getNextMoves().forEach((move) => {
      const game = new Chess();
      [...playedMoves, move].forEach((m) => {
        if (!game.move(m)) {
          throw new Error(`invalid move: ${m}, moves: ${playedMoves}`);
        }
      });
      games.push(game);
    });
    return games;
  };

  useEffect(() => {
    reset();
    setLineStats(makeInitialLineStatsValues());
  }, []);

  useEffect(() => {
    reset();
    setLineStats(makeInitialLineStatsValues());
  }, [chessTree, userPlaysAs]);

  const getNextMoves = (): string[] => {
    const result: string[] = [];
    getRelevantLines().forEach((lineStats) => {
      const nextMove = lineStats.line[playedMoves.length];
      if (nextMove != undefined && !result.includes(nextMove)) {
        result.push(nextMove);
      }
    });
    return result;
  };

  const getRelevantLines = (specifiedLine?: string[]): LineStats[] => {
    const line = specifiedLine == undefined ? playedMoves : specifiedLine;
    return lineStats.filter((p) => {
      return (
        p.mode === mode &&
        line.every((move, idx) => areChessMovesEquivalent(move, p.line[idx]))
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
    for (let i = 0, len = moves.length; i < len; i++) {
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
        if (mode === 'learn') setIsBoardDisabled(true);
        nextAction = handleCorrectMove;
      } else {
        nextAction = rectifyIncorrectMove;
      }
      checkMoveTimeout.current = window.setTimeout(nextAction, CHECK_MOVE_DELAY);
    }
  };

  // Return true if the given move only leads to completed lines and there are uncompleted
  // lines (or lines completed fewer times) available to the user if they had played a
  // different move. If the `ignoreIfAllLinesHaveBeenCompleted` option is given, always
  // return false if all the relevant lines have been completed at least once.
  const doesMoveLeadToDeadEnd = (
    move: string,
    ignore?: 'ignoreIfAllLinesHaveBeenCompleted',
  ): boolean => {
    const linesWithMove = getRelevantLines([...playedMoves, move]);
    const linesWithoutMove = getRelevantLines();
    const lowestTimesCompletedWithoutMove = Math.min(
      ...linesWithoutMove.map((p) => p.timesCompleted),
    );
    if (lowestTimesCompletedWithoutMove > 0 && ignore) return false;
    const lowestTimesCompletedWithMove = Math.min(
      ...linesWithMove.map((p) => p.timesCompleted),
    );
    return lowestTimesCompletedWithMove > lowestTimesCompletedWithoutMove;
  };

  const handleCorrectMove = () => {
    if (doesMoveLeadToDeadEnd(getLastMove(), 'ignoreIfAllLinesHaveBeenCompleted')) {
      setIsDeadEndModalOpen(true);
      return;
    } else {
      addMoveToPlayedMoves();
    }
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

  const getMovableColor = (): PieceColor | 'both' => {
    // If the user is looking at past moves, allow them to move all pieces.
    if (movesPosition < playedMoves.length) {
      return 'both';
    }
    return game.turn() === 'w' ? 'white' : 'black';
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
      color: getMovableColor(),
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
    game.reset();
    updateBoard();
    setIsShowingMoves(false);
    if (mode === 'learn') setIsBoardDisabled(true);
    scheduleShowMoves();
    setIsBoardDisabled(false);
    setDidPcPlayLastMove(true);
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

  const pcHasMultipleMoveOptions = (): boolean => {
    return !isUsersTurn() && getNextMoves().length > 1;
  };

  const shouldShowMoves = (): boolean => {
    return mode === 'learn' || pcHasMultipleMoveOptions();
  };

  const scheduleShowMoves = (options: { forceShow?: boolean; delay?: number } = {}) => {
    const delay = options.delay == undefined ? SHOW_NEXT_MOVES_DELAY : options.delay;
    if (shouldShowMoves() || options.forceShow) {
      showMovesTimeout.current = window.setTimeout(() => {
        setIsShowingMoves(true);
        setIsBoardDisabled(false);
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
    } else if (moves.length === 1) {
      move = moves[0];
    } else {
      // If there is more than one move that the computer can play, the computer randomly
      // selects a move from among the moves that are on lines that have been completed
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

  const isAtLineEnd = (): boolean =>
    lines.some((lineObj) => areChessLinesEquivalent(lineObj.line, playedMoves));

  const getBestNextMoves = (): string[] => {
    // Get the lines that are reachable from the current position forward.
    const relevantLines = lineStats.filter((p) => {
      return (
        p.mode == mode &&
        playedMoves.every((move, idx) => areChessMovesEquivalent(move, p.line[idx]))
      );
    });
    const lowestTimesCompleted = Math.min(...relevantLines.map((p) => p.timesCompleted));
    const leastCompletedLines = relevantLines.filter(
      (p) => p.timesCompleted === lowestTimesCompleted,
    );
    const highestTeachingPriority = Math.max(
      ...leastCompletedLines.map((p) => p.teachingPriority),
    );
    const bestLines = leastCompletedLines.filter(
      (p) => p.teachingPriority === highestTeachingPriority,
    );
    return bestLines.map((p) => p.line[playedMoves.length]);
  };

  const recordLineCompletion = () => {
    const [matchingLines, nonMatchingLines] = partition(
      lineStats,
      (p) => areChessLinesEquivalent(p.line, playedMoves) && p.mode === mode,
    );
    if (matchingLines.length !== 1) {
      throw new Error(`Unexpected number of matchingLines: ${matchingLines.length}`);
    } else {
      const updatedLineStats: LineStats = {
        ...matchingLines[0],
        timesCompleted: matchingLines[0].timesCompleted + 1,
      };
      setLineStats([...nonMatchingLines, updatedLineStats]);
    }
  };

  // Whenever `playedMoves` changes
  useEffect(() => {
    if (isAtLineEnd()) {
      recordLineCompletion();
      setIsLineCompleteModalOpen(true);
    }
    if (!isUsersTurn() && getNextMoves().length < 2) {
      doComputerMove();
      setDidPcPlayLastMove(true);
    } else {
      setDidPcPlayLastMove(false);
    }
  }, [playedMoves]);

  const getNumLinesCompleted = (): number => {
    return lineStats.reduce((acc: number, p) => {
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
            doesMoveLeadToDeadEnd={doesMoveLeadToDeadEnd}
            disabled={isBoardDisabled}
          />
        </div>
        <ChessGuideInfo
          numLines={lines.length}
          numLinesCompleted={getNumLinesCompleted()}
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
        <Grid
          container
          className={classes.childrenContainer}
          direction='column'
          spacing={2}
        >
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

      <LineCompleteModal
        lessonType={lessonType}
        isOpenOrOpening={isLineCompleteModalOpen}
        handleClose={() => setIsLineCompleteModalOpen(false)}
        numLines={lines.length}
        numLinesCompleted={getNumLinesCompleted()}
        currentGuideMode={mode}
        handleResetBtnClick={() => {
          reset();
          setIsLineCompleteModalOpen(false);
        }}
        handleSwitchToPracticeModeBtnClick={() => {
          setIsLineCompleteModalOpen(false);

          // Delay the switch to practice mode until after the modal has finished closing,
          // otherwise the content inside the modal will change just before it closes.
          switchToPracticeModeTimeout.current = window.setTimeout(
            () => setMode('practice'),
            SWITCH_TO_PRACTICE_MODE_DELAY,
          );
        }}
      />

      <PawnPromoteModal
        isOpenOrOpening={isPromoteModalOpen}
        color={userPlaysAs}
        handlePieceSelected={onPawnPromoteSelection}
      />

      <DeadEndModal
        isOpenOrOpening={isDeadEndModalOpen}
        maxWidth='375px'
        handleOptionSelect={(keepMove) => {
          setIsDeadEndModalOpen(false);
          if (keepMove) {
            addMoveToPlayedMoves();
          } else {
            undoMove();
            scheduleShowMoves({ delay: 400 });
          }
        }}
      />

      {renderExtraControlsForTesting && (
        <ChessMoveSelector nextMoveGames={getNextMoveGames()} handleSubmit={handleMove} />
      )}
    </Grid>
  );
};

export default ChessGuide;
