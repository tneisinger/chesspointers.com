import { Square } from 'chess.js';

export type PieceColor = 'white' | 'black';

export interface HasTeachingPriority {
  teachingPriority: number;
}

export interface ChessTreeLine extends HasTeachingPriority {
  line: string[];
}

export interface ChessTreeMove extends Partial<HasTeachingPriority> {
  move: string;
  /*
  // Use `isPreviewPosition` to define which point in the tree should be used as the
  // 'freeze framed' position. When a tree is given to the ChessTreePreview component, if
  // a node has this property set to true, that position will be displayed when the pieces
  // aren't moving. The 'isPreviewPosition' node should be set on a position that could be
  // thought of as the most identifiable position of the tree. THERE SHOULD ONLY BE ONE
  // NODE IN A CHESSTREE THAT HAS THIS VALUE SET TO TRUE.
  //
  // ChessTrees do not HAVE to have a
  // node with this value set. If a tree does not have a 'isPreviewPosition' node, then
  // the ChessTreePreview component will pick a position somewhere in the middle of the
  // tree.
  */
  isPreviewPosition?: boolean;
}

export interface ChessTree extends ChessTreeMove {
  children: ChessTree[];
}

// This type is needed because the chessboardjsx package uses an object like this,
// but does not export a type for it.
export type ChessBoardMove = {
  sourceSquare: Square;
  targetSquare: Square;
  piece: string;
};

export type MovePair = {
  whiteMove: string;
  blackMove?: string;
};

export enum ChessOpening {
  CaroKannDefense = 'Caro-Kann Defense',
  ItalianGame = 'Italian Game',
  KingsPawn = "King's Pawn",
  PetrovsDefense = "Petrov's Defense",
  QueensPawn = "Queen's Pawn",
  QueensGambit = "Queen's Gambit",
  RuyLopez = 'Ruy López',
  SicilianDefense = 'Sicilian Defense',
}

export enum OpeningMoves {
  e4 = 'e4',
  e4_e5 = 'e4    e5',
  e4_c5 = 'e4    c5',
  d4 = 'd4',
  d4_Nf6 = 'd4    Nf6',
  d4_d5 = 'd4    d5',
}

export type FenParts = {
  piecePlacement: string;
  activeColor: PieceColor;
  castling: string;
  enPassantSquare: string;
  halfMoveClock: number;
  fullMoveNumber: number;
};

export enum PromotionPiece {
  Bishop = 'b',
  Knight = 'n',
  Rook = 'r',
  Queen = 'q',
}
