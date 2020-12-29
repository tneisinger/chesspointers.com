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
  if (prePath.length === 0) {
    prePath.push(tree.move);
  }
  if (tree.children.length > 0) {
    tree.children.forEach((childTree) => {
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
