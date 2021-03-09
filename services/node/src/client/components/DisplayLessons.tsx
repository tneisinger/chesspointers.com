import React, { useState, useEffect } from 'react';
import { Lesson } from '../../shared/entity/lesson';
import useInterval from 'react-useinterval';
import ChessLessonCarousel from './ChessLessonsCarousel';

interface Props extends React.HTMLProps<HTMLDivElement> {
  parentWidth: number;
  allowAnimation: boolean;
  lessons: Lesson[];
}

const DisplayLessons: React.FC<Props> = (props) => {
  const [animatedLesson, setAnimatedLesson] = useState<string | null>(null);

  const [stepperValue, setStepperValue] = useState<number>(-1);

  useInterval(() => {
    if (animatedLesson != null && props.allowAnimation) {
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
      lessons={props.lessons}
      animatedLesson={animatedLesson}
      setAnimatedLesson={setAnimatedLesson}
      stepperValue={stepperValue}
      setStepperValue={setStepperValue}
    />
  );
};

export default DisplayLessons;
