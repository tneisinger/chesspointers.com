import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Modal from './Modal';
import { PieceColor, PromotionPiece } from '../../shared/chessTypes';
import whiteBishop from 'react-chessground/dist/images/pieces/merida/wB.svg';
import whiteKnight from 'react-chessground/dist/images/pieces/merida/wN.svg';
import whiteQueen from 'react-chessground/dist/images/pieces/merida/wQ.svg';
import whiteRook from 'react-chessground/dist/images/pieces/merida/wR.svg';
import blackBishop from 'react-chessground/dist/images/pieces/merida/bB.svg';
import blackKnight from 'react-chessground/dist/images/pieces/merida/bN.svg';
import blackQueen from 'react-chessground/dist/images/pieces/merida/bQ.svg';
import blackRook from 'react-chessground/dist/images/pieces/merida/bR.svg';
import { assertUnreachable } from '../../shared/utils';

const MAX_IMG_SIZE = '75px';

const useStyles = makeStyles((theme) => ({
  modalContent: {
    marginTop: '1rem',
  },
  titleText: {},
  pieceBtn: {
    borderRadius: '8px',
    borderColor: 'transparent',
    backgroundColor: theme.palette.action.hover,
    margin: '1rem 0.5rem 0.5rem 0.5rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.text.secondary,
    },
  },
  pieceImage: {
    maxWidth: MAX_IMG_SIZE,
    maxHeight: MAX_IMG_SIZE,
  },
}));

interface Props {
  isOpenOrOpening: boolean;
  color: PieceColor;
  handlePieceSelected: (piece: PromotionPiece) => void;
  delayOpenFor?: number;
}

const PawnPromoteModal: React.FC<Props> = (props) => {
  const classes = useStyles(props);

  const getPieceImage = (piece: PromotionPiece) => {
    switch (piece) {
      case PromotionPiece.Bishop:
        return props.color === 'white' ? whiteBishop : blackBishop;
      case PromotionPiece.Knight:
        return props.color === 'white' ? whiteKnight : blackKnight;
      case PromotionPiece.Rook:
        return props.color === 'white' ? whiteRook : blackRook;
      case PromotionPiece.Queen:
        return props.color === 'white' ? whiteQueen : blackQueen;
      default:
        assertUnreachable(piece);
    }
  };

  return (
    <Modal
      isModalOpenOrOpening={props.isOpenOrOpening}
      handleClose={() => void 0}
      includeCloseBtn={false}
      {...props}
    >
      <div className={classes.modalContent}>
        <Typography className={classes.titleText} variant='h3'>
          Promote!
        </Typography>
        {Object.values(PromotionPiece).map((piece) => (
          <button
            key={piece}
            className={classes.pieceBtn}
            onClick={() => props.handlePieceSelected(piece)}
          >
            <img className={classes.pieceImage} src={getPieceImage(piece)} />
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default PawnPromoteModal;
