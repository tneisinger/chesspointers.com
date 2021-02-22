import React, { useState } from 'react';
import useDimensions from 'react-use-dimensions';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import { ChessTrap } from '../../shared/entity/chessTrap';
import ChessTrapFiltersBar from '../components/ChessTrapFiltersBar';
import Typography from '@material-ui/core/Typography';
import useInterval from 'react-useinterval';
import ChessLessonCarousel from './ChessLessonsCarousel';

const useStyles = makeStyles((theme: Theme) => ({
  titleText: {
    [theme.breakpoints.up('sm')]: {
      fontSize: '3rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem',
    },
  },
  displayChessTrapsRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: (p: { filterBarHeight: number }) => `calc(100% - ${p.filterBarHeight}px)`,
  },
  mainContentDiv: {
    flexGrow: 1,
  },
}));

interface Props {
  chessTraps: ChessTrap[];
  parentWidth: number;
  trapsPerRow: number;
}

const DisplayChessTraps: React.FC<Props> = (props) => {
  const [filtersBarRef, filtersBarDimensions] = useDimensions();

  const classes = useStyles({ filterBarHeight: filtersBarDimensions.height });

  const [visibleTraps, setVisibleTraps] = useState<ChessTrap[]>(props.chessTraps);

  const [animatedTrap, setAnimatedTrap] = useState<string | null>(null);

  const [stepperValue, setStepperValue] = useState<number>(-1);

  useInterval(() => {
    if (animatedTrap != null) {
      setStepperValue(stepperValue + 1);
    }
  }, 700);

  return (
    <>
      <div className={classes.displayChessTrapsRoot}>
        <Typography variant='h3' align='center' className={classes.titleText}>
          Chess Traps
        </Typography>
        <ChessLessonCarousel
          chessTraps={visibleTraps}
          animatedTrap={animatedTrap}
          setAnimatedTrap={setAnimatedTrap}
          stepperValue={stepperValue}
          setStepperValue={setStepperValue}
        />
      </div>
      <ChessTrapFiltersBar
        allTraps={props.chessTraps}
        setSelectedTraps={setVisibleTraps}
        filtersBarRef={filtersBarRef}
      />
    </>
  );
};

export default DisplayChessTraps;
