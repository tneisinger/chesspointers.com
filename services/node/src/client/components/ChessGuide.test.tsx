import React from 'react';
import { shallow } from 'enzyme';
import Chessboard from "chessboardjsx";
import ChessGuide from './ChessGuide';
import { ChessSequence } from '../types/chess';

describe('<ChessGuide /> with basic chessSequence', () => {
  const basicChessSequence: ChessSequence = {
    endsInCheckmate: false,
    isPlayedByWhite: true,
    moves: [],
    finalComment: '',
  }

  const chessGuide = shallow(<ChessGuide chessSequence={basicChessSequence} />);

  it('should have a Chessboard component', () => {
    expect(chessGuide.find(Chessboard).length).toEqual(1);
  });
});
