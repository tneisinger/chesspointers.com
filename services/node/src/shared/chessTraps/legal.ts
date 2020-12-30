import { ChessTrap } from '../chessTypes';
import { makeChessTree } from '../chessTree';

const trap: ChessTrap = {
  name: 'Legal',
  playedBy: 'white',
  moves: makeChessTree(
    [ 'e4', 'e5',
      'Nf3', 'Nc6',
      'Bc4', 'd6',
      'Nc3', 'Bg4',
      'h3', 'Bh5',
      'Nxe5', 'Bxd1',
      'Bxf7', 'Ke7',
      'Nd5'
    ],
    []
  )
}

export default trap;
