import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const branch_Ke1 = makeChessTree(
  [ 'Ke1', 'Qh4+',
    'Kd2', 'Qd4+',
  ],
  []
);

const branch_Kf2 = makeChessTree(
  [ 'Kf2', 'Qxd1' ],
  []
);

const fxg1 = { move: 'fxg1=N+', isPreviewPosition: true };

const branch_Ke2 = makeChessTree(
  [ 'Ke2', fxg1 ],
  [ branch_Ke1,
    branch_Kf2,
  ]
);

const branch_Kxf2 = makeChessTree(
  [ 'Kxf2', 'Qxd1' ],
  []
);

const chessTree = makeChessTree(
  [ 'd4',   'd5',
    'c4',   'e5',
    'dxe5', 'd4',
    'e3',   'Bb4+',
    'Bd2',  'dxe3',
    'Bxb4', 'exf2+',
  ],
  [ branch_Ke2,
    branch_Kxf2,
  ]
);

const trap = new ChessTrap();
trap.name = 'Lasker'
trap.playedByWhite = false;
trap.chessTree = chessTree;

export default trap;
