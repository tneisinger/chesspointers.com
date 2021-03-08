import React, { useState, useEffect } from 'react';
import { Trap } from '../../shared/entity/trap';
import useInterval from 'react-useinterval';
import ChessLessonCarousel from './ChessLessonsCarousel';

interface Props extends React.HTMLProps<HTMLDivElement> {
  parentWidth: number;
  allowAnimation: boolean;
  traps: Trap[];
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
      traps={props.traps}
      animatedTrap={animatedTrap}
      setAnimatedTrap={setAnimatedTrap}
      stepperValue={stepperValue}
      setStepperValue={setStepperValue}
    />
  );
};

export default DisplayTraps;
