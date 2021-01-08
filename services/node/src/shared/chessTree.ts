import { Chess } from "chess.js";
import { ChessTree } from './chessTypes';

export const makeChessTree = (moves: string[], nodes: ChessTree[]): ChessTree => {
  let result: (null | ChessTree) = null;

  const movesCopy = [...moves];

  movesCopy.reverse().forEach((move, idx) => {
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

export const getUniquePaths = (tree: ChessTree, prePath: string[] = []): string[][] => {
  let paths = [];
  if (prePath.length === 0 && tree.move !== '') {
    prePath.push(tree.move);
  }
  if (tree.children.length > 0) {
    tree.children.forEach((childTree) => {
      // To define a ChessTree that allows for multiple first move options, the root node
      // should have its 'move' value set to the empty string, and have multiple children.
      // This means that the move of a node can only be the empty string if it is the root
      // node of the ChessTree. If we find a child node where move === '', throw an error
      if (childTree.move === '') {
        throw new Error("Empty move strings are only allowed at the root of a ChessTree");
      }
      const newPath = [...prePath, childTree.move];
      const deeperPaths = getUniquePaths(childTree, newPath);
      if (deeperPaths.length > 0) {
        deeperPaths.forEach((p) => paths.push(p));
      } else {
        paths.push(newPath);
      }
    });
  }

  return paths;
}

export const validateChessTree = (
  tree: ChessTree,
): void => {
  const paths = getUniquePaths(tree);
  paths.forEach(path => {
    const game = new Chess();
    path.forEach(move => {
      if (move === '') {
        throw new Error('Empty move strings are only allowed at the root of ChessTrees');
      }
      if (!game.move(move)) throw new Error(`Invalid move: ${move}`);
    });
  });
}
