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
  arraysEqual,
} from '../../shared/utils';
import ChessMoveSelector from './ChessMoveSelector';
import Beeper from '../beeper';
import ChessGuideBoard, { BOARD_ANIMATION_DURATION } from './ChessGuideBoard';
import ChessGuideInfo from './ChessGuideInfo';
import ChessGuideControls from './ChessGuideControls';
import { GuideMode } from '../utils/types';
import LineCompleteModal from './LineCompleteModal';
import PawnPromoteModal from './PawnPromoteModal';
import DeadEndModal from './DeadEndModal';
import { LessonType } from '../../shared/entity/lesson';
import { useChessTreeToolkit } from '../hooks/useChessTreeToolkit';

const COMPUTER_THINK_TIME = 250;
const CHECK_MOVE_DELAY = BOARD_ANIMATION_DURATION + 25;
const SHOW_NEXT_MOVES_DELAY = BOARD_ANIMATION_DURATION + 350;
const SHOW_DEBUG_BTN = false;
const BEEPER = new Beeper({ frequency: 73 });
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

interface PlayedMoves {
  moves: string[];
  pos: number;
}

const initialPlayedMovesVal: PlayedMoves = { moves: [], pos: 0 };

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
  const [isBoardDisabled, setIsBoardDisabled] = useState<boolean>(false);
  const [lastMoveSquares, setLastMoveSquares] = useState<string[]>([]);
  const [playedMoves, setPlayedMoves] = useState<PlayedMoves>(initialPlayedMovesVal);

  // Increment this value to trigger a rebuild of the ChessGuideBoard drawable prop.
  // The drawable prop is what puts the move arrows on the screen. We only want to
  // trigger redraws at certain times, otherwise the animation of piece movements will
  // get interrupted.
  const [updateDrawableIdx, setUpdateDrawableIdx] = useState<number>(0);

  const movesOnBoard = () => playedMoves.moves.slice(0, playedMoves.pos);

  const chessTreeToolkit = useChessTreeToolkit(chessTree, movesOnBoard, mode);

  // timeout refs
  const checkMoveTimeout = useRef<number | undefined>(undefined);
  const addToPlayedMovesTimeout = useRef<number | undefined>(undefined);
  const showMovesTimeout = useRef<number | undefined>(undefined);
  const hideMovesTimeout = useRef<number | undefined>(undefined);
  const doNextMoveTimeout = useRef<number | undefined>(undefined);
  const updateBoardTimeout = useRef<number | undefined>(undefined);
  const switchToPracticeModeTimeout = useRef<number | undefined>(undefined);
  const delayFirstMoveTimeout = useRef<number | undefined>(undefined);

  const previousPlayedMoves = useRef<PlayedMoves | null>(null);

  const firstModeUpdate = useRef<boolean>(true);
  const firstChessTreeUpdate = useRef<boolean>(true);

  useEffect(() => {
    reset();
  }, []);

  // Clear all the timeouts on unmount
  useEffect(() => {
    return clearTimeouts;
  }, []);

  // If chessTree or userPlaysAs changes, reset everything
  useEffect(() => {
    if (firstChessTreeUpdate.current) {
      firstChessTreeUpdate.current = false;
    } else {
      reset();
      chessTreeToolkit.resetValues();
    }
  }, [chessTree, userPlaysAs]);

  // When allowDeadEndModal changes, update the value in localStorage.
  useEffect(() => {
    localStorage.setItem(LCL_STOR_KEY_ALLOW_DEAD_END_MODAL, String(allowDeadEndModal));
  }, [allowDeadEndModal]);

  // Whenever the mode changes, reset the board
  useEffect(() => {
    if (firstModeUpdate.current) {
      firstModeUpdate.current = false;
    } else {
      reset();
      triggerBoardDrawableUpdate();

      // Normally, scheduleShowMoves() gets ran in a useEffect callback after playedMoves
      // has changed. But if mode is changed while playedMoves is empty, that useEffect
      // callback will not run because reset() will not change the value of playedMoves.
      // Because of that, we have to run scheduleShowMoves() here when playedMoves is
      // empty.
      if (playedMoves.moves.length === 0 && playedMoves.pos === 0) {
        scheduleShowMoves();
      }
    }
  }, [mode]);

  // Whenever `playedMoves` changes...
  useEffect(() => {
    // Update which squares are highlighted, showing the last moves
    updateLastMoveSquares();

    // Hide move arrows
    setIsShowingMoves(false);
    triggerBoardDrawableUpdate();

    // If necessary, reset the board to the specified position
    if (game.history().length !== playedMoves.pos) {
      game.reset();
      for (let i = 0; i < playedMoves.pos; i++) {
        game.move(playedMoves.moves[i]);
      }
      updateBoardTimeout.current = window.setTimeout(() => {
        updateBoard();
      }, 200);
    }

    if (userIsViewingAnOldMove()) {
      handleViewPastMove();
    } else {
      handleNewMoveWasPlayed();
    }
    previousPlayedMoves.current = playedMoves;
  }, [playedMoves]);

  const userIsViewingAnOldMove = (): boolean => {
    if (previousPlayedMoves.current == null) return false;
    return arraysEqual(playedMoves.moves, previousPlayedMoves.current.moves);
  };

  const handleViewPastMove = () => {
    scheduleShowMoves();
  };

  const handleNewMoveWasPlayed = () => {
    // If the user has completed a line, mark the line completed
    if (chessTreeToolkit.atLineEnd()) {
      chessTreeToolkit.recordLineCompletion();
      setIsLineCompleteModalOpen(true);
      return;
    }

    // If it is the users turn or if there are are multiple move options to choose from,
    // then the user will select the next move.
    if (isUsersTurn() || chessTreeToolkit.getNextMoves().length > 1) {
      if (playedMoves.moves.length > 0) {
        // If the user is going to select the next move, we don't need to wait for an
        // animation to complete, so we can show the next move arrows sooner.
        scheduleShowMoves({ delay: 100 });
      } else {
        // But if playedMoves is now empty, the board was likely reset and we should wait
        // a bit longer to allow the board animation to complete
        scheduleShowMoves({ delay: 1000 });
      }
    } else {
      // If it is not the users turn and there is only one move option, the computer will
      // play the next move automatically. Don't shorten the delay of `scheduleShowMoves`
      // because we want to wait for the animation of the computer's move to complete
      // before showing the next move arrows.
      if (playedMoves.moves.length < 1) {
        // If the computer plays the first move in the chess tree, wait a little longer
        // before playing the first move.
        delayFirstMoveTimeout.current = window.setTimeout(() => {
          scheduleShowMoves();
          doComputerMove();
        }, 600);
      } else {
        scheduleShowMoves();
        doComputerMove();
      }
    }
  };

  const clearTimeouts = () => {
    const allTimeoutRefs = [
      checkMoveTimeout,
      addToPlayedMovesTimeout,
      showMovesTimeout,
      hideMovesTimeout,
      doNextMoveTimeout,
      updateBoardTimeout,
      switchToPracticeModeTimeout,
      delayFirstMoveTimeout,
    ];
    allTimeoutRefs.forEach((ref) => window.clearTimeout(ref.current));
  };

  const toggleGuideMode = () => {
    mode === 'learn' ? setMode('practice') : setMode('learn');
  };

  const isUsersTurn = (): boolean => {
    return game.turn() === userPlaysAs.charAt(0);
  };

  // Use this function to set the `fen` value, which will update the board position.
  const updateBoard = () => setFen(game.fen());

  const handleMove = (from: Square, to: Square) => {
    // If the user tries to play a move while the board is not positioned at the last of
    // the `playedMoves`, do not play the user's move. Instead, move the board back to the
    // last `playedMoves` position.
    if (playedMoves.pos < playedMoves.moves.length) {
      setPlayedMoves(({ moves }) => ({ moves, pos: moves.length }));
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
        nextAction = handleCorrectMove;
      } else {
        nextAction = rectifyIncorrectMove;
      }
      checkMoveTimeout.current = window.setTimeout(nextAction, CHECK_MOVE_DELAY);
    }
  };

  const shouldShowDeadEndModal = (): boolean =>
    allowDeadEndModal &&
    chessTreeToolkit.getNextMoves().length > 1 &&
    chessTreeToolkit.doesMoveLeadToDeadEnd(getLastMove());

  const handleCorrectMove = () => {
    if (shouldShowDeadEndModal()) {
      setIsDeadEndModalOpen(true);
      return;
    }
    addMoveToPlayedMoves();
  };

  const addMoveToPlayedMoves = (move?: string): void => {
    const newMove: string = move != undefined ? move : getLastMove();
    setPlayedMoves(({ moves }) => ({
      moves: [...moves, newMove],
      pos: moves.length + 1,
    }));
  };

  const wasLastMoveCorrect = () => {
    return chessTreeToolkit.getNextMoves().includes(getLastMove());
  };

  const rectifyIncorrectMove = () => {
    BEEPER.beep(2);
    triggerWrongMoveBoardFlash();
    // Delay undoMove so that we don't interrupt the animation.
    updateBoardTimeout.current = window.setTimeout(() => undoMove(), 250);
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
    if (playedMoves.pos < playedMoves.moves.length) {
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
      free: playedMoves.pos < playedMoves.moves.length,
      dests,
      showDests: mode === 'practice',
      color: getMovableColor(),
    };
  };

  const turnColor = () => (game.turn() === 'w' ? 'white' : 'black');

  const doNextMove = (move: string) => {
    if (game.move(move)) {
      updateBoard();
      addToPlayedMovesTimeout.current = window.setTimeout(() => {
        addMoveToPlayedMoves(move);
      }, 200);
    }
  };

  const reset = () => {
    game.reset();
    setPlayedMoves(initialPlayedMovesVal);
    setIsShowingMoves(false);
    if (mode === 'learn') setIsBoardDisabled(true);
    setIsBoardDisabled(false);
    setLastMoveSquares([]);
    // Delay updateBoard() so that the board animation will not be interrupted by anything
    // we did above.
    window.clearTimeout(updateBoardTimeout.current);
    updateBoardTimeout.current = window.setTimeout(() => {
      updateBoard();
    }, 400);
  };

  const moveBack = () => {
    setPlayedMoves(({ moves, pos }) => {
      if (pos > 0) return { moves, pos: pos - 1 };
      return { moves, pos: 0 };
    });
  };

  const moveForward = () => {
    setPlayedMoves(({ moves, pos }) => {
      if (pos < moves.length) return { moves, pos: pos + 1 };
      return { moves, pos: moves.length };
    });
  };

  const jumpToEndOfPlayedMoves = () => {
    setPlayedMoves(({ moves }) => ({ moves, pos: moves.length }));
  };

  const jumpToStartOfPlayedMoves = () => {
    setPlayedMoves(({ moves }) => ({ moves, pos: 0 }));
  };

  const thereAreMultipleMoveOptions = (): boolean => {
    return chessTreeToolkit.getNextMoves().length > 1;
  };

  const shouldShowMoves = (): boolean => {
    return mode === 'learn' || thereAreMultipleMoveOptions();
  };

  const scheduleShowMoves = (options: { delay?: number } = {}) => {
    window.clearTimeout(showMovesTimeout.current);
    const delay = options.delay == undefined ? SHOW_NEXT_MOVES_DELAY : options.delay;
    if (shouldShowMoves()) {
      showMovesTimeout.current = window.setTimeout(() => {
        setIsShowingMoves(true);
        setIsBoardDisabled(false);
        triggerBoardDrawableUpdate();
      }, delay);
    }
  };

  const doComputerMove = () => {
    const moves = chessTreeToolkit.getNextMoves();
    let move: string;
    if (moves.length < 1) {
      return;
    } else if (moves.length === 1) {
      move = moves[0];
    } else {
      // If there is more than one move that the computer can play, the computer randomly
      // selects a move from among the moves that are on lines that have been completed
      // the fewest number of the times.
      const randomMove = randomElem(chessTreeToolkit.getBestNextMoves());
      if (randomMove == undefined) {
        throw new Error('No moves returned by getBestNextMoves()');
      }
      move = randomMove;
    }
    doNextMoveTimeout.current = window.setTimeout(() => {
      doNextMove(move);
    }, COMPUTER_THINK_TIME);
  };

  const triggerWrongMoveBoardFlash = () => {
    setWrongMoveFlashIdx((idx) => idx + 1);
  };

  const getSelectedMoveIdx = (): number | null => {
    if (playedMoves.pos === 0) return null;
    return playedMoves.pos - 1;
  };

  const childrenWithProps = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        playedMoves: playedMoves.moves,
        selectedMoveIdx: getSelectedMoveIdx(),
        changeSelectedMoveIdx: (idx: number) => {
          setPlayedMoves(({ moves }) => ({ moves, pos: idx + 1 }));
        },
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
    if (playedMoves.moves.length < 1 || moveIdx == null) {
      setLastMoveSquares([]);
      return;
    }
    const { from, to } = convertMovesToShortMoves(playedMoves.moves)[moveIdx];
    setLastMoveSquares([from, to]);
  };

  const triggerBoardDrawableUpdate = () => {
    setUpdateDrawableIdx((idx) => idx + 1);
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
            boardPosition={fen}
            orientation={userPlaysAs}
            inCheck={game.in_check()}
            inCheckmate={game.in_checkmate()}
            turnColor={turnColor()}
            onMove={handleMove}
            movable={calcMovable()}
            shouldShowNextMoves={isShowingMoves}
            wrongMoveFlashIdx={wrongMoveFlashIdx}
            doesMoveLeadToDeadEnd={chessTreeToolkit.doesMoveLeadToDeadEnd}
            lastMoveSquares={lastMoveSquares}
            disabled={isBoardDisabled}
            getNextShortMoves={chessTreeToolkit.getNextShortMoves}
            updateDrawableIdx={updateDrawableIdx}
          />
        </div>
        <ChessGuideInfo
          numLines={chessTreeToolkit.numLines()}
          numLinesCompleted={chessTreeToolkit.numLinesCompleted()}
          currentGuideMode={mode}
          score={getScoreFromFen(game.fen())}
        />
        <ChessGuideControls
          areBackBtnsEnabled={playedMoves.pos > 0}
          areForwardBtnsEnabled={playedMoves.moves.length > playedMoves.pos}
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
        numLines={chessTreeToolkit.numLines()}
        numLinesCompleted={chessTreeToolkit.numLinesCompleted()}
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
        <ChessMoveSelector
          nextMoveGames={chessTreeToolkit.getNextMoveGames()}
          handleSubmit={handleMove}
        />
      )}
    </Grid>
  );
};

export default ChessGuide;
