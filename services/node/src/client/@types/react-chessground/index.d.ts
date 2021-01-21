declare module "react-chessground" {
  import React from 'react';
  import { Config } from 'chessground/config';

  interface Props extends Config {};

  export const Chessground: React.ComponentType<Props>

  export default Chessground;
}
