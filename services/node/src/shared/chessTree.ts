import { Chess } from 'chess.js';
import {
  ChessTree,
  ChessOpening,
  OpeningMoves,
  ChessTreeMove,
  ChessTreeLine,
  HasTeachingPriority,
} from './chessTypes';
import { Lesson } from './entity/lesson';
import {
  areChessMovesEquivalent,
  areChessLinesEquivalent,
  arraysEqual,
  getFen,
  getFenStr,
  idxOfFirstPairThat,
  numHalfMovesPlayed,
} from './utils';

type MakeChessTreeOptions = Partial<HasTeachingPriority>;

export const makeChessTree = (
  moves: (string | ChessTreeMove)[],
  childTrees: ChessTree[],
  options?: MakeChessTreeOptions,
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
  if (options != undefined && options.teachingPriority != undefined) {
    result.teachingPriority = options.teachingPriority;
  }
  return result;
};

export function getTreeLines(tree: ChessTree): string[][];
export function getTreeLines(tree: ChessTree, verbose: 'verbose'): ChessTreeLine[];
export function getTreeLines(tree: ChessTree, verbose?: 'verbose'): any[] {
  const lines = [];
  if (tree.move != '') {
    tree = { move: '', children: [tree], ...tree };
  }
  type IncompleteLine = { line: string[]; teachingPriority: number; subtree: ChessTree };
  const incompleteLines: IncompleteLine[] = [
    {
      line: [],
      teachingPriority: 0,
      subtree: tree,
    },
  ];
  while (incompleteLines.length > 0) {
    const { line, teachingPriority, subtree } = incompleteLines.shift();
    if (subtree.children.length < 1) {
      const completeLine = subtree.move == '' ? line : [...line, subtree.move];
      if (completeLine.length > 0) {
        // If the `verbose` flag was included in the function call, include extra
        // information with each line
        const result = verbose ? { line: completeLine, teachingPriority } : completeLine;
        lines.push(result);
      }
    } else {
      subtree.children.forEach((child) => {
        const newLine = subtree.move === '' ? line : [...line, subtree.move];
        incompleteLines.push({
          line: newLine,

          // If the child doesn't have a teachingPriority value, use the parent's
          // teachingPriority value. Otherwise, use the child's teachingPriority value.
          teachingPriority:
            child.teachingPriority == undefined
              ? teachingPriority
              : child.teachingPriority,

          subtree: child,
        });
      });
    }
  }
  return lines;
}

export const validateChessTree = (tree: ChessTree): void => {
  const lines = getTreeLines(tree);
  lines.forEach((line) => {
    const game = new Chess();
    line.forEach((move, idx) => {
      if (move === '') {
        throw new Error('Empty move strings are only allowed at the root of ChessTrees');
      }
      if (!game.move(move)) {
        throw new Error(`invalid move: ${move}, moves: ${line.slice(0, idx)}`);
      }
    });
  });
};

function getSubtreeAtLine(line: string[], tree: ChessTree): ChessTree {
  if (line.length === 0) return tree;
  if (tree.move === '') {
    const move = line[0];
    const childrenWithNextMove = tree.children.filter((child) =>
      areChessMovesEquivalent(child.move, move),
    );
    if (childrenWithNextMove.length > 1) {
      throw new Error(`Found multiple children with same move: ${move}`);
    } else if (childrenWithNextMove.length < 1) {
      throw new Error(`Move ${move} not found`);
    } else {
      return getSubtreeAtLine(line, childrenWithNextMove[0]);
    }
  } else {
    if (areChessMovesEquivalent(line[0], tree.move)) {
      return getSubtreeAtLine(line.slice(1), { move: '', children: tree.children });
    } else {
      throw new Error(`Move ${line[0]} did not match next tree move ${tree.move}`);
    }
  }
}

export function mergeTrees(...trees: ChessTree[]): ChessTree {
  // Put all the lines of all the trees into one list
  const lines: string[][] = [];
  trees.forEach((tree) => {
    getTreeLines(tree).forEach((line) => lines.push(line));
  });

  // If there are no lines, just return an empty tree
  if (lines.length <= 0) {
    return { move: '', children: [] };
  }

  const result = { move: '', children: [] };
  const lengthOfLongestLine = Math.max(...lines.map((line) => line.length));

  // Each iteration of this for-loop represents one step deeper into what will
  // be the resulting ChessTree. Upon each step down, add all the nodes that should
  // exist at that level before going further down into the tree. (Breadth first)
  for (let idx = 0; idx < lengthOfLongestLine; idx++) {
    const linesToAdd: string[][] = [];

    lines.forEach((line) => {
      const lineSoFar = line.slice(0, idx + 1);
      // if the current line has a move at this depth and if this 'lineSoFar' hasn't
      // already been added to the list of 'linesToAdd', push it onto 'linesToAdd'.
      if (
        line[idx] != undefined &&
        !linesToAdd.some((p) => areChessLinesEquivalent(p, lineSoFar))
      ) {
        linesToAdd.push(lineSoFar);
      }
    });
    linesToAdd.forEach((line) => {
      const lineBeforeMove = line.slice(0, -1);
      const move = line[line.length - 1];

      // Attach a new node to the result tree
      getSubtreeAtLine(lineBeforeMove, result).children.push({ move, children: [] });
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

export function getPreviewPositionLine(tree: ChessTree): string[] | null {
  if (tree.isPreviewPosition) {
    return tree.move === '' ? [] : [tree.move];
  }
  const lines = getTreeLines(tree);

  // Standardize tree so that first move is definitely the empty string.
  if (tree.move === '') {
    tree = tree;
  } else {
    tree = { move: '', children: [tree] };
  }

  for (let i = 0; i < lines.length; i++) {
    let currentTree = tree;
    const result: string[] = [];
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const move = line[j];
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
  const lines = getTreeLines(tree);
  for (let i = 0; i < lines.length; i++) {
    chess.reset();
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const move = line[j];
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

export function filterLessonsWithOpenings(
  openings: ChessOpening[],
  lessons: Lesson[],
): Lesson[] {
  const fens = openings.map((opening) => getFen(opening));
  return lessons.filter((lesson) =>
    fens.some((fen) => doesTreeReachFen(fen, lesson.chessTree)),
  );
}

export function filterLessonsWithOpeningMoves(
  openingMoves: OpeningMoves,
  lessons: Lesson[],
): Lesson[] {
  const fen = getFenStr(openingMoves);
  return lessons.filter((lesson) => doesTreeReachFen(fen, lesson.chessTree));
}

export function isLineInTree(line: string[], tree: ChessTree): boolean {
  const lines = getTreeLines(tree);
  return lines.some((treeLine) => arraysEqual(treeLine.slice(0, line.length), line));
}

export function filterLessonsWithLine(line: string[], lessons: Lesson[]): Lesson[] {
  return lessons.filter((lesson) => isLineInTree(line, lesson.chessTree));
}
