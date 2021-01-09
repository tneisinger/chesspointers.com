import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const chessTree = makeChessTree(
  [ 'd4', 'd5',
    'c4', 'e6',
    'Nc3', 'Nf6',
    'Bg5', 'Nbd7',
    'cxd5', 'exd5',
    'Nxd5', 'Nxd5',
    'Bxd8', 'Bb4+',
    'Qd2', 'Bxd2+',
    'Kxd2', 'Kxd8',
  ],
  []
);

const trap = new ChessTrap();
trap.name = 'Elephant'
trap.playedByWhite = false;
trap.chessTree = chessTree;

export default trap;
