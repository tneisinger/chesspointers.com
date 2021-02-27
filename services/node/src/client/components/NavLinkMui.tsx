import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Link } from 'react-router-dom';

const NavLinkMui = (
  to: string,
  closeDrawer: () => void,
): ForwardRefExoticComponent<RefAttributes<unknown>> =>
  React.forwardRef((props, ref) => (
    <span onClick={closeDrawer}>
      <Link {...props} ref={ref as any} to={to} />
    </span>
  ));

export default NavLinkMui;
