import { ChessTree, ChessTrap, makeChessTree } from '../chessTypes';

const branch_Rf1: ChessTree = makeChessTree(
  [ 'Rf1', 'Qxe4+',
    'Be2', 'Nf3#',
  ], []
);

const branch_Nxh8: ChessTree = makeChessTree(
  [ 'Nxh8', 'Qxh1+',
    'Bf1', 'Qe4+',
    'Be2', 'Bc5',
  ], []
);

const branch_g3: ChessTree = makeChessTree(
  [ 'g3', 'Qxe5'],
  []
);

const branch_Bxf7: ChessTree = makeChessTree(
  [ 'Bxf7+', 'Kd8'],
  []
);

const branch_Nxf7: ChessTree = makeChessTree(
  [ 'Nxf7', 'Qxg2'],
  [
    branch_Rf1,
    branch_Nxh8,
  ]
);

const trap: ChessTrap = {
  playedBy: 'black',
  moves: makeChessTree(
    [ 'e4', 'e5',
      'Nf3', 'Nc6',
      'Bc4', 'Nd4',
      'Nxe5', 'Qg5',
    ],
    [ branch_g3,
      branch_Nxf7,
      branch_Bxf7
    ]
  )
}

export default trap;
