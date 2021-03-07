import { Trap } from '../entity/trap';
import { makeChessTree } from '../chessTree';

const branch_g3 = makeChessTree(
  // prettier-ignore
  [ 'g3', 'Nxg3',
    'hxg3', 'Qd4+',
    'Kf3',  'O-O',
  ],
  [],
);

const branch_Qf3_a = makeChessTree(
  // prettier-ignore
  [ 'Qf3',  'Nf6',
    'Nxh8', 'Nd4',
    'Qf1',  'd5',
    'Bb3',  'Ng4+',
    'Kd3',  'Nf2+',
    'Kc3',  'Ne2+',
    'Qxe2', 'Qd4#',
  ],
  [],
);

const Ke3 = { move: 'Ke3', teachingPriority: 700 };

const branch_Ke3 = makeChessTree(
  // prettier-ignore
  [Ke3,  'Qh4'],
  [branch_g3, branch_Qf3_a],
);

const branch_Kg1 = makeChessTree(
  //prettier-ignore
  [ 'Kg1',  'Qh4',
    'g3',   'Nxg3',
    'hxg3', 'Qxg3+',
    'Kf1',  'Rf8',
    'Nc3',  'd5',
    'Bxd5', 'Bh3+',
  ],
  [],
);

const branch_Qe2 = makeChessTree(
  // prettier-ignore
  [ 'Qe2', 'Rf8',
    'Nc3',  'Ng3+',
    'hxg3', 'Qxh1+',
  ],
  [],
);

const branch_Qf3_b = makeChessTree(
  // prettier-ignore
  [ 'Qf3',  'Nd4',
    'Qe3',  'Nxc2',
    'Qe2',  'Ng3+',
    'hxg3', 'Qxh1+',
  ],
  [],
);

const Kf1 = { move: 'Kf1', teachingPriority: 900 };

const branch_Kf1_b = makeChessTree(
  // prettier-ignore
  [Kf1,  'Qh4'],
  [branch_Qe2, branch_Qf3_b],
);

const branch_Kf3 = makeChessTree(
  // prettier-ignore
  [ 'Kf3',  'Qf6+',
    'Kxe4', 'Qf4+',
    'Kd3',  'd5',
    'Bxd5', 'Qd4+',
    'Ke2', 'Qxd5',
    'Nxh8', 'Bg4+',
  ],
  [],
);

const branch_Ke1 = makeChessTree(
  // prettier-ignore
  [ 'Ke1',  'Qh4+',
    'g3',   'Nxg3',
    'hxg3', 'Qxh1+',
    'Bf1',  'O-O',
  ],
  [],
);

const Kxf2 = { move: 'Kxf2', teachingPriority: 500 };

const branch_Kxf2 = makeChessTree(
  // prettier-ignore
  [ Kxf2, 'Nxe4+',
  ],
  [branch_Kf3, branch_Kf1_b, branch_Kg1, branch_Ke3, branch_Ke1],
);

const branch_Bxd5 = makeChessTree(
  // prettier-ignore
  [ 'Bxd5', 'Bg4' ],
  [],
);

const branch_exd5 = makeChessTree(
  // prettier-ignore
  [ 'exd5', 'Nd4',
    'c3',   'Bg4',
    'Qa4+', 'Nd7',
    'cxd4', 'Qf6',
    'dxe5', 'Qf4',
    'g3',   'Bxg3+',
    'Kg1',  'Qf2#',
  ],
  [],
);

const branch_Kf1_a = makeChessTree(
  // prettier-ignore
  [ 'Kf1',  'Qe7',
    'Nxh8',  'd5',
  ],
  [branch_Bxd5, branch_exd5],
);

const Bc5 = { move: 'Bc5', isPreviewPosition: true };

const branch_Nxf7 = makeChessTree(
  // prettier-ignore
  [ 'Nxf7', 'Bxf2+' ],
  [branch_Kxf2, branch_Kf1_a],
);

const Bxf7_check = { move: 'Bxf7+', teachingPriority: -900 };

const branch_Bxf7_check = makeChessTree(
  // prettier-ignore
  [  Bxf7_check, 'Ke7',
    'Bb3',       'Rf8',
    'O-O',       'Qe8',
    'Nc3',       'd6',
    'd3',        'Qg6',
    'Nf3',       'Bg4',
  ],
  [],
);

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'e5',
    'Nf3',  'Nc6',
    'Bc4',  'Nf6',
    'Ng5',   Bc5,
  ],
  [branch_Nxf7, branch_Bxf7_check],
);

const trap = new Trap();
trap.fullName = 'The Traxler Counter Attack';
trap.shortName = 'Traxler';
trap.playedByWhite = false;
trap.chessTree = chessTree;

export default trap;
