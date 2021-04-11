import { useState, useEffect, useRef } from 'react';
import useInterval from 'react-useinterval';

const DEFAULT_MS_BETWEEN_STEPS = 700;

export function useStepper(
  msBetweenSteps = DEFAULT_MS_BETWEEN_STEPS,
  allowSteps = true,
  delay?: number
): number {
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

  return stepperValue;
}
