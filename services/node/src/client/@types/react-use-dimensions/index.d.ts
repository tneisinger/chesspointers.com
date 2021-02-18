declare module 'react-use-dimensions' {
  import React from 'react';
  type RefType = MutableRefObject<any> | RefObject<HTMLDivElement>;
  function useDimensions(): [RefType, ClientRect];
  export default useDimensions;
}
