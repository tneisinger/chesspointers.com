import { Trap } from '../entity/chessTrap';
import { makeChessTree } from '../chessTree';

const Nd6_checkmate = { move: 'Nd6#', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [
    'e4',           'c6',
    'd4',           'd5',
    'Nc3',          'dxe4',
    'Nxe4',         'Nd7',
    'Qe2',          'Ngf6',
     Nd6_checkmate,
  ],
  [],
);

const trap = new Trap();
trap.fullName = 'The Karpov Smothering Trap';
trap.shortName = 'Karpov Smothering';
trap.playedByWhite = true;
trap.chessTree = chessTree;

export default trap;
