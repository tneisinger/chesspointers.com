import { ChessTrap } from '../chessTypes';
import { makeChessTree } from '../chessTree';

const trap: ChessTrap = {
  name: 'Elephant',
  playedBy: 'black',
  moves: makeChessTree(
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
  )
}

export default trap;
