import { Square } from "chess.js";

export type PieceColor = 'white' | 'black';

export type ChessTree = {
  move: string,
  children: ChessTree[],

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
  isPreviewPosition?: boolean,
};

// This type is needed because the chessboardjsx package uses an object like this,
// but does not export a type for it.
export type ChessBoardMove = {
  sourceSquare: Square,
  targetSquare: Square,
  piece: string,
}

export type MovePair = {
  whiteMove: string,
  blackMove?: string,
}

export type CheckMateStatus = 'not in check' | 'check' | 'checkmate';
