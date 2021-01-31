import { ChessTree } from '../chessTypes';
import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const branch_Rf1: ChessTree = makeChessTree(
  // prettier-ignore
  [ 'Rf1', 'Qxe4+',
    'Be2', 'Nf3#',
  ],
  [],
);

const branch_Nxh8: ChessTree = makeChessTree(
  // prettier-ignore
  [ 'Nxh8', 'Qxh1+',
    'Bf1',  'Qxe4+',
    'Be2',  'Bc5',
    'Nc3',  'Nf3+',
    'Kf1',  'Qh4',
    'Kg2',  'Qxf2+',
    'Kh1',  'Qxh2#',
  ],
  [],
);

const branch_g3: ChessTree = makeChessTree(['g3', 'Qxe5'], []);

const branch_Bxf7: ChessTree = makeChessTree(
  // prettier-ignore
  [
    'Bxf7+', 'Kd8',
    'Ng4',   'Nh6',
    'h3',    'Nxf7',
  ],
  [],
);

const branch_Nxf7: ChessTree = makeChessTree(['Nxf7', 'Qxg2'], [branch_Rf1, branch_Nxh8]);

const branch_Ng4 = makeChessTree(
  // prettier-ignore
  [
    'Ng4',  'd5',
    'Bxd5', 'Bxg4',
  ],
  [],
);

const Qg5 = { move: 'Qg5', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',  'e5',
    'Nf3', 'Nc6',
    'Bc4', 'Nd4',
    'Nxe5', Qg5,
  ],
  [branch_g3, branch_Nxf7, branch_Bxf7, branch_Ng4],
);

const trap = new ChessTrap();
trap.fullName = 'The Blackburne-Shilling Trap';
trap.shortName = 'Blackburne-Shilling';
trap.playedByWhite = false;
trap.chessTree = chessTree;

export default trap;
