import React, { useState } from 'react';
import useDimensions from 'react-use-dimensions';
import { Theme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core';
import ChessLessonPreview from './ChessLessonPreview';
import { ChessTrap } from '../../shared/entity/chessTrap';
import ChessTrapFilters from '../components/ChessTrapFilters';

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    display: 'inline-block',
    margin: '16px',
  },
  cardContent: {
    padding: '24px',
  },
  filtersBar: {
    opacity: 0.95,
    padding: '0.75rem',
    position: 'fixed',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    top: 'auto',
    bottom: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.sideMenuWidth,
      width: `calc(100% - ${theme.sideMenuWidth}px)`,
    },
  },
  chessLessonPreviewsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: '100%',
  },
}));

interface Props {
  chessTraps: ChessTrap[];
  parentWidth: number;
  trapsPerRow: number;
}

const DisplayChessTraps: React.FC<Props> = (props) => {
  const classes = useStyles(props);

  const [filtersBarRef, filtersBarDimensions] = useDimensions();

  const [visibleTraps, setVisibleTraps] = useState<ChessTrap[]>(props.chessTraps);

  return (
    <>
      <AppBar ref={filtersBarRef} className={classes.filtersBar} color='default'>
        <ChessTrapFilters
          allTraps={props.chessTraps}
          setSelectedTraps={setVisibleTraps}
        />
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
      <div style={{ height: filtersBarDimensions.height }} />
    </>
  );
};

export default DisplayChessTraps;
