declare module "react-chessground" {
  import React from 'react';

  interface Props {
      width?: string,
      height?: string,
      turnColor?: string,
      fen?: string,
      orientation?: string;
      onMove?: (from: string, to: string) => void
      lastMove?: string[];
      randomMove?: (moves: string[], move: string) => void;
      promotion?: (e: string) => void;
      reset?: () => void;
      undo?: () => void;
      drawable?: Object;
      movable?: Object;
      animation?: Object;
      resizable?: boolean;
  }

  export const Chessground: React.ComponentType<Props>

  export default Chessground
}
