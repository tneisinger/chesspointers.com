import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const chessTree = makeChessTree(
  [ 'e4', 'e5',
    'Nf3', 'Nc6',
    'Bc4', 'd6',
    'Nc3', 'Bg4',
    'h3', 'Bh5',
    'Nxe5', 'Bxd1',
    'Bxf7+', 'Ke7',
    'Nd5#'
  ],
  []
);

const trap = new ChessTrap();
trap.name = 'Legal'
trap.playedByWhite = true;
trap.chessTree = chessTree;

export default trap;
