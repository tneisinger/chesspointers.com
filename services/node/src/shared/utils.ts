import { User } from './entity/user';
import { ShortMove } from 'chess.js';
import { ChessTrap } from './entity/chessTrap';
import { ChessOpening } from './chessTypes'

export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

export function arraysEqual<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((val, idx) => val === b[idx]);
}

export function getArrayDiff<T>(setA: T[], setB: T[]): T[] {
  return setA.filter((a) => !setB.includes(a));
}

export function partition<T>(array: T[], isValid: (t: T) => boolean): T[][] {
  return array.reduce(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []],
  );
}

export function randomElem<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

export function toDashedLowercase(str: string): string {
  return str.toLowerCase().replace(/ /g, '-');
}

export function areChessPathsEquivalent(path1: string[], path2: string[]): boolean {
  return (
    path1.length == path2.length &&
    path1.every((move, idx) => areChessMovesEquivalent(move, path2[idx]))
  );
}

// In chess move notation, the '+' symbol means check and the '#' symbol means checkmate.
// But a move string like 'Bb4+' is equivalent to 'Bb4' with regard to the chess.js
// package. This function determines if two moves are equivalent (i.e. if the strings
// represent the same move, disregarding any checks or checkmates.)
export function areChessMovesEquivalent(move1: string, move2: string): boolean {
  if (move1 === move2) return true;
  if (move1 === '' || move2 === '') return false;
  const move1Stripped = stripCheckSymbol(move1);
  const move2Stripped = stripCheckSymbol(move2);
  return move1Stripped === move2Stripped;
}

function stripCheckSymbol(move: string): string {
  const lastChar = move[move.length - 1];
  if (lastChar === '+' || lastChar === '#') {
    return move.slice(0, -1);
  }
  return move;
}

// Calculate the score of a chess game from a fen string. If white is ahead by n points,
// return n. If black is ahead by n points, return -n. If the score is tied, return 0.
export function getScoreFromFen(fen: string): number {
  const pieces = fen.substr(0, fen.indexOf(' '));
  const numWhiteQueens = (pieces.match(/Q/g) || []).length;
  const numWhiteRooks = (pieces.match(/R/g) || []).length;
  const numWhiteBishops = (pieces.match(/B/g) || []).length;
  const numWhiteKnights = (pieces.match(/N/g) || []).length;
  const numWhitePawns = (pieces.match(/P/g) || []).length;

  const numBlackQueens = (pieces.match(/q/g) || []).length;
  const numBlackRooks = (pieces.match(/r/g) || []).length;
  const numBlackBishops = (pieces.match(/b/g) || []).length;
  const numBlackKnights = (pieces.match(/n/g) || []).length;
  const numBlackPawns = (pieces.match(/p/g) || []).length;

  const valueOfWhitePieces =
    numWhitePawns +
    (numWhiteKnights + numWhiteBishops) * 3 +
    numWhiteRooks * 5 +
    numWhiteQueens * 9;

  const valueOfBlackPieces =
    numBlackPawns +
    (numBlackKnights + numBlackBishops) * 3 +
    numBlackRooks * 5 +
    numBlackQueens * 9;

  return valueOfWhitePieces - valueOfBlackPieces;
}

export function sameMoves(move1: ShortMove, move2: ShortMove): boolean {
  return move1.from === move2.from && move1.to === move2.to;
}

function compareChessTrapsByName(trap1: ChessTrap, trap2: ChessTrap): number {
  if (trap1.name < trap2.name) return -1;
  if (trap1.name > trap2.name) return 1;
  return 0;
}

export function sortChessTrapsByName(traps: ChessTrap[]): ChessTrap[] {
  return traps.sort(compareChessTrapsByName);
}

// TODO: Some openings can be represented with a list of moves, but some
// others are better described with a board position, because there are multiple
// ways to reach that particular board position. For example, the Italian game
// can be reached with [e4, e5, Bc4, Nc6, Nf3] or with [e4, e5, Nf3, Nc6, Nf3].
// Maybe representing them wth board positions is better?
export function getChessOpeningMoves(opening: ChessOpening): string[] {
  switch (opening) {
    case ChessOpening.CaroKannDefense:
      return ['e4', 'c6'];
    case ChessOpening.EnglundGambit:
      return ['d4', 'e5'];
    case ChessOpening.ItalianGame:
      return ['e4', 'e5', 'Bc4', 'Nc6', 'Nf3']; // TODO: or [e4, e5, Nf3, Nc6, Nf3]
    case ChessOpening.QueensGambit:
      return ['d4', 'd5', 'c4'];
    case ChessOpening.SicilianDefense:
      return ['e4', 'c5'];
    default:
      const _exhaustiveMatch: never = opening;
      throw new Error('Non-exhaustive match for ChessOpening');
  }
}
