import React, { FunctionComponent } from 'react';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core/SvgIcon/SvgIcon';
import HomeIcon from '@material-ui/icons/Home';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import LockIcon from '@material-ui/icons/Lock';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import { Route } from 'react-router-dom';
import HomePage from './pages/Home';
import ChessTrapsPage from './pages/ChessTraps';
import ChessTrapPage from './pages/ChessTrap';
import MergeTrapsPage from './pages/MergeTraps';
import NotFoundPage from './pages/NotFound';
import PrivatePage from './pages/Private';
import PrivateRoute from './components/PrivateRoute';

interface RouteInfo {
  pageName?: string;
  component: FunctionComponent;
  path?: string;
  isPathExact: boolean;
  isPrivate: boolean;
  sideMenuIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  sideMenuLink?: string;
};

interface RouteInfoWithPath extends RouteInfo {
  path: string;
}

export const routes: RouteInfo[] = [
  {
    pageName: 'Home',
    component: HomePage,
    path: '/',
    isPathExact: true,
    isPrivate: false,
    sideMenuIcon: HomeIcon,
  },
  {
    pageName: 'Chess Traps',
    component: ChessTrapsPage,
    path: '/traps',
    isPathExact: true,
    isPrivate: false,
    sideMenuIcon: ThumbUpIcon,
  },
  {
    component: ChessTrapPage,
    path: '/traps/:trapName',
    isPathExact: true,
    isPrivate: false,
  },
  {
    pageName: 'Merge Traps',
    component: MergeTrapsPage,
    path: '/merge-traps',
    isPathExact: true,
    isPrivate: false,
    sideMenuIcon: MergeTypeIcon,
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

export function routesWithPaths(): RouteInfoWithPath[] {
  return routes.filter(route => route.path != undefined) as RouteInfoWithPath[];
}

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
