import { Chess } from "chess.js";
import { ChessTree } from './chessTypes';
import { areChessMovesEquivalent } from './utils';

export const makeChessTree = (moves: string[], childTrees: ChessTree[]): ChessTree => {
  let result: ChessTree = { move: '', children: []};

  if (moves.length < 1) {
    return {
      move: '',
      children: childTrees
    };
  }

  const movesCopy = [...moves];

  movesCopy.reverse().forEach((move, idx) => {
    if (idx === 0) {
      result = {
        move: move,
        children: childTrees,
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

export function mergeTrees(...trees: ChessTree[]): ChessTree {
  return trees.reduce((acc, tree) => {
    return mergeTwoTrees(acc, tree);
  }, { move: '', children: []})
}

export function mergeTwoTrees(tree1: ChessTree, tree2: ChessTree): ChessTree {
  if (tree1.move === '' && tree2.move === '') {
    return {
      move: '',
      children: [ ...tree1.children, ...tree2.children ]
    };
  } else if (tree1.move === '') {
    return tree1.children.reduce((acc, childTree) => {
      return mergeTwoTrees(acc, childTree);
    }, tree2);
  } else if (tree2.move === '') {
    return tree2.children.reduce((acc, childTree) => {
      return mergeTwoTrees(acc, childTree);
    }, tree1);
  }

  if (areChessMovesEquivalent(tree1.move, tree2.move)) {
    const childTree = mergeTrees(...tree1.children, ...tree2.children);
    const children = childTree.move === '' ? childTree.children : [childTree];
    return {
      move: tree1.move,
      children
    }
  } else {
    return {
      move: '',
      children: [ tree1, tree2 ]
    }
  }
}
