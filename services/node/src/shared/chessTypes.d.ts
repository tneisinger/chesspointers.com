export type ChessNode = {
  move: string,
  children: ChessNode[],
};

type ChessTrap = {
  playedBy: ('white' | 'black'),
  moves: ChessNode,
}
