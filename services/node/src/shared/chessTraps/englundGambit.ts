import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const Qc1_checkmate = {
  move: 'Qc1#',
  teachingPriority: 900,
};

const Qxe5 = {
  move: 'Qxe5',
  teachingPriority: -900,
};

const branch_Qxc3 = makeChessTree(
  // prettier-ignore
  [ 'Qxc3', Qc1_checkmate ],
  [],
);

const branch_Nxc3 = makeChessTree(
  // prettier-ignore
  [ 'Nxc3', 'Qxa1+',
    'Nd1',  'Nxe5',
    'Nxe5',  Qxe5,
  ],
  [],
);

const branch_Bxb4 = makeChessTree(
  // prettier-ignore
  [ 'Bxb4', 'Nxb4',
  ],
  [],
);

const branch_Qd2 = makeChessTree(
  // prettier-ignore
  [ 'Qd2', 'Bxc3' ],
  [branch_Qxc3, branch_Nxc3],
);

const Qb4_check = { move: 'Qb4+', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'd4',   'e5',
    'dxe5', 'Nc6',
    'Nf3',  'Qe7',
    'Bf4',   Qb4_check,
    'Bd2',  'Qxb2',
    'Bc3',  'Bb4',
  ],
  [branch_Qd2, branch_Bxb4],
);

const trap = new ChessTrap();
trap.fullName = 'The Englund Gambit Trap';
trap.shortName = 'Englund Gambit';
trap.playedByWhite = false;
trap.chessTree = chessTree;

export default trap;
