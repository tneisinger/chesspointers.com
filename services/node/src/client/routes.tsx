import React, { FunctionComponent } from 'react';
import { Route } from 'react-router-dom';
import HomePage from './pages/Home';
import TrapsPage from './pages/Traps';
import OpeningsPage from './pages/Openings';
import OpeningPage from './pages/Opening';
import TrapPage from './pages/Trap';
import NotFoundPage from './pages/NotFound';
import AboutPage from './pages/About';
import AcknowledgementsPage from './pages/Acknowledgements';

interface RouteInfo {
  pageName?: string;
  component: FunctionComponent;
  path?: string;
  isPathExact: boolean;
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
    isInSideMenu: false,
  },
  {
    pageName: 'Openings',
    component: OpeningsPage,
    path: '/openings',
    isPathExact: true,
    isInSideMenu: true,
  },
  {
    component: OpeningPage,
    path: '/openings/:lessonName',
    isPathExact: true,
    isInSideMenu: false,
  },
  {
    pageName: 'Traps',
    component: TrapsPage,
    path: '/traps',
    isPathExact: true,
    isInSideMenu: true,
  },
  {
    component: TrapPage,
    path: '/traps/:lessonName',
    isPathExact: true,
    isInSideMenu: false,
  },
  {
    pageName: 'About',
    component: AboutPage,
    path: '/about',
    isPathExact: true,
    isInSideMenu: true,
  },
  {
    pageName: 'Acknowledgements',
    component: AcknowledgementsPage,
    path: '/acknowledgements',
    isPathExact: true,
    isInSideMenu: true,
  },
  {
    component: NotFoundPage,
    isPathExact: false,
    isInSideMenu: false,
  },
];

export function routesWithPaths(): RouteInfoWithPath[] {
  return routes.filter((route) => route.path != undefined) as RouteInfoWithPath[];
}

export function makeRoutes(): JSX.Element[] {
  return routes.map((route, idx) => {
    if (route.path) {
      return (
        <Route
          key={route.path + idx}
          exact={route.isPathExact}
          path={route.path}
          component={route.component}
        />
      );
    }

    return <Route key={'pathlessRoute' + idx} component={route.component} />;
  });
}
