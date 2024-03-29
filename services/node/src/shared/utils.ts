import { Chess, ChessInstance, ShortMove } from 'chess.js';
import { Lesson } from './entity/lesson';
import { ChessOpening, OpeningMoves, FenParts } from './chessTypes';

export function assertUnreachable(x: never): never {
  throw new Error(`assertUnreachable was reached with value: ${x}`);
}

export function arraysEqual<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((val, idx) => val === b[idx]);
}

export function getArrayDiff<T>(setA: T[], setB: T[]): T[] {
  return setA.filter((a) => !setB.includes(a));
}

export function partition<T>(array: T[], isValid: (t: T) => boolean): [T[], T[]] {
  return array.reduce(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []],
  );
}

export function encodeWhiteSpaces(str: string): string {
  return str
    .split('')
    .map((c) => (c === ' ' ? '\u00a0' : c))
    .join('');
}

export function randomElem<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

export function toDashedLowercase(str: string): string {
  return str.toLowerCase().replace(/ /g, '-');
}

export function idxOfFirstPairThat<T>(
  p: (v1: T, v2: T) => boolean,
  arr1: T[],
  arr2: T[],
): number | null {
  const shorterLength = Math.min(arr1.length, arr2.length);
  for (let i = 0; i < shorterLength; i++) {
    if (p(arr1[i], arr2[i])) return i;
  }
  return null;
}

export function basicCompare<T>(
  a: T,
  b: T,
  options: { descending?: boolean } = { descending: false },
): number {
  if (a < b) return options.descending ? 1 : -1;
  if (a > b) return options.descending ? -1 : 1;
  return 0;
}

export function areChessLinesEquivalent(line1: string[], line2: string[]): boolean {
  return (
    line1.length == line2.length &&
    line1.every((move, idx) => areChessMovesEquivalent(move, line2[idx]))
  );
}

// In chess move notation, the '+' symbol means check and the '#' symbol means checkmate.
// But a move string like 'Bb4+' is equivalent to 'Bb4' with regard to the chess.js
// package. This function determines if two moves are equivalent (i.e. if the strings
// represent the same move, disregarding any checks or checkmates.)
export function areChessMovesEquivalent(move1: string, move2: string): boolean {
  if (move1 === move2) return true;
  if (move1 === '' || move2 === '') return false;
  return stripCheckSymbol(move1) === stripCheckSymbol(move2);
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

function compareLessonsByName(lesson1: Lesson, lesson2: Lesson): number {
  if (lesson1.shortName < lesson2.shortName) return -1;
  if (lesson1.shortName > lesson2.shortName) return 1;
  return 0;
}

export function sortLessonsByName(lessons: Lesson[]): void {
  lessons.sort(compareLessonsByName);
}

export function getFen(opening: ChessOpening): string {
  switch (opening) {
    case ChessOpening.CaroKannDefense:
      return 'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2';
    case ChessOpening.ItalianGame:
      return 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3';
    case ChessOpening.KingsPawn:
      return 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
    case ChessOpening.PetrovsDefense:
      return 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3';
    case ChessOpening.QueensPawn:
      return 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1';
    case ChessOpening.QueensGambit:
      return 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2';
    case ChessOpening.RuyLopez:
      return 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3';
    case ChessOpening.SicilianDefense:
      return 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2';
    default:
      return assertUnreachable(opening);
  }
}

export function getFenStr(openingMoves: OpeningMoves): string {
  switch (openingMoves) {
    case OpeningMoves.e4:
      return 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
    case OpeningMoves.e4_e5:
      return 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2';
    case OpeningMoves.e4_c5:
      return 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2';
    case OpeningMoves.d4:
      return 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1';
    case OpeningMoves.d4_Nf6:
      return 'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2';
    case OpeningMoves.d4_d5:
      return 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2';
    default:
      return assertUnreachable(openingMoves);
  }
}

export function numHalfMovesPlayed(fen: string): number {
  const { fullMoveNumber, activeColor } = getFenParts(fen);
  const minMoves = (fullMoveNumber - 1) * 2;
  if (activeColor === 'white') return minMoves;
  return minMoves + 1;
}

export function getFenParts(fen: string): FenParts {
  const [placement, color, castling, enPasSq, halfClock, fullMoveNum] = fen.split(' ');
  return {
    piecePlacement: placement,
    activeColor: color === 'w' ? 'white' : 'black',
    castling,
    enPassantSquare: enPasSq,
    halfMoveClock: Number(halfClock),
    fullMoveNumber: Number(fullMoveNum),
  };
}

export function convertShortMoveToMove(
  precedingMoves: string[],
  shortMove: ShortMove,
): string {
  const chess = new Chess();
  precedingMoves.forEach((move, idx) => {
    if (!chess.move(move)) {
      throw new Error(`invalid move: ${move}, moves: ${precedingMoves.slice(0, idx)}`);
    }
  });
  if (!chess.move(shortMove)) {
    throw new Error(`invalid move: ${shortMove}, moves: ${precedingMoves}`);
  }
  const history = chess.history();
  return history[history.length - 1];
}

export function convertMovesToShortMoves(moves: string[]): ShortMove[] {
  const chess = new Chess();
  moves.forEach((move, idx) => {
    if (!chess.move(move)) {
      throw new Error(`invalid move: ${move}, moves: ${moves.slice(0, idx)}`);
    }
  });
  return chess.history({ verbose: true });
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isValueOf<T>(obj: T, val: any): val is T[keyof T] {
  for (const k in obj) {
    if (obj[k] === val) {
      return true;
    }
  }
  return false;
}

export function playMoveOrErr(chess: ChessInstance, move: string | ShortMove): void {
  if (!chess.move(move)) {
    throw new Error(`Invalid move: ${move} (history: ${chess.history()})`);
  }
}
