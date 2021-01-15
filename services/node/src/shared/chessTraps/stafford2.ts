import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const branch_Kxf2 = makeChessTree(
  [
    'Kxf2', 'Qxd1',
  ],
  []
);

const branch_Ke2 = makeChessTree(
  [
    'Ke2', 'Bg4+',
    'Kxf2', 'Qxd1',
  ],
  []
);

const branch_d3_2 = makeChessTree(
  [
    'd3',   'Bc5',
    'dxe4', 'Bxf2+',
  ],
  [
    branch_Kxf2,
    branch_Ke2,
  ]
);

const branch_d4 = makeChessTree(
  [
    'd4', 'Qh4',
    'g3', 'Nxg3',
    'fxg3', 'Qe4+',
  ],
  []
);

const chessTree = makeChessTree(
  [ 'e4',   'e5',
    'Nf3',  'Nf6',
    'Nxe5', 'Nc6',
    'Nxc6', 'dxc6',
    'e5',   'Ne4',
  ],
  [
    branch_d3_2,
    branch_d4,
  ]
);

const trap = new ChessTrap();
trap.name = 'Stafford 2'
trap.playedByWhite = false;
trap.chessTree = chessTree;

export default trap;
