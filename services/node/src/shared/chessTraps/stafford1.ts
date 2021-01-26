import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const branch_Bxd8 = makeChessTree(
  [
    'Bxd8', 'Bxf2+',
    'Ke2',  'Bg4#',
  ],
  []
);

const branch_Be3 = makeChessTree(
  [
    'Be3',  'Bxe3',
    'fxe3', 'Qh4+',
    'g3',   'Nxg3',
    'hxg3', 'Qxh1',
  ],
  []
);

const branch_Qe2 = makeChessTree(
  [
    'Qe2',  'Qxg5',
    'Qxe4+', 'Kd8',
    'Be2', 'Qc1+',
    'Bd1', 'Re8',
  ],
  []
);

const d3 = { move: 'd3', isPreviewPosition: true };

const chessTree = makeChessTree(
  [ 'e4',   'e5',
    'Nf3',  'Nf6',
    'Nxe5', 'Nc6',
    'Nxc6', 'dxc6',
     d3,    'Bc5',
    'Bg5',  'Nxe4',
  ],
  [
    branch_Bxd8,
    branch_Be3,
    branch_Qe2,
  ]
);

const trap = new ChessTrap();
trap.name = 'Stafford 1'
trap.playedByWhite = false;
trap.chessTree = chessTree;

export default trap;
