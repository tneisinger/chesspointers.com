import { Opening } from '../entity/opening';
import { makeChessTree } from '../chessTree';

const Nc3 = { move: 'Nc3', isPreviewPosition: true };

const branch_Nc6 = makeChessTree(
  // prettier-ignore
  [        'Nc6',
    'Bc4', 'Nf6',
    'd3',
  ],
  [],
);

const branch_Nf6 = makeChessTree(
  // prettier-ignore
  [         'Nf6',
    'd3',
  ],
  [],
);

const branch_Bc5 = makeChessTree(
  // prettier-ignore
  [        'Bc5',
    'Qh5', 'Qe7',
  ],
  [],
);

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'e5',
     Nc3,
  ],
  [branch_Nc6, branch_Nf6, branch_Bc5],
);

const trap = new Opening();
trap.fullName = 'The Vienna Game';
trap.shortName = 'Vienna';
trap.chessTree = chessTree;

export default trap;
