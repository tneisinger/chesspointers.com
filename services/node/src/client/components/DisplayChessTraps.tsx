import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core';
import ChessLessonPreview from './ChessLessonPreview';
import { ChessTrap } from '../../shared/entity/chessTrap';
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
  parentWidth: number;
  trapsPerRow: number;
}

const DisplayChessTraps: React.FC<Props> = ({ chessTraps, parentWidth, trapsPerRow }) => {
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
          <ChessLessonPreview
            key={trap.shortName}
            chessTrap={trap}
            cardWidth={parentWidth / trapsPerRow}
          />
        ))}
      </div>
    </>
  );
};

export default DisplayChessTraps;
