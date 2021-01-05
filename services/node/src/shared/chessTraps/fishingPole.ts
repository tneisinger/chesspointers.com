import { ChessTree, ChessTrap } from '../chessTypes';
import { makeChessTree } from '../chessTree';

const branch_Qh1: ChessTree = makeChessTree(['Qh1#'], []);

const branch_Qh2: ChessTree = makeChessTree(['Qh2#'], []);

const trap: ChessTrap = {
  name: 'Fishing Pole',
  playedBy: 'black',
  moves: makeChessTree(
    [ 'e4', 'e5',
      'Nf3', 'Nc6',
      'Bb5', 'Nf6',
      'O-O', 'Ng4',
      'h3', 'h5',
      'hxg4', 'hxg4',
      'Ne1', 'Qh4',
      'f3', 'g3',
      'Qe2',
    ],
    [ branch_Qh2,
      branch_Qh1,
    ]
  )
}

export default trap;
