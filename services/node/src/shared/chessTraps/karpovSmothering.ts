import { ChessTrap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const Nd6_checkmate = { move: 'Nd6#', isPreviewPosition: true };

const chessTree = makeChessTree(
  [
    'e4',           'c6',
    'd4',           'd5',
    'Nc3',          'dxe4',
    'Nxe4',         'Nd7',
    'Qe2',          'Ngf6',
     Nd6_checkmate,
  ],
  []
);

const trap = new ChessTrap();
trap.name = 'Karpov Smothering'
trap.playedByWhite = true;
trap.chessTree = chessTree;

export default trap;
