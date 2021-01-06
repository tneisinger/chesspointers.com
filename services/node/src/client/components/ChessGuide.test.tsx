import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import ChessGuide, { USER_HIGHLIGHT_SQUARE_STYLE } from './ChessGuide';
import { ChessTree } from '../../shared/chessTypes';
import { makeChessTree } from '../../shared/chessTree';
import { SELECT_BTN_TEST_ID } from './ChessMoveSelector';

// CSS style for a highlighted square, indicating a possible user move
const userHighlightSquareStyle = `box-shadow: ${USER_HIGHLIGHT_SQUARE_STYLE}`;

jest.useFakeTimers();

// Given a ChessGuide component element and a list of squares (e.g. ['e2', 'e4']), expect
// all of those squares to be highlighted.
const expectSquaresToBeHighlighted = (container: Element, squares: string[]) => {
  squares.forEach((square) => {
    const squareElem = container.querySelector(`[data-squareid="${square}"]`);
    expect(squareElem.firstChild).toHaveStyle(userHighlightSquareStyle);
  });
};

// Same as above, but expect the squares not be highlighted.
const expectSquaresNotToBeHighlighted = (container: Element, squares: string[]) => {
  squares.forEach((square) => {
    const squareElem = container.querySelector(`[data-squareid="${square}"]`);
    expect(squareElem.firstChild).not.toHaveStyle(userHighlightSquareStyle);
  });
};

// Don't print annoying warnings and errors to the console when running tests
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((msg: string, ...rest) => {
    if (msg.startsWith("Warning: componentWillReceiveProps has been renamed")) {
      return;
    } else {
      console.warn(msg, ...rest)
    }
  });
});

// Clearing timers before each test prevents an error message
beforeEach(() => {
  jest.clearAllTimers();
});

describe('<ChessGuide /> in "learn" mode with simple ChessTree', () => {
  const simpleChessTree: ChessTree = makeChessTree(
    [ 'e4', 'e5',
      'Nf3', 'Nc6',
    ],
    []
  );

  it('should have a Chessboard component', () => {
    const { container } = render(
      <ChessGuide
        chessTree={simpleChessTree}
      />
    );
    expect(container.querySelector('[data-boardid="0"]')).not.toBeNull();
  });

  it('should not highlight first move initially', () => {
    const { container } = render(
      <ChessGuide
        chessTree={simpleChessTree}
      />
    );
    expectSquaresNotToBeHighlighted(container, ['e2', 'e4']);
  });

  it('should highlight first move after short wait', async () => {
    const { container } = render(
      <ChessGuide
        chessTree={simpleChessTree}
      />
    );
    await waitFor(() => {
      expectSquaresToBeHighlighted(container, ['e2', 'e4']);
    }, { timeout: 2000 });
  });

  it('should be able to play first move', () => {
    const { getByTestId } =
      render(
        <ChessGuide
          chessTree={simpleChessTree}
          userPlaysAs='white'
          renderExtraControlsForTesting
        />
      );
    const playNextMoveBtn = getByTestId(SELECT_BTN_TEST_ID);
    fireEvent.click(playNextMoveBtn);
    getByTestId('wP-e4');
  });


  it('should play first move when stepForwardBtn clicked', () => {
    const { container, getByTestId } =
      render(
        <ChessGuide
          chessTree={simpleChessTree}
        />
      );
    const stepForwardBtn = container.querySelector('[aria-label="step forward"]');
    fireEvent.click(stepForwardBtn);
    getByTestId('wP-e4');
  });

  it('should play computer move after user plays first move', async () => {
    const { getByTestId } =
      render(
        <ChessGuide
          chessTree={simpleChessTree}
          userPlaysAs='white'
          renderExtraControlsForTesting
        />
      );
    const playNextMoveBtn = getByTestId(SELECT_BTN_TEST_ID);
    fireEvent.click(playNextMoveBtn);
    getByTestId('wP-e4');
    await waitFor(() => {
      getByTestId('bP-e5');
    });
  });

  it('should not play computer move when stepForwardBtn clicked', () => {
    const { container, getByTestId } =
      render(
        <ChessGuide
          chessTree={simpleChessTree}
        />
      );
    const stepForwardBtn = container.querySelector('[aria-label="step forward"]');
    fireEvent.click(stepForwardBtn);
    getByTestId('wP-e4');
    expect(() => getByTestId('bP-e5')).toThrow();
  });

  it('should play computer move when stepForwardBtn clicked second time', () => {
    const { container, getByTestId } =
      render(
        <ChessGuide
          chessTree={simpleChessTree}
        />
      );
    const stepForwardBtn = container.querySelector('[aria-label="step forward"]');
    fireEvent.click(stepForwardBtn);
    fireEvent.click(stepForwardBtn);
    getByTestId('bP-e5');
  });

  it('should autoplay when alwaysAutoplay=true and stepForwardBtn clicked', async () => {
    const { container, getByTestId } = render(
        <ChessGuide
          chessTree={simpleChessTree}
          alwaysAutoplay={true}
        />
    );
    const stepForwardBtn = container.querySelector('[aria-label="step forward"]');
    fireEvent.click(stepForwardBtn);
    await waitFor(() => {
      getByTestId('wP-e4');
      getByTestId('bP-e5');
    }, { timeout: 1000 });
  });

  it('highlights second user move after user plays first move', async () => {
    const { container, getByTestId } =
      render(
        <ChessGuide
          chessTree={simpleChessTree}
          userPlaysAs='white'
          renderExtraControlsForTesting
        />
      );
    const playNextMoveBtn = getByTestId(SELECT_BTN_TEST_ID);
    fireEvent.click(playNextMoveBtn);
    await waitFor(() =>
      expectSquaresToBeHighlighted(container, ['g1', 'f3'])
    );
  });

  it('highlights second user move after stepForwardBtn clicked twice', async () => {
    const { container } =
      render(
        <ChessGuide
          chessTree={simpleChessTree}
        />
      );
    const stepForwardBtn = container.querySelector('[aria-label="step forward"]');
    fireEvent.click(stepForwardBtn);
    fireEvent.click(stepForwardBtn);
    await waitFor(() =>
      expectSquaresToBeHighlighted(container, ['g1', 'f3'])
    );
  });

  it('sets board orientation to black if `userPlaysAs` prop set to black', () => {
    const { getByTestId } =
      render(
        <ChessGuide
          chessTree={simpleChessTree}
          userPlaysAs={'black'}
        />
      );
    const whiteKing = getByTestId('wK-e1');
    const row: HTMLElement = whiteKing.parentElement.parentElement.parentElement;
    expect(row.previousSibling).toBeNull();
  });

  it('sets board orientation to white if `userPlaysAs` prop not set', () => {
    const { getByTestId } =
      render(
        <ChessGuide
          chessTree={simpleChessTree}
        />
      );
    const whiteKing = getByTestId('wK-e1');
    const row: HTMLElement = whiteKing.parentElement.parentElement.parentElement;
    expect(row.nextSibling).toBeNull();
  });

  it('sets board orientation to white if `userPlaysAs` set to white', () => {
    const { getByTestId } =
      render(
        <ChessGuide
          chessTree={simpleChessTree}
          userPlaysAs={'white'}
        />
      );
    const whiteKing = getByTestId('wK-e1');
    const row: HTMLElement = whiteKing.parentElement.parentElement.parentElement;
    expect(row.nextSibling).toBeNull();
  });

  it('autoplays first move if userPlaysAs="black"', async () => {
    const { getByTestId } = render(
        <ChessGuide
          chessTree={simpleChessTree}
          userPlaysAs='black'
        />
    );
    await waitFor(() => {
      getByTestId('wP-e4');
    }, { timeout: 1000 });
  });
});
