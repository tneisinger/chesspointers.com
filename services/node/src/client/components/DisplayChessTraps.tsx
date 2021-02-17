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
    padding: '0.5rem 1rem',
  },
  filtersBar: {
    opacity: 0.95,
    position: 'sticky',
    width: 'inherit',
    maxWidth: 'inherit',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    // The `top value has to match the MUI toolbar height. the height of the MUI toolbar
    // is defined at `theme.mixins.toolbar`. The values below are based on the values in
    // `theme.mixins.toolbar`.
    top: 56,
    '@media (min-width:0px) and (orientation: landscape)': { top: 48 },
    '@media (min-width:600px)': { top: 64 },
  },
  chessLessonPreviewsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop: '12px',
    width: '100%',
  },
});

interface Props {
  chessTraps: ChessTrap[];
  parentWidth: number;
  trapsPerRow: number;
}

const DisplayChessTraps: React.FC<Props> = (props) => {
  const classes = useStyles(props);

  const [visibleTraps, setVisibleTraps] = useState<ChessTrap[]>(props.chessTraps);

  return (
    <>
      <AppBar className={classes.filtersBar} color='default'>
        <ToolBar className={classes.toolbar}>
          <ChessTrapFilters
            allTraps={props.chessTraps}
            setSelectedTraps={setVisibleTraps}
          />
        </ToolBar>
      </AppBar>
      <div className={classes.chessLessonPreviewsContainer}>
        {visibleTraps.map((trap) => (
          <ChessLessonPreview
            key={trap.shortName}
            chessTrap={trap}
            cardWidth={props.parentWidth / props.trapsPerRow - 30 * props.trapsPerRow}
          />
        ))}
      </div>
    </>
  );
};

export default DisplayChessTraps;
