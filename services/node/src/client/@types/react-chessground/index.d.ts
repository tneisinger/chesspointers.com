declare module "react-chessground" {
  import React from 'react';

  interface MyComponentProps {
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
  }

  export const Chessground: React.ComponentType<MyComponentProps>

  export default Chessground
}
