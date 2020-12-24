import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { shallow } from 'enzyme';
import Chessboard from "chessboardjsx";
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
    const chessGuide = shallow(<ChessGuide chessSequence={simpleChessSequence} />);
    expect(chessGuide.find(Chessboard).length).toEqual(1);
  });

  it('should show the welcome comment', () => {
    render(<ChessGuide chessSequence={simpleChessSequence} />);
    expect(screen.getByText("Welcome!")).toBeInTheDocument();
  });

  it('should show the first move comment after waiting two seconds', async () => {
    render(<ChessGuide chessSequence={simpleChessSequence} />);
    await waitFor(() => screen.getByText(firstMoveComment), { timeout: 2000 });
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
