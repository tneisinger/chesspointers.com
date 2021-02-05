import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import { NavLink } from 'react-router-dom';

const NavLinkMui = (to: string): ForwardRefExoticComponent<RefAttributes<unknown>> =>
  React.forwardRef((props, ref) => <NavLink {...props} ref={ref as any} to={to} />);

export default NavLinkMui;
