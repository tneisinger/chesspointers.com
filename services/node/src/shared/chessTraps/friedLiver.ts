/* eslint-disable */
import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const branch_Nd4 = makeChessTree(
  [         'Nd4',
    'Bxd5+',
  ],
  []
);

const branch_Nb4 = makeChessTree(
  [
           'Nb4',
    'O-O', 'c6',
    'd4',  'exd4',
    'Ne4',
  ],
  []
);

const branch_Ne7 = makeChessTree(
  [
             'Ne7',
    'd4',    'exd4',
    'Nxd5',  'Nxd5',
    'Qe4+',  'Kd6',
    'Qxd5+', 'Ke7',
    'Bg5+',
  ],
  []
);

const branch_Ke6 = makeChessTree(
  [          'Ke6',
    'Nc3',
  ],
  [
    branch_Nd4,
    branch_Nb4,
    branch_Ne7
  ]
)

const Qxe6_checkmate = {
  move: 'Qxe6#',
  teachingPriority: 10,
}

const branch_Kg8 = makeChessTree(
  [                  'Kg8',
    'Bxd5+',         'Qxd5',
    'Qxd5+',         'Be6',
     Qxe6_checkmate,
  ],
  []
);

const Nxh8 = {
  move: 'Nxh8',
  teachingPriority: -5,
}

const branch_Na5 = makeChessTree(
  [          'Na5',
    'Bb5+',   'c6',
    'dxc6',  'bxc6',
    'Qf3',   'cxb5',
    'Qxa8',  'Bb7',
    'Qxd8+', 'Kxd8',
    'Nxf7+', 'Ke8',
     Nxh8,
  ],
  []
);

const branch_Nxd5 = makeChessTree(
  [
            'Nxd5',
    'Nxf7', 'Kxf7',
    'Qf3+',
  ],
  [
    branch_Ke6,
    branch_Kg8,
  ]
);

const branch_d5 = makeChessTree(
  [         'd5',
    'exd5',
  ],
  [
    branch_Nxd5,
    branch_Na5,
  ]

);

const Bb3 = { move: 'Bb3', teachingPriority: -10 };

const branch_Bc5 = makeChessTree(
  [          'Bc5',
    'Bxf7+', 'Ke7',
     Bb3,
  ],
  []
);

const Ng5 = { move: 'Ng5', isPreviewPosition: true };

const chessTree = makeChessTree(
  [ 'e4',   'e5',
    'Nf3',  'Nc6',
    'Bc4',  'Nf6',
     Ng5,
  ],
  [ branch_d5, branch_Bc5]
);

const trap = new ChessTrap();
trap.fullName = 'The Fried Liver Attack'
trap.shortName = 'Fried Liver'
trap.playedByWhite = true;
trap.chessTree = chessTree;

export default trap;
