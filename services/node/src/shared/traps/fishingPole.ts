import { Trap } from '../entity/trap';
import { makeChessTree } from '../chessTree';

const Ng4 = { move: 'Ng4', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'e5',
    'Nf3',  'Nc6',
    'Bb5',  'Nf6',
    'O-O',   Ng4,
    'h3',   'h5',
    'hxg4', 'hxg4',
    'Ne1',  'Qh4',
    'f3',   'g3',
    'Rf2',  'Qh1#',
  ],
  [],
);

const trap = new Trap();
trap.fullName = 'The Fishing Pole Trap';
trap.shortName = 'Fishing Pole';
trap.playedByWhite = false;
trap.chessTree = chessTree;

export default trap;
