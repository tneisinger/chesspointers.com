import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import ChessGuide from './ChessGuide';
import MovesPane from '../components/MovesPane';
import { ChessTree } from '../../shared/chessTypes';
import { makeChessTree } from '../../shared/chessTree';
import { SELECT_BTN_TEST_ID } from './ChessMoveSelector';
import { LessonType } from '../../shared/entity/lesson';

jest.useFakeTimers();

// Prevents irrelevant errors
jest.mock('../beeper');

// Don't print annoying warnings and errors to the console when running tests
beforeAll(() => {
  const error = console.error;
  const warn = console.warn
  jest.spyOn(console, 'warn').mockImplementation((msg: string, ...rest) => {
    if (msg.startsWith('Warning: componentWillReceiveProps has been renamed')) {
      return;
    } else {
      warn(msg, ...rest);
    }
  });
  jest.spyOn(console, 'error').mockImplementation((arg1, arg2, msg, ...rest) => {
    if (msg.startsWith('Invalid prop `check`')) {
      return;
    } else {
      error(arg1, arg2, msg, ...rest);
    }
  });
});

// Clearing timers before each test prevents an error message
beforeEach(() => {
  jest.clearAllTimers();
});

describe('<ChessGuide /> in "learn" mode with simple ChessTree', () => {
  const simpleChessTree: ChessTree = makeChessTree(['e4', 'e5', 'Nf3', 'Nc6'], []);

  it('user should be able to play first correct move', async () => {
    const { getByTestId, getByText } = render(
      <ChessGuide
        lessonType={LessonType.OPENING}
        boardSizePixels={500}
        chessTree={simpleChessTree}
        userPlaysAs='white'
        renderExtraControlsForTesting
      >
        <MovesPane
          height={500}
          playedMoves={[]}
          selectedMoveIdx={null}
          changeSelectedMoveIdx={(idx) => void idx}
        />
      </ChessGuide>
    );
    const playNextMoveBtn = getByTestId(SELECT_BTN_TEST_ID);
    fireEvent.click(playNextMoveBtn);
    await waitFor(() => {
      getByText('e4', { exact: true });
    });
  });

  it('should play opponent move after user plays first move', async () => {
    const { getByText, getByTestId } = render(
      <ChessGuide
        lessonType={LessonType.OPENING}
        boardSizePixels={500}
        chessTree={simpleChessTree}
        userPlaysAs='white'
        renderExtraControlsForTesting
      >
        <MovesPane
          height={500}
          playedMoves={[]}
          selectedMoveIdx={null}
          changeSelectedMoveIdx={(idx) => void idx}
        />
      </ChessGuide>
    );
    const playNextMoveBtn = getByTestId(SELECT_BTN_TEST_ID);
    fireEvent.click(playNextMoveBtn);
    await waitFor(() => {
      getByText('e4', { exact: true });
      getByText('e5', { exact: true });
    });
  });

  it('computer immediately plays first move if userPlaysAs black', async () => {
    const { getByText } = render(
      <ChessGuide
        lessonType={LessonType.OPENING}
        boardSizePixels={500}
        chessTree={simpleChessTree}
        userPlaysAs={'black'}
      >
        <MovesPane
          height={500}
          playedMoves={[]}
          selectedMoveIdx={null}
          changeSelectedMoveIdx={(idx) => void idx}
        />
      </ChessGuide>
    );
    await waitFor(() => {
      getByText('e4', { exact: true });
    });
  });
});

describe('<ChessGuide /> with ChessTree that branches immediately', () => {
  const chessTree = makeChessTree(
    [''],
    [makeChessTree(['e4', 'e5'], []), makeChessTree(['d4', 'd5'], [])],
  );

  it('does not play first move automatically', async () => {
    const { queryByText } = render(
      <ChessGuide
        lessonType={LessonType.OPENING}
        boardSizePixels={500}
        chessTree={chessTree}
        userPlaysAs={'black'}
      >
        <MovesPane
          height={500}
          playedMoves={[]}
          selectedMoveIdx={null}
          changeSelectedMoveIdx={(idx) => void idx}
        />
      </ChessGuide>
    );
    await waitFor(() => {
      expect(queryByText('e4', { exact: true })).toBeNull();
      expect(queryByText('d4')).toBeNull();
    });
  });
});
