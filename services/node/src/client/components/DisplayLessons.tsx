import React, { useState, useEffect, useRef } from 'react';
import { Lesson } from '../../shared/entity/lesson';
import useInterval from 'react-useinterval';
import ChessLessonCarousel from './ChessLessonsCarousel';

// ms between steps
const DEFAULT_STEPPER_SPEED = 700;

interface Props extends React.HTMLProps<HTMLDivElement> {
  allowAnimation: boolean;
  lessons: Lesson[];
  width?: number;
  stepperDelay?: number;
  stepperSpeed?: number;
}

const DisplayLessons: React.FC<Props> = (props) => {
  const [animatedLesson, setAnimatedLesson] = useState<string | null>(null);

  const [stepperValue, setStepperValue] = useState<number>(-1);

  const stepperDelayTimeout = useRef<number | undefined>(undefined);

  // Clear all the timeouts on unmount
  useEffect(() => {
    return clearTimeouts;
  }, []);

  const clearTimeouts = () => {
    const allTimeoutRefs = [
      stepperDelayTimeout,
    ];
    allTimeoutRefs.forEach((ref) => window.clearTimeout(ref.current));
  };

  const runStepper = () => {
    if (animatedLesson != null && props.allowAnimation) {
      if (props.stepperDelay) {
        stepperDelayTimeout.current =
          window.setTimeout(incrementStepper, props.stepperDelay);
      } else {
        incrementStepper();
      }
    }
  }

  const incrementStepper = () => setStepperValue((val) => val + 1);

  const stepperSpeed = props.stepperSpeed ? props.stepperSpeed : DEFAULT_STEPPER_SPEED;
  useInterval(runStepper, stepperSpeed);

  useEffect(() => {
    if (!props.allowAnimation) {
      setStepperValue(-1);
    }
  }, [props.allowAnimation]);

  return (
    <ChessLessonCarousel
      lessons={props.lessons}
      animatedLesson={animatedLesson}
      setAnimatedLesson={setAnimatedLesson}
      stepperValue={stepperValue}
      setStepperValue={setStepperValue}
      cardWidth={props.width}
    />
  );
};

export default DisplayLessons;
