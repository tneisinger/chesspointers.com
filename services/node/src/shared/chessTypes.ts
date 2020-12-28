export type ChessTree = {
  move: string,
  children: ChessTree[],
};

export type ChessTrap = {
  playedBy: ('white' | 'black'),
  moves: ChessTree,
}

export const makeChessTree = (moves: string[], nodes: ChessTree[]): ChessTree => {
  let result: (null | ChessTree) = null;

  moves.reverse().forEach((move, idx) => {
    if (idx === 0) {
      result = {
        move: move,
        children: nodes,
      }
    } else {
      result = {
        move: move,
        children: [result]
      }
    }
  });

  return result;
}
