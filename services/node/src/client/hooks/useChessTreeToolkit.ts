import { useState, useEffect } from 'react';
import { GuideMode } from '../utils/types';
import { getTreeLines } from '../../shared/chessTree';
import { ChessTree } from '../../shared/chessTypes';
import {
  areChessLinesEquivalent,
  areChessMovesEquivalent,
  partition,
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
  numLines: () => number;
  numLinesCompleted: () => number;
  atLineEnd: () => boolean;
  getBestNextMoves: () => string[];
  doesMoveLeadToDeadEnd: (move: string) => boolean;
};

export function useChessTreeToolkit(
  chessTree: ChessTree,
  playedMoves: string[],
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
      (p) => areChessLinesEquivalent(p.line, playedMoves) && p.mode === mode,
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
    const line = specifiedLine == undefined ? playedMoves : specifiedLine;
    return lineStats.filter((p) => {
      return (
        p.mode === mode &&
        line.every((move, idx) => areChessMovesEquivalent(move, p.line[idx]))
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
    lines.some((lineObj) => areChessLinesEquivalent(lineObj.line, playedMoves));

  const getBestNextMoves = (): string[] => {
    // Get the lines that are reachable from the current position forward.
    const relevantLines = getRelevantLines();
    const lowestTimesCompleted = Math.min(...relevantLines.map((p) => p.timesCompleted));
    const leastCompletedLines = relevantLines.filter(
      (p) => p.timesCompleted === lowestTimesCompleted,
    );
    const highestTeachingPriority = Math.max(
      ...leastCompletedLines.map((p) => p.teachingPriority),
    );
    const bestLines = leastCompletedLines.filter(
      (p) => p.teachingPriority === highestTeachingPriority,
    );
    return bestLines.map((p) => p.line[playedMoves.length]);
  };

  // Return true if the given move only leads to completed lines.
  const doesMoveLeadToDeadEnd = (move: string): boolean => {
    const linesWithMove = getRelevantLines([...playedMoves, move]);
    const lowestTimesCompletedWithMove = Math.min(
      ...linesWithMove.map((p) => p.timesCompleted),
    );
    return lowestTimesCompletedWithMove > 0;
  };

  return {
    lineStats,
    resetValues,
    recordLineCompletion,
    getRelevantLines,
    numLines: () => lines.length,
    numLinesCompleted,
    atLineEnd,
    getBestNextMoves,
    doesMoveLeadToDeadEnd,
  };
}
