import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import ChessGuide, { HIGHLIGHTED_SQUARE_BOX_SHADOW } from './ChessGuide';
import { ChessSequence } from '../types/chess';

const highlightSquareStyle = `box-shadow: ${HIGHLIGHTED_SQUARE_BOX_SHADOW}`;

jest.useFakeTimers();

describe('<ChessGuide /> with simple chessSequence', () => {
  const firstMoveComment = 'This is the first move';
  const simpleChessSequence: ChessSequence = {
    endsInCheckmate: false,
    isPlayedByWhite: true,
    moves: [
      { move: 'e4',
        comment: firstMoveComment,
      },
      { move: 'e5' },
      { move: 'Nf3' },
      { move: 'Nc6' },
    ],
    finalComment: ''
  }

  it('should have a Chessboard component', () => {
    const { container } = render(<ChessGuide chessSequence={simpleChessSequence} />);
    expect(container.querySelector('[data-boardid="0"]')).not.toBeNull();
  });

  it('should show the welcome comment', () => {
    const { getByText } = render(<ChessGuide chessSequence={simpleChessSequence} />);
    expect(getByText("Welcome!")).toBeInTheDocument();
  });

  it('should show the first move comment after short wait', async () => {
    const { getByText } = render(<ChessGuide chessSequence={simpleChessSequence} />);
    await waitFor(() => getByText(firstMoveComment));
  });

  it('should not highlight first move start square initially', () => {
    const { container } = render(<ChessGuide chessSequence={simpleChessSequence} />);
    const e2Square = container.querySelector('[data-squareid="e2"]');
    expect(e2Square.firstChild).not.toHaveStyle(highlightSquareStyle);
  });

  it('should not highlight first move target square initially', () => {
    const { container } = render(<ChessGuide chessSequence={simpleChessSequence} />);
    const e4Square = container.querySelector('[data-squareid="e4"]');
    expect(e4Square.firstChild).not.toHaveStyle(highlightSquareStyle);
  });

  it('should highlight first move start square after short wait', async () => {
    const { container } = render(<ChessGuide chessSequence={simpleChessSequence} />);
    await waitFor(() => {
      const e2Square = container.querySelector('[data-squareid="e2"]');
      expect(e2Square.firstChild).toHaveStyle(highlightSquareStyle);
    }, { timeout: 2000 });
  });

  it('should highlight first move target square after short wait', async () => {
    const { container } = render(<ChessGuide chessSequence={simpleChessSequence} />);
    await waitFor(() => {
      const e4Square = container.querySelector('[data-squareid="e4"]');
      expect(e4Square.firstChild).toHaveStyle(highlightSquareStyle);
    }, { timeout: 2000 });
  });

  it('should play first move when stepForwardBtn clicked', () => {
    const { container, getByTestId } =
      render(<ChessGuide chessSequence={simpleChessSequence} />);
    const stepForwardBtn = container.querySelector('[aria-label="step forward"]');
    fireEvent.click(stepForwardBtn);
    getByTestId('wP-e4');
  });

  it('should not play computer move when stepForwardBtn clicked', () => {
    const { container, getByTestId } =
      render(<ChessGuide chessSequence={simpleChessSequence} />);
    const stepForwardBtn = container.querySelector('[aria-label="step forward"]');
    fireEvent.click(stepForwardBtn);
    getByTestId('wP-e4');
    expect(() => getByTestId('bP-e5')).toThrow();
  });

  it('should play computer move when stepForwardBtn clicked second time', () => {
    const { container, getByTestId } =
      render(<ChessGuide chessSequence={simpleChessSequence} />);
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

  // Note: I haven't been able to get tests to perform drag-and-drop events,
  // so I'm giving up on that for now.
  // Below is my last failed attempt to drag-and-drop in a test.
  /*
  it('should play move after click and drag', async () => {
    const { container, getByTestId } =
      render(<ChessGuide chessSequence={simpleChessSequence} />);
    const e2Pawn = getByTestId("wP-e2");
    const e4Square = container.querySelector('[data-squareid="e4"]');
    const dataTransfer = {
      dropEffect: 'move',
      effectAllowed: 'move',
      items: [e2Pawn],
      types: 'move',
    };
    fireEvent.dragStart(e2Pawn, { dataTransfer });
    fireEvent.dragEnter(e4Square, { dataTransfer });
    fireEvent.dragOver(e4Square, { dataTransfer });
    fireEvent.drop(e4Square, { dataTransfer });

    await waitFor(() => {
      getByTestId("wP-e4");
    });
  });
  */
});
