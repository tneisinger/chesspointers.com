import React, { FunctionComponent } from 'react';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core/SvgIcon/SvgIcon';
import UsageIcon from '@material-ui/icons/Code';
import HomeIcon from '@material-ui/icons/Home';
import RouterIcon from '@material-ui/icons/Storage';
import FetchIcon from '@material-ui/icons/CloudDownload';
import StyledIcon from '@material-ui/icons/Style';
import LazyIcon from '@material-ui/icons/SystemUpdateAlt';
import LockIcon from '@material-ui/icons/Lock';
import { Route } from 'react-router-dom';
import HomePage from './pages/Home';
import UsagePage from './pages/Usage';
import UsersPage from './pages/Users';
import UserPage from './pages/User';
import NotFoundPage from './pages/NotFound';
import LazyLoadingPage from './pages/LazyLoading';
import StyledComponentsPage from './pages/StyledComponents';
import RouterPage from './pages/Router';
import PrivatePage from './pages/Private';
import PrivateRoute from './components/PrivateRoute';

type RouteType = {
  pageName?: string,
  component: FunctionComponent,
  path?: string,
  isPathExact: boolean,
  isPrivate: boolean,
  sideMenuIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>,
  sideMenuLink?: string,
};

export const routes: RouteType[] = [
  {
    pageName: 'Home',
    component: HomePage,
    path: '/',
    isPathExact: true,
    isPrivate: false,
    sideMenuIcon: HomeIcon,
  },
  {
    pageName: 'Usage',
    component: UsagePage,
    path: '/usage',
    isPathExact: true,
    isPrivate: false,
    sideMenuIcon: UsageIcon,
  },
  {
    pageName: 'Users',
    component: UsersPage,
    path: '/users',
    isPathExact: true,
    isPrivate: false,
    sideMenuIcon: FetchIcon,
  },
  {
    component: UserPage,
    path: '/users/:userId',
    isPathExact: false,
    isPrivate: false,
  },
  {
    pageName: 'Lazy Loading',
    component: LazyLoadingPage,
    path: '/lazy-example',
    isPathExact: false,
    isPrivate: false,
    sideMenuIcon: LazyIcon,
  },
  {
    pageName: 'Styled Components',
    component: StyledComponentsPage,
    path: '/styled-example',
    isPathExact: false,
    isPrivate: false,
    sideMenuIcon: StyledIcon,
  },
  {
    pageName: 'React Router',
    component: RouterPage,
    path: '/react-router/:slug',
    isPathExact: false,
    isPrivate: false,
    sideMenuIcon: RouterIcon,
    sideMenuLink: '/react-router/1234',
  },
  {
    pageName: 'Private Page',
    component: PrivatePage,
    path: '/private-page',
    isPathExact: false,
    isPrivate: true,
    sideMenuIcon: LockIcon,
  },
  {
    component: NotFoundPage,
    isPathExact: false,
    isPrivate: false,
  },
];

export function makeRoutes() {
  return routes.map((route, idx) => {
    const RouteComponent = route.isPrivate ? PrivateRoute : Route;
    if (route.path) {
      return (
        <RouteComponent
          key={route.path + idx}
          exact={route.isPathExact}
          path={route.path}
          component={route.component}
        />
      );
    }

    return (
      <RouteComponent
        key={"pathlessRoute" + idx}
        component={route.component}
      />
    );
  });
}
