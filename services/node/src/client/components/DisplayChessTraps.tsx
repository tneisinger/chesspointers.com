import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChessLessonPreview from './ChessLessonPreview';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { toDashedLowercase } from '../../shared/utils';
import ChessTrapFilters from '../components/ChessTrapFilters';

const useStyles = makeStyles({
  card: {
    display: 'inline-block',
    margin: '16px',
  },
  cardContent: {
    padding: '24px',
  },
  toolbar: {
    padding: '1rem 2rem',
  },
  appBar: {
    opacity: 0.95,
  },
});

interface Props {
  chessTraps: ChessTrap[];
}

const DisplayChessTraps: React.FC<Props> = ({ chessTraps }) => {
  const classes = useStyles({});

  const [visibleTraps, setVisibleTraps] = useState<ChessTrap[]>(chessTraps);

  return (
    <>
      <AppBar className={classes.appBar} position='sticky' color='default'>
        <ToolBar className={classes.toolbar}>
          <ChessTrapFilters allTraps={chessTraps} setSelectedTraps={setVisibleTraps} />
        </ToolBar>
      </AppBar>
      <div>
        {visibleTraps.map((trap) => (
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
      </div>
    </>
  );
};

export default DisplayChessTraps;
