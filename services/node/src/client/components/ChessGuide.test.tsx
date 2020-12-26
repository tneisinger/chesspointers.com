import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import ChessGuide, {
  HIGHLIGHTED_SQUARE_BOX_SHADOW
} from './ChessGuide';
import { ChessSequence } from '../types/chess';

const highlightSquareStyle = `box-shadow: ${HIGHLIGHTED_SQUARE_BOX_SHADOW}`;

jest.useFakeTimers();

const expectSquaresToBeHighlighted = (container: Element, squares: string[]) => {
  squares.forEach((square) => {
    const squareElem = container.querySelector(`[data-squareid="${square}"]`);
    expect(squareElem.firstChild).toHaveStyle(highlightSquareStyle);
  });
};

const expectSquaresNotToBeHighlighted = (container: Element, squares: string[]) => {
  squares.forEach((square) => {
    const squareElem = container.querySelector(`[data-squareid="${square}"]`);
    expect(squareElem.firstChild).not.toHaveStyle(highlightSquareStyle);
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

describe('<ChessGuide /> with simple chessSequence', () => {
  const firstMoveComment = 'This is the first move';
  const thirdMoveComment = 'This is the third move';
  const simpleChessSequence: ChessSequence = {
    endsInCheckmate: false,
    isPlayedByWhite: true,
    moves: [
      { move: 'e4',
        comment: firstMoveComment,
      },
      { move: 'e5' },
      { move: 'Nf3',
        comment: thirdMoveComment,
      },
      { move: 'Nc6' },
    ],
    finalComment: ''
  }

  it('should have a Chessboard component', () => {
    const { container } = render(
      <ChessGuide
        chessSequence={simpleChessSequence}
      />
    );
    expect(container.querySelector('[data-boardid="0"]')).not.toBeNull();
  });

  it('should not highlight first move initially', () => {
    const { container } = render(
      <ChessGuide
        chessSequence={simpleChessSequence}
      />
    );
    expectSquaresNotToBeHighlighted(container, ['e2', 'e4']);
  });

  it('should highlight first move after short wait', async () => {
    const { container } = render(
      <ChessGuide
        chessSequence={simpleChessSequence}
      />
    );
    await waitFor(() => {
      expectSquaresToBeHighlighted(container, ['e2', 'e4']);
    }, { timeout: 2000 });
  });

  it('should play first move when stepForwardBtn clicked', () => {
    const { container, getByTestId } =
      render(
        <ChessGuide
          chessSequence={simpleChessSequence}
        />
      );
    const stepForwardBtn = container.querySelector('[aria-label="step forward"]');
    fireEvent.click(stepForwardBtn);
    getByTestId('wP-e4');
  });

  it('should not play computer move when stepForwardBtn clicked', () => {
    const { container, getByTestId } =
      render(
        <ChessGuide
          chessSequence={simpleChessSequence}
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
          chessSequence={simpleChessSequence}
        />
      );
    const stepForwardBtn = container.querySelector('[aria-label="step forward"]');
    fireEvent.click(stepForwardBtn);
    fireEvent.click(stepForwardBtn);
    getByTestId('bP-e5');
  });

  it('should autoplay when prop true and stepForwardBtn clicked', async () => {
    const { container, getByTestId } = render(
        <ChessGuide
          chessSequence={simpleChessSequence}
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

  it('highlights third move after stepForwardBtn clicked twice', async () => {
    const { container } =
      render(
        <ChessGuide
          chessSequence={simpleChessSequence}
        />
      );
    const stepForwardBtn = container.querySelector('[aria-label="step forward"]');
    fireEvent.click(stepForwardBtn);
    fireEvent.click(stepForwardBtn);
    await waitFor(() =>
      expectSquaresToBeHighlighted(container, ['g1', 'f3'])
    );
  });

  it('sets board orientation to black if given that property', () => {
    const { getByTestId } =
      render(
        <ChessGuide
          chessSequence={simpleChessSequence}
          orientation={'black'}
        />
      );
    const whiteKing = getByTestId('wK-e1');
    const row: HTMLElement = whiteKing.parentElement.parentElement.parentElement;
    expect(row.previousSibling).toBeNull();
  });

  it('sets board orientation to white if given that property', () => {
    const { getByTestId } =
      render(
        <ChessGuide
          chessSequence={simpleChessSequence}
          orientation={'white'}
        />
      );
    const whiteKing = getByTestId('wK-e1');
    const row: HTMLElement = whiteKing.parentElement.parentElement.parentElement;
    expect(row.nextSibling).toBeNull();
  });

  it('sets board orientation to white if not given orientation prop', () => {
    const { getByTestId } =
      render(
        <ChessGuide
          chessSequence={simpleChessSequence}
        />
      );
    const whiteKing = getByTestId('wK-e1');
    const row: HTMLElement = whiteKing.parentElement.parentElement.parentElement;
    expect(row.nextSibling).toBeNull();
  });
});
