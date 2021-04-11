import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import useInterval from 'react-useinterval';

const DEFAULT_MS_BETWEEN_STEPS = 700;

export interface StepperToolkit {
  stepperValue: number;
  setStepperValue: Dispatch<SetStateAction<number>>;
};

export function useStepper(
  allowSteps = true,
  msBetweenSteps = DEFAULT_MS_BETWEEN_STEPS,
  delay?: number
): StepperToolkit {
  const [stepperValue, setStepperValue] = useState<number>(-1);

  const incrementStepper = () => setStepperValue((val) => val + 1);

  const stepperDelayTimeout = useRef<number | undefined>(undefined);

  // Clear the timeout on unmount
  useEffect(() => {
    window.clearTimeout(stepperDelayTimeout.current);
  }, []);

  const runStepper = () => {
    if (delay != undefined) {
      stepperDelayTimeout.current = window.setTimeout(incrementStepper, delay);
    } else {
      incrementStepper();
    }
  }

  useInterval(() => {
    if (allowSteps) runStepper();
  }, msBetweenSteps);

  return {
    stepperValue,
    setStepperValue,
  };
}
