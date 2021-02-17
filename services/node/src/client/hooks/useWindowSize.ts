import { useState, useEffect } from 'react';

// This code is from https://usehooks.com/useWindowSize/

type WindowDimensions = {
  windowWidth: number;
  windowHeight: number;
};

export function useWindowSize(): WindowDimensions {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<WindowDimensions>({
    windowWidth: 0,
    windowHeight: 0,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      if (window.innerWidth == undefined || window.innerHeight == undefined) {
        throw new Error('window width and/or height was undefined');
      }

      // Set window width/height to state
      setWindowSize({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}
