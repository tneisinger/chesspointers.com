import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const branch_e5 = makeChessTree(
  [          'e5',
    'Nxc7+', 'Ke7',
    'Qxb7',  'Qxb7',
    'Bc5#'
  ],
  []
);

const branch_Na6 = makeChessTree(
  [
             'Na6',
    'Qxb7',  'Qe4',
    'Qxa6',  'Qxe3+',
    'Kb1',   'Qc5',
    'Qb7',   'Bxd1',
    'Qxa8+', 'Kd7',
    'Nc3',
  ],
  []
);

const branch_Bxf3 = makeChessTree(
  [
             'Bxf3',
    'Nxc7#',
  ],
  []
);

const branch_Qg4 = makeChessTree(
  [          'Qg4',
    'O-O-O', 'Qxf3',
    'Nxf3',
  ],
  []
);

const branch_Qb4 = makeChessTree(
  [
             'Qb4',
    'O-O-O', 'Bg4',
    'Nb5',
  ],
  [
    branch_Na6,
    branch_Bxf3,
    branch_e5,
  ]
);

const chessTree = makeChessTree(
  [
    'd4',    'd5',
    'e4',    'dxe4',
    'Nc3',   'Nf6',
    'f3',    'exf3',
    'Qxf3',  'Qxd4',
    'Be3',
  ],
  [
    branch_Qb4,
    branch_Qg4,
  ]
);

const trap = new ChessTrap();
trap.name = 'Halosar'
trap.playedByWhite = true;
trap.chessTree = chessTree;

export default trap;
