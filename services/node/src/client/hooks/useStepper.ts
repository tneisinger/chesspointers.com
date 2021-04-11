import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import useInterval from 'react-useinterval';

const DEFAULT_MS_BETWEEN_STEPS = 700;

export interface StepperToolkit {
  stepperValue: number;
  setStepperValue: Dispatch<SetStateAction<number>>;
};

interface RequiredOptions {
  startValue: number;
  allowSteps: boolean;
  msBetweenSteps: number;
  delay: number | undefined;
}

export type Options = Partial<RequiredOptions>;

const DEFAULT_OPTIONS: RequiredOptions = {
  startValue: -1,
  allowSteps: true,
  msBetweenSteps: DEFAULT_MS_BETWEEN_STEPS,
  delay: undefined,
};

export function useStepper(specifiedOptions?: Options): StepperToolkit {
  const options: RequiredOptions = { ...DEFAULT_OPTIONS, ...specifiedOptions };

  const [stepperValue, setStepperValue] = useState<number>(options.startValue);

  const incrementStepper = () => setStepperValue((val) => val + 1);

  const stepperDelayTimeout = useRef<number | undefined>(undefined);

  // Clear the timeout on unmount
  useEffect(() => {
    window.clearTimeout(stepperDelayTimeout.current);
  }, []);

  const runStepper = () => {
    if (options.delay != undefined) {
      stepperDelayTimeout.current = window.setTimeout(incrementStepper, options.delay);
    } else {
      incrementStepper();
    }
  }

  useInterval(() => {
    if (options.allowSteps) runStepper();
  }, options.msBetweenSteps || DEFAULT_MS_BETWEEN_STEPS);

  return {
    stepperValue,
    setStepperValue,
  };
}
