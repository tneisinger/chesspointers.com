import React from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChessTreePreview from './ChessTreePreview';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { toDashedLowercase } from '../../shared/utils';
import { calcChessBoardSize } from '../utils';

const CARD_MARGIN = 16;
const CARD_CONTENT_PADDING = 24;

const FONT_SIZE_SCALAR = 0.003;

const useStyles = makeStyles({
  card: {
    display: 'inline-block',
    margin: CARD_MARGIN + 'px',
  },
  cardContent: {
    padding: CARD_CONTENT_PADDING + 'px',
    paddingTop: '16px',
  },
  titleText: {
    fontSize: (p: Props) => p.cardWidth * FONT_SIZE_SCALAR + 'rem',
  },
});

interface Props {
  chessTrap: ChessTrap;
  cardWidth: number;
}

const ChessLessonPreview: React.FC<Props> = (props) => {
  const classes = useStyles(props);

  const rawBoardSize = props.cardWidth - CARD_MARGIN * 2 - CARD_CONTENT_PADDING * 2;
  const boardSize = calcChessBoardSize(rawBoardSize, 'px');

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <NavLink to={`/traps/${toDashedLowercase(props.chessTrap.shortName)}`}>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <Typography className={classes.titleText} component='h4' align='center'>
                {props.chessTrap.fullName}
              </Typography>
            </Grid>
            <Grid item>
              <ChessTreePreview
                chessTree={props.chessTrap.chessTree}
                orientation={props.chessTrap.playedByWhite ? 'white' : 'black'}
                boardSize={boardSize}
              />
            </Grid>
          </Grid>
        </NavLink>
      </CardContent>
    </Card>
  );
};

export default ChessLessonPreview;
