import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const Bg4_checkmate = {
  move: 'Bg4#',
  teachingPriority: 900,
};

const dxe4 = {
  move: 'dxe4',
  teachingPriority: 800,
};

const Re8 = {
  move: 'Re8',
  teachingPriority: -900,
};

const branch_Bxd8 = makeChessTree(
  // prettier-ignore
  [
    'Bxd8', 'Bxf2+',
    'Ke2',  Bg4_checkmate,
  ],
  [],
);

const branch_Be3 = makeChessTree(
  // prettier-ignore
  [
    'Be3',  'Bxe3',
    'fxe3', 'Qh4+',
    'g3',   'Nxg3',
    'hxg3', 'Qxh1',
  ],
  [],
);

const branch_Qe2 = makeChessTree(
  // prettier-ignore
  [
    'Qe2',  'Qxg5',
    'Qxe4+', 'Kd8',
    'Be2', 'Qc1+',
    'Bd1',  Re8,
  ],
  [],
);

const branch_dxe4 = makeChessTree(
  // prettier-ignore
  [
     dxe4, 'Bxf2+',
    'Ke2',  'Bg4+',
    'Kxf2', 'Qxd1',
  ],
  [],
);

const d3 = { move: 'd3', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'e5',
    'Nf3',  'Nf6',
    'Nxe5', 'Nc6',
    'Nxc6', 'dxc6',
     d3,    'Bc5',
    'Bg5',  'Nxe4',
  ],
  [branch_Bxd8, branch_Be3, branch_Qe2, branch_dxe4],
);

const trap = new ChessTrap();
trap.fullName = 'Stafford Trap #1';
trap.shortName = 'Stafford 1';
trap.playedByWhite = false;
trap.chessTree = chessTree;

export default trap;
