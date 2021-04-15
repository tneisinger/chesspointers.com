import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChessTreePreview from './ChessTreePreview';
import { Lesson } from '../../shared/entity/lesson';
import { getLessonUrlPath } from '../../shared/lessons';
import { calcChessBoardSize } from '../utils';

const CARD_MARGIN = 16;
const CARD_CONTENT_PADDING = 16;

const FONT_SIZE_SCALAR = 0.003;

const useStyles = makeStyles({
  card: {
    display: 'inline-block',
    margin: CARD_MARGIN + 'px',
  },
  cardContent: {
    padding: CARD_CONTENT_PADDING + 'px',
    paddingTop: '12px',
    paddingBottom: '16px!important',
  },
  titleText: {
    fontSize: (p: Props) => p.cardWidth * FONT_SIZE_SCALAR + 'rem',
    marginBottom: '12px',
  },
});

export interface Props {
  lesson: Lesson;
  cardWidth: number;
  stepper: number;
  onHoverChange?: (lessonName: string, isHovered: boolean) => void;
}

const ChessLessonPreview: React.FC<Props> = (props) => {
  const classes = useStyles(props);

  const rawBoardSize = props.cardWidth - CARD_MARGIN * 2 - CARD_CONTENT_PADDING * 2;
  const boardSize = calcChessBoardSize(rawBoardSize, 'px');

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Link to={getLessonUrlPath(props.lesson)}>
          <Grid container direction='column'>
            <Grid item>
              <Typography className={classes.titleText} component='h4' align='center'>
                {props.lesson.fullName}
              </Typography>
            </Grid>
            <Grid item>
              <ChessTreePreview
                chessTree={props.lesson.chessTree}
                orientation={props.lesson.playedByWhite ? 'white' : 'black'}
                stepper={props.stepper}
                onHoverChange={(isHovered) => {
                  if (props.onHoverChange != undefined) {
                    props.onHoverChange(props.lesson.shortName, isHovered);
                  }
                }}
                boardSize={boardSize}
              />
            </Grid>
          </Grid>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ChessLessonPreview;
