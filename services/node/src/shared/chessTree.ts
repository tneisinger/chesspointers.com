import { ChessTree } from './chessTypes';

export const makeChessTree = (moves: string[], nodes: ChessTree[]): ChessTree => {
  let result: (null | ChessTree) = null;

  moves.reverse().forEach((move, idx) => {
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

export const getUniquePaths = (tree: ChessTree, prePath: number[] = []): number[][] => {
  let paths = [];
  if (tree.children.length > 1) {
    tree.children.forEach((childTree, idx) => {
      const newPath = [...prePath, idx];
      const deeperPaths = getUniquePaths(childTree, newPath);
      if (deeperPaths.length > 0) {
        deeperPaths.forEach((p) => paths.push(p));
      } else {
        paths.push(newPath);
      }
    });
  } else if (tree.children.length === 1) {
    getUniquePaths(tree.children[0], prePath).forEach((p) => paths.push(p));
  }

  return paths;
}
