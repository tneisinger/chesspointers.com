import React from 'react';
import { StylesProvider } from '@material-ui/core/styles';
import Chessground from 'react-chessground';
import 'react-chessground/dist/styles/chessground.css';

const ChessBoard: React.FC<any> = (props) => {
  return (
    <StylesProvider injectFirst>
      <Chessground {...props} />
    </StylesProvider>
  );
}

export default ChessBoard;
