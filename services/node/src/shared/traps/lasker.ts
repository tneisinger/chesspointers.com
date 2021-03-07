import { Trap } from '../entity/trap';
import { makeChessTree } from '../chessTree';

const Qxd1 = {
  move: 'Qxd1',
  teachingPriority: 900,
};

const Nc6 = {
  move: 'Nc6',
  teachingPriority: 800,
};

const branch_Ke1 = makeChessTree(
  // prettier-ignore
  [ 'Ke1', 'Qh4+',
    'Kd2',  Nc6,
  ],
  [],
);

const branch_Kf2 = makeChessTree(
  // prettier-ignore
  [ 'Kf2', 'Qxd1' ],
  [],
);

const fxg1 = { move: 'fxg1=N+', isPreviewPosition: true };

const branch_Ke2 = makeChessTree(['Ke2', fxg1], [branch_Ke1, branch_Kf2]);

const branch_Kxf2 = makeChessTree(['Kxf2', Qxd1], []);

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'd4',   'd5',
    'c4',   'e5',
    'dxe5', 'd4',
    'e3',   'Bb4+',
    'Bd2',  'dxe3',
    'Bxb4', 'exf2+',
  ],
  [branch_Ke2, branch_Kxf2],
);

const trap = new Trap();
trap.fullName = 'The Lasker Trap';
trap.shortName = 'Lasker';
trap.playedByWhite = false;
trap.chessTree = chessTree;

export default trap;
