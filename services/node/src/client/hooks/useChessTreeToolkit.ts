import { useState, useEffect } from 'react';
import { GuideMode } from '../utils/types';
import { getTreeLines } from '../../shared/chessTree';
import { Chess, ChessInstance, ShortMove } from 'chess.js';
import { ChessTree } from '../../shared/chessTypes';
import {
  areChessLinesEquivalent,
  areChessMovesEquivalent,
  partition,
  convertShortMoveToMove,
} from '../../shared/utils';

export type LineStats = {
  mode: GuideMode;
  line: string[];
  timesCompleted: number;
  teachingPriority: number;
};

type ChessTreeToolkit = {
  lineStats: LineStats[];
  resetValues: () => void;
  recordLineCompletion: () => void;
  getRelevantLines: (specifiedLine?: string[]) => LineStats[];
  getNextMoves: () => string[];
  getNextShortMoves: () => ShortMove[];
  getNextMoveGames: () => ChessInstance[];
  numLines: () => number;
  numLinesCompleted: () => number;
  atLineEnd: () => boolean;
  getBestNextMoves: () => string[];
  doesMoveLeadToDeadEnd: (move: string | ShortMove) => boolean;
};

export function useChessTreeToolkit(
  chessTree: ChessTree,
  movesOnBoard: () => string[],
  mode: GuideMode,
): ChessTreeToolkit {
  const lines = getTreeLines(chessTree, 'verbose');

  // Initialize 'lineStats' for all lines, setting their 'timesCompleted' values
  // to zero.
  const makeInitialValues = (): LineStats[] => {
    return lines.reduce((acc: LineStats[], lineObj) => {
      const practiceLine: LineStats = {
        mode: 'practice',
        line: lineObj.line,
        timesCompleted: 0,
        teachingPriority: 0,
      };
      const learnLine: LineStats = {
        mode: 'learn',
        line: lineObj.line,
        timesCompleted: 0,
        teachingPriority: lineObj.teachingPriority,
      };
      return [...acc, practiceLine, learnLine];
    }, []);
  };

  const [lineStats, setLineStats] = useState<LineStats[]>(makeInitialValues());

  const resetValues = (): void => setLineStats(makeInitialValues());

  useEffect(() => {
    resetValues();
  }, [chessTree]);

  const recordLineCompletion = () => {
    const [matchingLines, nonMatchingLines] = partition(
      lineStats,
      (li) => areChessLinesEquivalent(li.line, movesOnBoard()) && li.mode === mode,
    );
    if (matchingLines.length !== 1) {
      throw new Error(`Unexpected number of matchingLines: ${matchingLines.length}`);
    } else {
      const updatedLineStats: LineStats = {
        ...matchingLines[0],
        timesCompleted: matchingLines[0].timesCompleted + 1,
      };
      setLineStats([...nonMatchingLines, updatedLineStats]);
    }
  };

  const getRelevantLines = (specifiedLine?: string[]): LineStats[] => {
    const line = specifiedLine == undefined ? movesOnBoard() : specifiedLine;
    return lineStats.filter((li) => {
      return (
        li.mode === mode &&
        line.every((move, idx) => areChessMovesEquivalent(move, li.line[idx]))
      );
    });
  };

  const numLinesCompleted = (): number => {
    return lineStats.reduce((acc: number, p) => {
      if (p.mode === mode && p.timesCompleted > 0) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
  };

  const atLineEnd = (): boolean =>
    lines.some((lineObj) => areChessLinesEquivalent(lineObj.line, movesOnBoard()));

  const getNextMoves = (): string[] => {
    const result: string[] = [];
    getRelevantLines().forEach((lineStats) => {
      const nextMove = lineStats.line[movesOnBoard().length];
      if (nextMove != undefined && !result.includes(nextMove)) {
        result.push(nextMove);
      }
    });
    return result;
  };

  const getBestNextMoves = (): string[] => {
    // Get the lines that are reachable from the current position forward.
    const relevantLines = getRelevantLines();
    const lowTimesCompleted = Math.min(...relevantLines.map((li) => li.timesCompleted));
    const leastCompletedLines = relevantLines.filter(
      (li) => li.timesCompleted === lowTimesCompleted,
    );
    const highestTeachingPriority = Math.max(
      ...leastCompletedLines.map((li) => li.teachingPriority),
    );
    const bestLines = leastCompletedLines.filter(
      (li) => li.teachingPriority === highestTeachingPriority,
    );
    return bestLines.map((li) => li.line[movesOnBoard().length]);
  };

  // Return true if the given move only leads to completed lines.
  const doesMoveLeadToDeadEnd = (moveOrShortMove: string | ShortMove): boolean => {
    let move: string;
    if (typeof moveOrShortMove === 'string') {
      move = moveOrShortMove;
    } else {
      move = convertShortMoveToMove(movesOnBoard(), moveOrShortMove);
    }
    const linesWithMove = getRelevantLines([...movesOnBoard(), move]);
    const lowestTimesCompletedWithMove = Math.min(
      ...linesWithMove.map((li) => li.timesCompleted),
    );
    return lowestTimesCompletedWithMove > 0;
  };

  const getNextMoveGames = (): ChessInstance[] => {
    const games: ChessInstance[] = [];
    getNextMoves().forEach((move) => {
      const game = new Chess();
      [...movesOnBoard(), move].forEach((m) => {
        if (!game.move(m)) {
          throw new Error(`invalid move: ${m}, moves: ${movesOnBoard()}`);
        }
      });
      games.push(game);
    });
    return games;
  };

  const getNextShortMoves = (): ShortMove[] => {
    const result: ShortMove[] = [];
    getNextMoveGames().forEach((game) => {
      const history = game.history({ verbose: true });
      if (history.length < 1) {
        throw new Error('nextMoveGames must have at least one move in their history');
      }
      result.push(history[history.length - 1]);
    });
    return result;
  };

  return {
    lineStats,
    resetValues,
    recordLineCompletion,
    getRelevantLines,
    getNextMoves,
    getNextShortMoves,
    getNextMoveGames,
    numLines: () => lines.length,
    numLinesCompleted,
    atLineEnd,
    getBestNextMoves,
    doesMoveLeadToDeadEnd,
  };
}
