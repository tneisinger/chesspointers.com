declare module "react-chessground" {
  import React from 'react';

  interface Props {
      fen?: string,
      width?: string,
      height?: string,
      onMove?: (from: string, to: string) => void
      randomMove?: (moves: string[], move: string) => void;
      promotion?: (e: string) => void;
      reset?: () => void;
      undo?: () => void;
      drawable?: Object;
      movable?: Object;
      animation?: Object;
      orientation?: string;
      resizable?: boolean;
  }

  export const Chessground: React.ComponentType<Props>

  export default Chessground
}
