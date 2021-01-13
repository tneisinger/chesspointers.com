import { Square } from "chess.js";

export type PieceColor = 'white' | 'black';

export type ChessTree = {
  move: string,
  children: ChessTree[],
};

// This type is needed because the chessboardjsx package uses an object like this,
// but does not export a type for it.
export type ChessBoardMove = {
  sourceSquare: Square,
  targetSquare: Square,
  piece: string,
}

