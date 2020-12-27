import { ChessNode, ChessTrap } from '../chessTypes';

const branch_Rf1: ChessNode = {
  move: 'Rf1',
  children: [{
    move: 'Qxe4+',
    children: [{
      move: 'Be2',
      children: [{
        move: 'Nf3#',
        children: [],
      }],
    }],
  }],
}

const branch_Nxh8: ChessNode = {
  move: 'Nxh8',
  children: [{
    move: 'Qxh1+',
    children: [{
      move: 'Bf1',
      children: [{
        move: 'Qe4+',
        children: [{
          move: 'Be2',
          children: [{
            move: 'Bc5',
            children: [],
          }],
        }],
      }],
    }],
  }],
}


const branch_g3: ChessNode = {
  move: 'g3',
  children: [{
    move: 'Qxe5',
    children: []
  }],
}

const branch_Bxf7: ChessNode = {
  move: 'Bxf7+',
  children: [{
    move: 'Kd8',
    children: []
  }],
}

const branch_Nxf7: ChessNode = {
  move: 'Nxf7',
  children: [{
    move: 'Qxg2',
    children: [
      branch_Rf1,
      branch_Nxh8,
    ],
  }],
}

export const trap: ChessTrap = {
  playedBy: 'black',
  moves: {
    move: 'e4',
    children: [{
      move: 'e5',
      children: [{
        move: 'Nf3',
        children: [{
          move: 'Nc6',
          children: [{
            move: 'Bc4',
            children: [{
              move: 'Nd4',
              children: [{
                move: 'Nxe5',
                children: [{
                  move: 'Qg5',
                  children: [
                    branch_g3,
                    branch_Nxf7,
                    branch_Bxf7,
                  ],
                }],
              }],
            }],
          }],
        }],
      }],
    }],
  }
}
