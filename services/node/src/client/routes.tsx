import React, { FunctionComponent } from 'react';
import { Route } from 'react-router-dom';
import HomePage from './pages/Home';
import TrapsPage from './pages/Traps';
import OpeningsPage from './pages/Openings';
import OpeningPage from './pages/Opening';
import TrapPage from './pages/Trap';
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
  isInSideMenu: boolean;
}

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
    isInSideMenu: false,
  },
  {
    pageName: 'Openings',
    component: OpeningsPage,
    path: '/openings',
    isPathExact: true,
    isPrivate: false,
    isInSideMenu: true,
  },
  {
    component: OpeningPage,
    path: '/openings/:lessonName',
    isPathExact: true,
    isPrivate: false,
    isInSideMenu: false,
  },
  {
    pageName: 'Traps',
    component: TrapsPage,
    path: '/traps',
    isPathExact: true,
    isPrivate: false,
    isInSideMenu: true,
  },
  {
    component: TrapPage,
    path: '/traps/:lessonName',
    isPathExact: true,
    isPrivate: false,
    isInSideMenu: false,
  },
  {
    pageName: 'Merge Traps',
    component: MergeTrapsPage,
    path: '/merge-traps',
    isPathExact: true,
    isPrivate: false,
    isInSideMenu: true,
  },
  {
    pageName: 'Private Page',
    component: PrivatePage,
    path: '/private-page',
    isPathExact: false,
    isPrivate: true,
    isInSideMenu: false,
  },
  {
    component: NotFoundPage,
    isPathExact: false,
    isPrivate: false,
    isInSideMenu: false,
  },
];

export function routesWithPaths(): RouteInfoWithPath[] {
  return routes.filter((route) => route.path != undefined) as RouteInfoWithPath[];
}

export function makeRoutes(): JSX.Element[] {
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

    return <RouteComponent key={'pathlessRoute' + idx} component={route.component} />;
  });
}
