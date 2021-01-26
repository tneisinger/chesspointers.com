declare module "react-chessground" {
  import React from 'react';
  import { Square } from 'chess.js';

  interface Props {
      width?: string;
      height?: string;
      turnColor?: string;
      check?: boolean;
      coordinates?: boolean;
      fen?: string;
      selectable?: { enabled: boolean };
      viewOnly?: boolean;
      orientation?: string;
      onMove?: (from: Square, to: Square) => void;
      lastMove?: string[];
      randomMove?: (moves: string[], move: string) => void;
      promotion?: (e: string) => void;
      reset?: () => void;
      undo?: () => void;
      drawable?: Object;
      movable?: Object;
      animation?: Object;
      resizable?: boolean;
      highlight?: {
        lastMove?: boolean,
        check?: boolean,
      };
  }

  export const Chessground: React.ComponentType<Props>

  export default Chessground
}
