import { makeChessTree } from './chessTree';
import { ChessTree } from './chessTypes';
import { parse as parsePGN, Move } from 'pgn-parser';

export function makeChessTreeFromPGNString(pgnString: string): ChessTree {
  const [pgnData] = parsePGN(pgnString);
  const result = makeChessTreeFromMoves(pgnData.moves);
  console.log('here comes the result');
  console.log(result);
  return result;
}

function makeChessTreeFromMoves(
  pgnMoves: Move[],
  options = { skipFirstRav: false }
): ChessTree {
  const idxOfFirstRavs = getIdxOfFirstRavs(pgnMoves, options.skipFirstRav ? 1 : 0);
  const moves = pgnMoves.slice(0, idxOfFirstRavs).map(moveData => moveData.move);
  const subtreeData = pgnMoves.slice(idxOfFirstRavs)
  return makeChessTree(moves, makeSubTrees(subtreeData));
}

function makeSubTrees(subtreeData: Move[]): ChessTree[] {
  if (subtreeData.length === 0) return [];
  if (!('ravs' in subtreeData[0])) throw new Error(
    'The first move in the input list must have a `ravs` key'
  );
  const subtrees = [];
  subtreeData[0].ravs.forEach((rav) => {
    const subtree = makeChessTreeFromMoves(rav.moves);
    subtrees.push(subtree);
  });
  subtrees.push(makeChessTreeFromMoves(subtreeData, { skipFirstRav: true }));
  return subtrees;
}

// Get the index of the first move that has a `ravs` key. If no move has a `ravs` key,
// return the length of the input list.
function getIdxOfFirstRavs(pgnMoves: Move[], startIdx = 0): number {
  let idxOfFirstRavs = startIdx;
  let doRavsExist = false;
  for (var i = idxOfFirstRavs; i < pgnMoves.length; i++) {
    if ('ravs' in pgnMoves[i]) {
      idxOfFirstRavs = i;
      doRavsExist = true;
      break;
    }
  }
  if (!doRavsExist) idxOfFirstRavs = pgnMoves.length;
  return idxOfFirstRavs;
}
