export type ChessTree = {
  move: string,
  children: ChessTree[],
};

export type ChessTrap = {
  name: string,
  playedBy: ('white' | 'black'),
  moves: ChessTree,
}
