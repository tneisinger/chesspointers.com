import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Link } from 'react-router-dom';

const LinkMui = (
  to: string,
  onClick: () => void = () => void 0,
): ForwardRefExoticComponent<RefAttributes<unknown>> =>
  React.forwardRef((props, ref) => (
    <span onClick={onClick}>
      <Link {...props} ref={ref as any} to={to} />
    </span>
  ));

export default LinkMui;
