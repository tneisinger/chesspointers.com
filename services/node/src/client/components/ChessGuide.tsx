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
  areChessMovesEquivalent,
} from '../../shared/utils';
import ChessMoveSelector from './ChessMoveSelector';
import Beeper from '../beeper';
import ChessGuideBoard, { BOARD_ANIMATION_DURATION } from './ChessGuideBoard';
import ChessGuideInfo from './ChessGuideInfo';
import ChessGuideControls from './ChessGuideControls';
import { GuideMode, OpMovesPlayedBy } from '../utils/types';
import LineCompleteModal from './LineCompleteModal';
import PawnPromoteModal from './PawnPromoteModal';
import DeadEndModal from './DeadEndModal';
import { LessonType } from '../../shared/entity/lesson';
import { useChessTreeToolkit } from '../hooks/useChessTreeToolkit';
import { useChessGuideSettings } from '../hooks/useChessGuideSettings';

const COMPUTER_THINK_TIME = 250;
const CHECK_MOVE_DELAY = BOARD_ANIMATION_DURATION + 25;
const SHOW_NEXT_MOVES_DELAY = BOARD_ANIMATION_DURATION + 350;
const SHOW_DEBUG_BTN = false;
const BEEPER = new Beeper({ frequency: 73 });
const BOARD_BORDER_WIDTH = 13;
const SWITCH_TO_PRACTICE_MODE_DELAY = 300;
const LCL_STOR_KEY_ALLOW_DEAD_END_MODAL = 'allowDeadEndModal';

const useStyles = makeStyles({
  boardBorderDiv: {
    padding: BOARD_BORDER_WIDTH + 'px',
    width: (p: { boardSizePixels: number }) => p.boardSizePixels + 2 * BOARD_BORDER_WIDTH,
    margin: '0 auto',
    borderRadius: '5px',
  },
  childrenContainer: {
    paddingTop: BOARD_BORDER_WIDTH,
  },
});

interface Props {
  chessTree: ChessTree;
  lessonType: LessonType;
  boardSizePixels: number;
  userPlaysAs?: PieceColor;
  guideMode?: GuideMode;
  renderExtraControlsForTesting?: boolean;
}

interface PlayedMoves {
  past: string[];
  future: string[];
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
  const classes = useStyles({ boardSizePixels });

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
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([]);
  const [playedMoves, setPlayedMoves] = useState<PlayedMoves>({
    past: [],
    future: [],
  });

  // Increment this value to trigger a rebuild of the ChessGuideBoard drawable prop.
  // The drawable prop is what puts the move arrows on the screen. We only want to
  // trigger redraws at certain times, otherwise the animation of piece movements will
  // get interrupted.
  const [updateDrawableIdx, setUpdateDrawableIdx] = useState<number>(0);

  const movesOnBoard = () => playedMoves.past;

  const chessTreeToolkit = useChessTreeToolkit(chessTree, movesOnBoard, mode);
  const { settings, SettingsModal, SettingsBtn } = useChessGuideSettings();

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
      // has changed. But if the mode is changed while playedMoves is empty, that
      // useEffect callback will not run because reset() will not change the value of
      // playedMoves. Because of that, we have to run scheduleShowMoves() here when
      // playedMoves is empty.
      if (playedMoves.past.length === 0 && playedMoves.future.length === 0) {
        scheduleShowMoves();
      }
    }
  }, [mode]);

  // Whenever `playedMoves` changes...
  useEffect(() => {
    // Update which squares are highlighted, showing the last moves
    highlightLastMoveSquares();

    // Hide move arrows
    setIsShowingMoves(false);
    triggerBoardDrawableUpdate();

    if (userIsViewingAnOldMove()) {
      handleViewPastMove();
    } else {
      handleNewMoveWasPlayed();
    }
    previousPlayedMoves.current = playedMoves;
  }, [playedMoves]);

  const userIsViewingAnOldMove = (): boolean => {
    if (previousPlayedMoves.current == null) return false;
    const oldPlayedMoves = [
      ...previousPlayedMoves.current.past,
      ...previousPlayedMoves.current.future,
    ];
    const currentPlayedMoves = [...playedMoves.past, ...playedMoves.future];
    return arraysEqual(oldPlayedMoves, currentPlayedMoves);
  };

  const handleViewPastMove = () => {
    scheduleShowMoves({ delay: 300 });
  };

  const handleNewMoveWasPlayed = () => {
    // If the user has completed a line, mark the line completed
    if (chessTreeToolkit.atLineEnd()) {
      chessTreeToolkit.recordLineCompletion();
      setIsLineCompleteModalOpen(true);
      return;
    }

    // If the user should play the next move...
    // (NOTE: sometimes the user plays the opponent's move)
    if (shouldUserPlayNextMove()) {
      // We want to delay showing the move arrows by the right amount. If the board is
      // being reset, we want to wait a little longer to allow the board animation to
      // complete. Otherwise, we don't need to wait very long because there will be no
      // animation to wait for.
      if (playedMoves.past.length > 0) {
        // If the user is going to select the next move, we don't need to wait for an
        // animation to complete, so we can show the next move arrows sooner.
        scheduleShowMoves({ delay: 100 });
      } else {
        // If pastMoves is currently empty, the board was likely reset and we should
        // wait a bit longer to allow the board animation to complete
        scheduleShowMoves({ delay: 1000 });
      }
    } else {
      // The computer will play the next move automatically. Don't shorten the delay of
      // `scheduleShowMoves` because we want to wait for the animation of the computer's
      // move to complete before showing the next move arrows.
      if (playedMoves.past.length < 1) {
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

  const shouldUserPlayNextMove = (): boolean => {
    // If it is the user's turn, the user should play the move
    if (isUsersTurn()) return true;

    const numMoves = chessTreeToolkit.getNextMoves().length;

    // In learn mode, let the user play the opponent move when there are multiple move
    // options available. This allows the user to decide which line they want to learn.
    // If there is only one move that the opponent could play, play the move
    // automatically.
    if (mode === 'learn') {
      return numMoves > 1;
    }

    // If in practice mode, use the user's settings
    if (mode === 'practice') {
      if (settings.prac_opMovesPlayedBy === OpMovesPlayedBy.user) return true;
      if (
        settings.prac_opMovesPlayedBy === OpMovesPlayedBy.userIfMultipleChoices &&
        numMoves > 1
      ) {
        return true;
      }
    }
    return false;
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
    const moves = game.moves({ verbose: true });
    for (let i = 0; i < moves.length; i++) {
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

  const shouldShowDeadEndModal = (): boolean => {
    if (!allowDeadEndModal) return false;
    const nextMoves = chessTreeToolkit.getNextMoves();
    return (
      nextMoves.length > 1 &&
      chessTreeToolkit.doesMoveLeadToDeadEnd(getLastMove()) &&
      nextMoves.some((move) => !chessTreeToolkit.doesMoveLeadToDeadEnd(move))
    );
  };

  const handleCorrectMove = () => {
    if (shouldShowDeadEndModal()) {
      setIsDeadEndModalOpen(true);
      return;
    }
    addMoveToPlayedMoves();
  };

  const addMoveToPlayedMoves = (move?: string): void => {
    const newMove: string = move != undefined ? move : getLastMove();
    setPlayedMoves(({ past, future }) => {
      const newFuture = future.length < 1 || future[0] !== newMove ? [] : future.slice(1);
      return { past: [...past, newMove], future: newFuture };
    });
  };

  const wasLastMoveCorrect = () => {
    return chessTreeToolkit
      .getNextMoves()
      .some((move) => areChessMovesEquivalent(move, getLastMove()));
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
      free: false,
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
    setPlayedMoves({ past: [], future: [] });
    setIsShowingMoves(false);
    if (mode === 'learn') setIsBoardDisabled(true);
    setIsBoardDisabled(false);
    setHighlightedSquares([]);
    // Delay updateBoard() so that the board animation will not be interrupted by anything
    // we did above.
    scheduleUpdateBoard({ delay: 400 });
  };

  const moveBack = () => {
    if (playedMoves.past.length < 1) return;
    game.undo();
    scheduleUpdateBoard();
    setPlayedMoves(({ past, future }) => {
      const move = past[past.length - 1];
      return {
        past: past.slice(0, past.length - 1),
        future: [move, ...future],
      };
    });
  };

  const moveForward = () => {
    if (playedMoves.future.length < 1) return;
    const move = playedMoves.future[0];
    game.move(move);
    scheduleUpdateBoard();
    setPlayedMoves(({ past, future }) => ({
      past: [...past, move],
      future: future.slice(1),
    }));
  };

  const jumpToEndOfPlayedMoves = () => {
    playedMoves.future.forEach((move) => {
      game.move(move);
    });
    scheduleUpdateBoard();
    setPlayedMoves(({ past, future }) => ({
      past: [...past, ...future],
      future: [],
    }));
  };

  const jumpToStartOfPlayedMoves = () => {
    game.reset();
    scheduleUpdateBoard();
    setPlayedMoves(({ past, future }) => ({
      past: [],
      future: [...past, ...future],
    }));
  };

  const shouldShowMoves = (): boolean => {
    if (mode === 'learn') return true;
    const numMoves = chessTreeToolkit.getNextMoves().length;
    return numMoves > 1;
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

  const scheduleUpdateBoard = (options: { delay?: number } = {}) => {
    window.clearTimeout(updateBoardTimeout.current);
    const delay = options.delay == undefined ? 10 : options.delay;
    updateBoardTimeout.current = window.setTimeout(() => {
      updateBoard();
    }, delay);
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
    if (playedMoves.past.length < 1) return null;
    return playedMoves.past.length - 1;
  };

  const changeSelectedMoveIdx = (idx: number): void => {
    // First, update the chess.js `game` object to the new move position
    const diffFromGame = idx + 1 - game.history().length;
    if (diffFromGame > 0) {
      for (let i = 0; i < diffFromGame; i++) {
        game.move(playedMoves.future[i]);
      }
    } else if (diffFromGame < 0) {
      for (let i = 0; i < Math.abs(diffFromGame); i++) {
        game.undo();
      }
    }
    scheduleUpdateBoard();
    // Now set the new values of playedMoves
    setPlayedMoves(({ past, future }) => {
      const allMoves = [...past, ...future];
      return {
        past: allMoves.slice(0, idx + 1),
        future: allMoves.slice(idx + 1),
      };
    });
  };

  const childrenWithProps = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        playedMoves: [...playedMoves.past, ...playedMoves.future],
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

  // Highlight the squares that were involved in the last move
  const highlightLastMoveSquares = (): void => {
    if (playedMoves.past.length < 1) {
      setHighlightedSquares([]);
      return;
    }
    const { past } = playedMoves;
    const { from, to } = convertMovesToShortMoves(past)[past.length - 1];
    setHighlightedSquares([from, to]);
  };

  const triggerBoardDrawableUpdate = () => {
    setUpdateDrawableIdx((idx) => idx + 1);
  };

  const handleHintRequest = () => {
    const squaresToHighlight: string[] = [];
    chessTreeToolkit
      .getNextShortMoves()
      .forEach(({ from }) => squaresToHighlight.push(from));
    setHighlightedSquares(squaresToHighlight);
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
            highlightedSquares={highlightedSquares}
            disabled={isBoardDisabled}
            getNextShortMoves={chessTreeToolkit.getNextShortMoves}
            updateDrawableIdx={updateDrawableIdx}
            guideMode={mode}
            isUsersTurn={isUsersTurn}
          />
        </div>
        <ChessGuideInfo
          numLines={chessTreeToolkit.numLines()}
          numLinesCompleted={chessTreeToolkit.numLinesCompleted()}
          currentGuideMode={mode}
          score={getScoreFromFen(game.fen())}
        />
        <ChessGuideControls
          areBackBtnsEnabled={playedMoves.past.length > 0}
          areForwardBtnsEnabled={playedMoves.future.length > 0}
          onJumpBackBtnClick={jumpToStartOfPlayedMoves}
          onJumpForwardBtnClick={jumpToEndOfPlayedMoves}
          onStepBackBtnClick={moveBack}
          onStepForwardBtnClick={moveForward}
          onResetBtnClick={reset}
          onModeSwitchBtnClick={toggleGuideMode}
          currentMode={mode}
          onHintRequest={handleHintRequest}
          SettingsBtn={SettingsBtn}
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

      <SettingsModal />

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
