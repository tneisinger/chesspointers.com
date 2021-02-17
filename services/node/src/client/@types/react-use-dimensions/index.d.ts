declare module 'react-use-dimensions' {
  import React, { MutableRefObject } from 'react';
  function useDimensions(): [React.MutableRefObject<HTMLElement>, ClientRect];
  export default useDimensions;
}
