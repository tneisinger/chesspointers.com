import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import ChessGuide, { HIGHLIGHTED_SQUARE_BOX_SHADOW } from './ChessGuide';
import { ChessSequence } from '../types/chess';

const highlightSquareStyle = `box-shadow: ${HIGHLIGHTED_SQUARE_BOX_SHADOW}`;

// This speeds up tests that include `waitFor`
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
});
