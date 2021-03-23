import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React, { useState, useEffect, useRef } from 'react';
import { Chess, ChessInstance, Square, ShortMove } from 'chess.js';
import { ChessTree, PieceColor, PromotionPiece } from '../../shared/chessTypes';
import {
  randomElem,
  getScoreFromFen,
  convertMovesToShortMoves,
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
import { useLineStats } from '../hooks/useLineStats';

const COMPUTER_THINK_TIME = 250;
const CHECK_MOVE_DELAY = 250;
const SHOW_NEXT_MOVES_DELAY = 1000;
const SHOW_DEBUG_BTN = false;
const BEEPER_FREQUENCY = 73;
const BOARD_BORDER_WIDTH = '13px';
const SWITCH_TO_PRACTICE_MODE_DELAY = 300;
const LCL_STOR_KEY_ALLOW_DEAD_END_MODAL = 'allowDeadEndModal';

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

  const [beeper, setBeeper] = useState<Beeper | undefined>(undefined);
  const [isLineCompleteModalOpen, setIsLineCompleteModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isDeadEndModalOpen, setIsDeadEndModalOpen] = useState(false);
  const [allowDeadEndModal, setAllowDeadEndModal] = useState<boolean>(() => {
    const localStorageVal = localStorage.getItem(LCL_STOR_KEY_ALLOW_DEAD_END_MODAL);
    return localStorageVal ? JSON.parse(localStorageVal) : true;
  });
  const [mode, setMode] = useState<GuideMode>(guideMode);
  const [game] = useState<ChessInstance>(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [pendingMove, setPendingMove] = useState<ShortMove | undefined>(undefined);
  const [wrongMoveFlashIdx, setWrongMoveFlashIdx] = useState<number>(0);
  const [isShowingMoves, setIsShowingMoves] = useState<boolean>(false);
  const [playedMoves, setPlayedMoves] = useState<string[]>([]);
  const [movesPosition, setMovesPosition] = useState<number>(0);
  const [isBoardDisabled, setIsBoardDisabled] = useState<boolean>(false);
  const [didPcPlayLastMove, setDidPcPlayLastMove] = useState<boolean>(true);
  const [lastMoveSquares, setLastMoveSquares] = useState<string[]>([]);

  const lineStatsToolkit = useLineStats(chessTree, playedMoves, mode);

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

  // Update localStorage whenever the allowDeadEndModal value changes.
  useEffect(() => {
    localStorage.setItem(LCL_STOR_KEY_ALLOW_DEAD_END_MODAL, String(allowDeadEndModal));
  }, [allowDeadEndModal]);

  // Whenever `movesPosition` changes...
  useEffect(() => {
    updateLastMoveSquares();
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
    lineStatsToolkit.resetValues();
  }, []);

  useEffect(() => {
    reset();
    lineStatsToolkit.resetValues();
  }, [chessTree, userPlaysAs]);

  const getNextMoves = (): string[] => {
    const result: string[] = [];
    lineStatsToolkit.getRelevantLines().forEach((lineStats) => {
      const nextMove = lineStats.line[playedMoves.length];
      if (nextMove != undefined && !result.includes(nextMove)) {
        result.push(nextMove);
      }
    });
    return result;
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

  const shouldShowDeadEndModal = (): boolean =>
    allowDeadEndModal &&
    getNextMoves().length > 1 &&
    lineStatsToolkit.doesMoveLeadToDeadEnd(getLastMove());

  const handleCorrectMove = () => {
    if (shouldShowDeadEndModal()) {
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
    };
  };

  const defineBeeper = (): Beeper => {
    const newBeeper = new Beeper({ frequency: BEEPER_FREQUENCY });
    setBeeper(newBeeper);
    return newBeeper;
  };

  const prepareBeeper = (): void => {
    if (beeper == undefined) {
      defineBeeper();
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
    setLastMoveSquares([]);
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

  const thereAreMultipleMoveOptions = (): boolean => {
    return getNextMoves().length > 1;
  };

  const shouldShowMoves = (): boolean => {
    return mode === 'learn' || thereAreMultipleMoveOptions();
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
      const randomMove = randomElem(lineStatsToolkit.getBestNextMoves());
      if (randomMove == undefined) {
        throw new Error('No moves returned by getBestNextMoves()');
      }
      move = randomMove;
    }
    doNextMoveTimeout.current = window.setTimeout(() => {
      doNextMove(move);
    }, COMPUTER_THINK_TIME);
  };

  // Whenever `playedMoves` changes
  useEffect(() => {
    if (lineStatsToolkit.atLineEnd()) {
      lineStatsToolkit.recordLineCompletion();
      setIsLineCompleteModalOpen(true);
    }
    if (!isUsersTurn() && getNextMoves().length < 2) {
      doComputerMove();
      setDidPcPlayLastMove(true);
    } else {
      setDidPcPlayLastMove(false);
    }
  }, [playedMoves]);

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

  const childrenWithProps = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        playedMoves,
        selectedMoveIdx: getSelectedMoveIdx(),
        changeSelectedMoveIdx: (idx: number) => setMovesPosition(idx + 1),
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

  // Set the `lastMoveSquares` that should be highlighted as the last played move
  const updateLastMoveSquares = (): void => {
    const moveIdx = getSelectedMoveIdx();
    if (playedMoves.length < 1 || moveIdx == null) {
      setLastMoveSquares([]);
      return;
    }
    const { from, to } = convertMovesToShortMoves(playedMoves)[moveIdx];
    setLastMoveSquares([from, to]);
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
            doesMoveLeadToDeadEnd={lineStatsToolkit.doesMoveLeadToDeadEnd}
            lastMoveSquares={lastMoveSquares}
            disabled={isBoardDisabled}
            onMouseDown={prepareBeeper}
          />
        </div>
        <ChessGuideInfo
          numLines={lineStatsToolkit.numLines()}
          numLinesCompleted={lineStatsToolkit.numLinesCompleted()}
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
        numLines={lineStatsToolkit.numLines()}
        numLinesCompleted={lineStatsToolkit.numLinesCompleted()}
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
        showAgain={allowDeadEndModal}
        setShowAgain={setAllowDeadEndModal}
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
