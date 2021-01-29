import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const branch_Qxc3 = makeChessTree(
  [ 'Qxc3', 'Qc1#' ],
  []
);

const branch_Nxc3 = makeChessTree(
  [ 'Nxc3', 'Qxa1+',
    'Nd1',  'Nxe5',
    'Nxe5', 'Qxe5',
  ],
  []
);

const branch_Bxb4 = makeChessTree(
  [ 'Bxb4', 'Nxb4',
  ],
  []
);

const branch_Qd2 = makeChessTree(
  [ 'Qd2', 'Bxc3' ],
  [ branch_Qxc3,
    branch_Nxc3,
  ]
);

const Qb4_check = { move: 'Qb4+', isPreviewPosition: true };

const chessTree = makeChessTree(
  [ 'd4',   'e5',
    'dxe5', 'Nc6',
    'Nf3',  'Qe7',
    'Bf4',   Qb4_check,
    'Bd2',  'Qxb2',
    'Bc3',  'Bb4',
  ],
  [ branch_Qd2,
    branch_Bxb4,
  ]
);

const trap = new ChessTrap();
trap.fullName = 'The Englund Gambit Trap';
trap.shortName = 'Englund Gambit';
trap.playedByWhite = false;
trap.chessTree = chessTree;

export default trap;
