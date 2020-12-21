export type ChessMove = {
  move: string,
  comment?: string
}

export type ChessSequence = {
  endsInCheckmate: boolean,
  isPlayedByWhite: boolean,
  moves: ChessMove[],
  finalComment: string
}
