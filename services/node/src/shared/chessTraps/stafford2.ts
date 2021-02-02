import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const Qxd1 = {
  move: 'Qxd1',
  teachingPriority: 900,
};

const Qe4_check = {
  move: 'Qe4+',
  teachingPriority: -900,
};

const branch_Kxf2 = makeChessTree(['Kxf2', Qxd1], []);

const branch_Ke2 = makeChessTree(
  // prettier-ignore
  [
    'Ke2', 'Bg4+',
    'Kxf2', 'Qxd1',
  ],
  [],
);

const branch_d3 = makeChessTree(
  // prettier-ignore
  [
    'd3',   'Bc5',
    'dxe4', 'Bxf2+',
  ],
  [branch_Kxf2, branch_Ke2],
);

const branch_d4 = makeChessTree(
  // prettier-ignore
  [
    'd4',   'Qh4',
    'g3',   'Nxg3',
    'fxg3',  Qe4_check,
  ],
  [],
);

const e5 = { move: 'e5', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'e5',
    'Nf3',  'Nf6',
    'Nxe5', 'Nc6',
    'Nxc6', 'dxc6',
     e5,    'Ne4',
  ],
  [branch_d3, branch_d4],
);

const trap = new ChessTrap();
trap.fullName = 'Stafford Trap #2';
trap.shortName = 'Stafford 2';
trap.playedByWhite = false;
trap.chessTree = chessTree;

export default trap;
