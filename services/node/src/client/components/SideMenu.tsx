import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useAuth0, Auth0ContextInterface } from '@auth0/auth0-react';
import { routesWithPaths } from '../routes';
import NavLinkMui from './NavLinkMui';

export const SideMenu: React.FunctionComponent = () => {
  const { isAuthenticated }: Auth0ContextInterface = useAuth0();

  return (
    <List>
      {routesWithPaths().map((route, idx) => {
        if (route.sideMenuIcon && (!route.isPrivate || isAuthenticated)) {
          const Icon = route.sideMenuIcon;
          const path = route.sideMenuLink ? route.sideMenuLink : route.path;
          return (
            <ListItem key={route.path + idx} button component={NavLinkMui(path)}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={route.pageName} />
            </ListItem>
          );
        }
      })}
    </List>
  );
};
