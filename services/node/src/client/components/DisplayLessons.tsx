import React, { useState, useEffect } from 'react';
import { Lesson } from '../../shared/entity/lesson';
import ChessLessonCarousel from './ChessLessonsCarousel';
import { useStepper } from '../hooks/useStepper';

interface Props extends React.HTMLProps<HTMLDivElement> {
  allowAnimation: boolean;
  lessons: Lesson[];
  width?: number;
  stepperDelay?: number;
  msBetweenSteps?: number;
}

const DisplayLessons: React.FC<Props> = (props) => {
  const [animatedLesson, setAnimatedLesson] = useState<string | null>(null);

  const { stepperValue, setStepperValue } = useStepper({
    allowSteps: animatedLesson != null && props.allowAnimation,
    msBetweenSteps: props.msBetweenSteps,
    delay: props.stepperDelay,
  });

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
