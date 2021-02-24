import React, { useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import { ChessTrap } from '../../shared/entity/chessTrap';
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
  },
}));

interface Props extends React.HTMLProps<HTMLDivElement> {
  parentWidth: number;
  trapsPerRow: number;
  chessTraps: ChessTrap[];
}

const DisplayChessTraps: React.FC<Props> = (props) => {
  const classes = useStyles({});

  const [animatedTrap, setAnimatedTrap] = useState<string | null>(null);

  const [stepperValue, setStepperValue] = useState<number>(-1);

  useInterval(() => {
    if (animatedTrap != null) {
      setStepperValue(stepperValue + 1);
    }
  }, 700);

  return (
    <ChessLessonCarousel
      chessTraps={props.chessTraps}
      animatedTrap={animatedTrap}
      setAnimatedTrap={setAnimatedTrap}
      stepperValue={stepperValue}
      setStepperValue={setStepperValue}
    />
  );
};

export default DisplayChessTraps;
