import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const Nxc7_checkmate = {
  move: 'Nxc7#',
  teachingPriority: 900,
};

const Bc5_checkmate = {
  move: 'Bc5#',
  teachingPriority: 800,
};

const Nc3 = {
  move: 'Nc3',
  teachingPriority: -800,
};

const Nxf3 = {
  move: 'Nxf3',
  teachingPriority: -900,
};

const branch_e5 = makeChessTree(
  // prettier-ignore
  [                'e5',
    'Nxc7+',       'Ke7',
    'Qxb7',        'Qxb7',
     Bc5_checkmate
  ],
  [],
);

const branch_Na6 = makeChessTree(
  // prettier-ignore
  [
             'Na6',
    'Qxb7',  'Qe4',
    'Qxa6',  'Qxe3+',
    'Kb1',   'Qc5',
    'Qb7',   'Bxd1',
    'Qxa8+', 'Kd7',
     Nc3,
  ],
  [],
);

const branch_Bxf3 = makeChessTree(
  // prettier-ignore
  [
                    'Bxf3',
    Nxc7_checkmate,
  ],
  [],
);

const branch_Qg4 = makeChessTree(
  // prettier-ignore
  [          'Qg4',
    'O-O-O', 'Qxf3',
     Nxf3,
  ],
  [],
);

const Nb5 = { move: 'Nb5', isPreviewPosition: true };

const branch_Qb4 = makeChessTree(
  // prettier-ignore
  [
             'Qb4',
    'O-O-O', 'Bg4',
     Nb5,
  ],
  [branch_Na6, branch_Bxf3, branch_e5],
);

const chessTree = makeChessTree(
  // prettier-ignore
  [
    'd4',    'd5',
    'e4',    'dxe4',
    'Nc3',   'Nf6',
    'f3',    'exf3',
    'Qxf3',  'Qxd4',
    'Be3',
  ],
  [branch_Qb4, branch_Qg4],
);

const trap = new ChessTrap();
trap.fullName = 'The Halosar Trap';
trap.shortName = 'Halosar';
trap.playedByWhite = true;
trap.chessTree = chessTree;

export default trap;
