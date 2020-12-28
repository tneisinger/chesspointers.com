export type ChessNode = {
  move: string,
  children: ChessNode[],
};

export type ChessTrap = {
  playedBy: ('white' | 'black'),
  moves: ChessNode,
}

export const makeChessTree = (moves: string[], nodes: ChessNode[]): ChessNode => {
  let result: (null | ChessNode) = null;

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
