import React from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChessLessonPreview from './ChessLessonPreview';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { toDashedLowercase } from '../../shared/utils';

const useStyles = makeStyles({
  card: {
    display: 'inline-block',
    margin: '16px',
  },
  cardContent: {
    padding: '24px',
  },
});

interface Props {
  chessTraps: ChessTrap[];
}

const DisplayChessTraps: React.FC<Props> = ({ chessTraps }) => {
  const classes = useStyles({});

  return (
    <>
      {chessTraps.map((trap) => (
        <Card key={trap.shortName} className={classes.card}>
          <CardContent className={classes.cardContent}>
            <NavLink to={`/traps/${toDashedLowercase(trap.shortName)}`}>
              <ChessLessonPreview
                chessTree={trap.chessTree}
                orientation={trap.playedByWhite ? 'white' : 'black'}
                title={trap.fullName}
              />
            </NavLink>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default DisplayChessTraps;
