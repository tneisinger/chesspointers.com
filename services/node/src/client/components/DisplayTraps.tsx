import React, { useState, useEffect } from 'react';
import { Trap } from '../../shared/entity/chessTrap';
import useInterval from 'react-useinterval';
import ChessLessonCarousel from './ChessLessonsCarousel';

interface Props extends React.HTMLProps<HTMLDivElement> {
  parentWidth: number;
  trapsPerRow: number;
  allowAnimation: boolean;
  chessTraps: Trap[];
}

const DisplayTraps: React.FC<Props> = (props) => {
  const [animatedTrap, setAnimatedTrap] = useState<string | null>(null);

  const [stepperValue, setStepperValue] = useState<number>(-1);

  useInterval(() => {
    if (animatedTrap != null && props.allowAnimation) {
      setStepperValue(stepperValue + 1);
    }
  }, 700);

  useEffect(() => {
    if (!props.allowAnimation) {
      setStepperValue(-1);
    }
  }, [props.allowAnimation]);

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

export default DisplayTraps;
