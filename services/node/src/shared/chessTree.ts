import { Chess } from 'chess.js';
import { ChessTree, ChessOpening } from './chessTypes';
import { ChessTrap } from './entity/chessTrap';
import {
  areChessMovesEquivalent,
  areChessPathsEquivalent,
  arraysEqual,
  getFen,
  idxOfFirstPairThat,
  numHalfMovesPlayed,
} from './utils';

type MoveObject = { move: string; isPreviewPosition?: boolean };

export const makeChessTree = (
  moves: (string | MoveObject)[],
  childTrees: ChessTree[],
): ChessTree => {
  let result: ChessTree = { move: '', children: [] };
  if (moves.length < 1) return { move: '', children: childTrees };
  const movesCopy = [...moves];
  movesCopy.reverse().forEach((moveOrObject, idx) => {
    const newResult = {} as any;
    if (typeof moveOrObject === 'string') {
      newResult.move = moveOrObject;
    } else {
      Object.entries(moveOrObject).forEach(([key, value]) => {
        if (value != undefined) newResult[key] = value;
      });
    }
    if (idx === 0) {
      newResult.children = childTrees;
    } else {
      newResult.children = [result];
    }
    result = newResult;
  });
  return result;
};

export const getUniquePaths = (tree: ChessTree, prePath: string[] = []): string[][] => {
  const paths = [];
  if (prePath.length === 0) {
    if (tree.children.length < 1) return tree.move === '' ? [] : [[tree.move]];
    if (tree.move !== '') prePath.push(tree.move);
  }
  if (tree.children.length > 0) {
    tree.children.forEach((childTree) => {
      // To define a ChessTree that allows for multiple first move options, the root node
      // should have its 'move' value set to the empty string, and have multiple children.
      // This means that the move of a node can only be the empty string if it is the root
      // node of the ChessTree. If we find a child node where move === '', throw an error
      if (childTree.move === '') {
        throw new Error('Empty move strings are only allowed at the root of a ChessTree');
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
};

export const validateChessTree = (tree: ChessTree): void => {
  const paths = getUniquePaths(tree);
  paths.forEach((path) => {
    const game = new Chess();
    path.forEach((move) => {
      if (move === '') {
        throw new Error('Empty move strings are only allowed at the root of ChessTrees');
      }
      if (!game.move(move)) throw new Error(`Invalid move: ${move}`);
    });
  });
};

function getSubtreeAtPath(path: string[], tree: ChessTree): ChessTree {
  if (path.length === 0) return tree;
  if (tree.move === '') {
    const move = path[0];
    const childrenWithNextMove = tree.children.filter((child) =>
      areChessMovesEquivalent(child.move, move),
    );
    if (childrenWithNextMove.length > 1) {
      throw new Error(`Found multiple children with same move: ${move}`);
    } else if (childrenWithNextMove.length < 1) {
      throw new Error(`Move ${move} not found`);
    } else {
      return getSubtreeAtPath(path, childrenWithNextMove[0]);
    }
  } else {
    if (areChessMovesEquivalent(path[0], tree.move)) {
      return getSubtreeAtPath(path.slice(1), { move: '', children: tree.children });
    } else {
      throw new Error(`Move ${path[0]} did not match next tree move ${tree.move}`);
    }
  }
}

export function mergeTrees(...trees: ChessTree[]): ChessTree {
  // Put all the paths of all the trees into one list
  const paths: string[][] = [];
  trees.forEach((tree) => getUniquePaths(tree).forEach((path) => paths.push(path)));

  // If there are no paths, just return an empty tree
  if (paths.length <= 0) {
    return { move: '', children: [] };
  }

  const result = { move: '', children: [] };
  const lengthOfLongestPath = Math.max(...paths.map((path) => path.length));

  // Each iteration of this for-loop represents one step deeper into what will
  // be the resulting ChessTree. Upon each step down, add all the nodes that should
  // exist at that level before going further down into the tree. (Breadth first)
  for (let idx = 0; idx < lengthOfLongestPath; idx++) {
    const pathsToAdd: string[][] = [];

    paths.forEach((path) => {
      const pathSoFar = path.slice(0, idx + 1);
      // if the current path has a move at this depth and if this 'pathSoFar' hasn't
      // already been added to the list of 'pathsToAdd', push it onto 'pathsToAdd'.
      if (
        path[idx] != undefined &&
        !pathsToAdd.some((p) => areChessPathsEquivalent(p, pathSoFar))
      ) {
        pathsToAdd.push(pathSoFar);
      }
    });
    pathsToAdd.forEach((path) => {
      const pathBeforeMove = path.slice(0, -1);
      const move = path[path.length - 1];

      // Attach a new node to the result tree
      getSubtreeAtPath(pathBeforeMove, result).children.push({ move, children: [] });
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

export function getPreviewPositionPath(tree: ChessTree): string[] | null {
  if (tree.isPreviewPosition) {
    return tree.move === '' ? [] : [tree.move];
  }
  const paths = getUniquePaths(tree);

  // Standardize tree so that first move is definitely the empty string.
  if (tree.move === '') {
    tree = tree;
  } else {
    tree = { move: '', children: [tree] };
  }

  for (let i = 0; i < paths.length; i++) {
    let currentTree = tree;
    const result: string[] = [];
    const path = paths[i];
    for (let j = 0; j < path.length; j++) {
      const move = path[j];
      result.push(move);
      currentTree = currentTree.children.find((child) => child.move === move);
      if (currentTree == undefined) {
        throw new Error(`Failed to find move ${move} at: ${result}`);
      }
      if (currentTree.isPreviewPosition) {
        return result;
      }
    }
  }
  return null;
}

export function doesTreeReachPosition(fen: string, tree: ChessTree): boolean {
  // Drop the halfmove clock and the fullmove number from a fen string.
  function dropClockAndMoveNum(someFen: string) {
    return someFen.slice(0, -3);
  }
  // We don't care about the halfmove clock or the fullmove number, so drop those
  fen = dropClockAndMoveNum(fen);
  const chess = new Chess();
  const paths = getUniquePaths(tree);
  for (let i = 0; i < paths.length; i++) {
    chess.reset();
    const path = paths[i];
    for (let j = 0; j < path.length; j++) {
      const move = path[j];
      if (!chess.move(move)) throw new Error(`Invalid move: ${move}`);
      if (dropClockAndMoveNum(chess.fen()) === fen) return true;
    }
  }
  return false;
}

// Return true if `chessTree` has a node that represents a game state equivalent to `fen`.
// This function calculates the number of moves played in `fen`, and will return early
// if no match is found within that number of moves.
export function doesTreeReachFen(fen: string, chessTree: ChessTree): boolean {
  const chess = new Chess();

  // Check that the fen string is valid
  const { valid, error } = chess.validate_fen(fen);
  if (!valid) throw new Error(`Invalid fen: ${fen}, ${error}`);
  if (fen === chess.fen()) return true;
  if (chessTree.move !== '') {
    chessTree = { ...chessTree, move: '', children: [chessTree] };
  }

  // Figure out how many (half) moves have been played in the fen string game
  // We will use this to determine if we need to look any deeper into the tree.
  const numFenMoves = numHalfMovesPlayed(fen);

  // Create an array which will store all the uncheckedNodes as we discover them.
  // We will use a while loop to go through each element of this list.
  const uncheckedNodes: { moves: string[]; tree: ChessTree }[] = [];
  chessTree.children.forEach((child) => {
    uncheckedNodes.push({ moves: [], tree: child });
  });

  // While there are nodes still to be checked...
  while (uncheckedNodes.length > 0) {
    const { moves, tree } = uncheckedNodes.shift();
    const history = chess.history();

    // Maybe get the idx of the first move that differs from chess.history()
    const idxOfFirstDiff = idxOfFirstPairThat((m1, m2) => m1 !== m2, history, moves);

    if (idxOfFirstDiff != null) {
      // If there is a divergence, undo the outdated moves from `chess` and apply the
      // relevant moves.
      const numBadMoves = history.length - idxOfFirstDiff;
      for (let i = numBadMoves; i > 0; i--) chess.undo();
      moves.slice(idxOfFirstDiff).forEach((move) => {
        if (!chess.move(move)) throw new Error(`Bad move! ${move}`);
      });
    } else if (history.length > moves.length) {
      // If there's no divergence but chess.history() is too long, then just
      // undo the extra moves
      for (let i = history.length - moves.length; i > 0; i--) chess.undo();
    }

    // Do the new move
    if (!chess.move(tree.move)) throw new Error(`Bad move: ${tree.move}`);

    // Success case!
    if (chess.fen() === fen) return true;

    // We don't want to look deeper into the tree than is necessary. Only add the childen
    // to the `uncheckedNodes` array if the number of moves played hasn't exceeded the
    // number of moves played in the `fen` string.
    if (moves.length < numFenMoves) {
      tree.children.forEach((child) => {
        uncheckedNodes.push({ moves: [...moves, tree.move], tree: child });
      });
    }
  }

  // If we didn't find a match, return false.
  return false;
}

export function filterTrapsWithOpenings(
  openings: ChessOpening[],
  traps: ChessTrap[],
): ChessTrap[] {
  const fens = openings.map((opening) => getFen(opening));
  return traps.filter((trap) =>
    fens.some((fen) => doesTreeReachFen(fen, trap.chessTree)),
  );
}

export function isPathInTree(path: string[], tree: ChessTree): boolean {
  const paths = getUniquePaths(tree);
  return paths.some((treePath) => arraysEqual(treePath.slice(0, path.length), path));
}

export function filterTrapsWithPath(path: string[], traps: ChessTrap[]): ChessTrap[] {
  return traps.filter((trap) => isPathInTree(path, trap.chessTree));
}
