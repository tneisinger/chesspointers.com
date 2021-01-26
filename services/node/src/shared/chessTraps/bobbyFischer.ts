import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const branch_Rxf7 = makeChessTree(
  [         'Rxf7',
    'Ne6',  'Qc7',
    'Nxc7', 'Nxc7',
  ],
  []
);

const branch_Kxf7 = makeChessTree(
  [         'Kxf7',
    'Ne6',  'Qc7',
    'Nxc7', 'Nxc7'
  ],
  []
);

const branch_Nxb3 = makeChessTree(
  [         'Nxb3',
    'exf6', 'Nxa1',
    'fxg7', 'Nxc2',
    'Qxc2', 'Kxg7',
  ],
  []
);

const branch_Ne8 = makeChessTree(
  [          'Ne8',
    'Bxf7+',
  ],
  [ branch_Kxf7, branch_Rxf7 ]
);

const Na5 = { move: 'Na5', isPreviewPosition: true };

const chessTree = makeChessTree(
  [ 'e4',   'c5',
    'Nf3',  'Nc6',
    'd4',   'cxd4',
    'Nxd4', 'g6',
    'Nc3',  'Bg7',
    'Be3',  'Nf6',
    'Bc4',  'O-O',
    'Bb3',   Na5,
    'e5',
  ],
  [ branch_Ne8, branch_Nxb3 ]
);

const trap = new ChessTrap();
trap.name = 'Bobby Fischer'
trap.playedByWhite = true;
trap.chessTree = chessTree;

export default trap;
