import { Chess } from "chess.js";
import { ChessTree } from './chessTypes';
import { areChessMovesEquivalent, areChessPathsEquivalent } from './utils';

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

export const validateChessTree = (tree: ChessTree): void => {
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

function getSubtreeAtPath(path: string[], tree: ChessTree): ChessTree {
  if (path.length === 0) return tree;
  if (tree.move === '') {
    const move = path[0];
    const childrenWithNextMove =
      tree.children.filter(child => areChessMovesEquivalent(child.move, move));
    if (childrenWithNextMove.length > 1) {
      throw new Error(`Found multiple children with same move: ${move}`);
    } else if (childrenWithNextMove.length < 1) {
      throw new Error(`Move ${move} not found`);
    } else {
      return getSubtreeAtPath(path, childrenWithNextMove[0]);
    }
  } else {
    if (areChessMovesEquivalent(path[0], tree.move)) {
      return getSubtreeAtPath(path.slice(1), {move: '', children: tree.children});
    } else {
      throw new Error(`Move ${path[0]} did not match next tree move ${tree.move}`);
    }
  }
}

export function mergeTrees(...trees: ChessTree[]): ChessTree {
  // Put all the paths of all the trees into one list
  const paths: string[][] = [];
  trees.forEach(tree => getUniquePaths(tree).forEach(path => paths.push(path)));

  // If there are no paths, just return an empty tree
  if (paths.length <= 0) {
    return { move: '', children: [] };
  }

  const result = {move: '', children: []};
  const lengthOfLongestPath = Math.max(...paths.map(path => path.length));

  // Each iteration of this for-loop represents one step deeper into what will
  // be the resulting ChessTree. Upon each step down, add all the nodes that should
  // exist at that level before going further down into the tree. (Breadth first)
  for (let idx = 0; idx < lengthOfLongestPath; idx++) {
    const pathsToAdd: string[][] = [];

    paths.forEach(path => {
      const pathSoFar = path.slice(0, idx+1);
      // if the current path has a move at this depth and if this 'pathSoFar' hasn't
      // already been added to the list of 'pathsToAdd', push it onto 'pathsToAdd'.
      if ( path[idx] != undefined &&
           !pathsToAdd.some(p => areChessPathsEquivalent(p, pathSoFar))
         ) {
        pathsToAdd.push(pathSoFar);
      }
    });
    pathsToAdd.forEach(path => {
      const pathBeforeMove = path.slice(0,-1);
      const move = path[path.length - 1];

      // Attach a new node to the result tree
      getSubtreeAtPath(pathBeforeMove, result).children.push({move, children: []});
    });
  }

  // At this point, the 'result' ChessTree will always have a root node with an empty
  // string as its move. In this case, if there is only one child node attached to the
  // root node, then we can just throw away the root node and just return the child node.
  if (result.move === '' && result.children.length === 1) {
    return result.children[0];
  }

  return result;
}
