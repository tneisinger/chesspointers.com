import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const branch_Kh1 = makeChessTree(
  [
    'Kh1',  'Nf2+',
    'Kg1',  'Qh1#'
  ],
  []
);

const branch_Kh2 = makeChessTree(
  [
    'Kh2',  'Nf2+',
    'Kg1',  'Qh1#'
  ],
  []
);

const branch_Qf3 = makeChessTree(
  [
    'Qf3', 'Ne5',
    'Qe2', 'Qh4',
  ],
  []
);

const branch_OO = makeChessTree(
  [
    'O-O',  'Qh4',
    'h3',   'Nxf2',
    'Qf3',  'Nxh3+',
  ],
  [
    branch_Kh1,
    branch_Kh2,
  ]
);

const Nc3 = { move: 'Nc3', isPreviewPosition: true};

const chessTree = makeChessTree(
  [
    'e4',   'e5',
    'Nf3',  'Nf6',
    'Nxe5', 'Nc6',
    'Nxc6', 'dxc6',
     Nc3,   'Bc5',
    'Bc4',  'Ng4',
  ],
  [
    branch_OO,
    branch_Qf3,
  ]
);

const trap = new ChessTrap();
trap.fullName = 'Stafford Trap #3';
trap.shortName = 'Stafford 3';
trap.playedByWhite = false;
trap.chessTree = chessTree;

export default trap;
