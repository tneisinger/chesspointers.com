import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const chessTree = makeChessTree(
  [
    'e4', 'c6',
    'd4', 'd5',
    'Nc3', 'dxe4',
    'Nxe4', 'Nd7',
    'Qe2', 'Ngf6',
    'Nd6#',
  ],
  []
);

const trap = new ChessTrap();
trap.name = 'Karpov Smothering'
trap.playedByWhite = true;
trap.chessTree = chessTree;

export default trap;
