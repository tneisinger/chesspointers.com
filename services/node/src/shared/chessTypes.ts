export type ChessTree = {
  move: string,
  children: ChessTree[],
};

export type ChessTrap = {
  playedBy: ('white' | 'black'),
  moves: ChessTree,
}
