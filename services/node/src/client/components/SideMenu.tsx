import React from 'react';
import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useAuth0, Auth0ContextInterface } from '@auth0/auth0-react';
import { routesWithPaths } from '../routes';
import NavLinkMui from './NavLinkMui';

const useStyles = makeStyles({
  listItemText: {
    textAlign: 'center',
    color: 'white',
  },
});

export const SideMenu: React.FunctionComponent = () => {
  const { isAuthenticated }: Auth0ContextInterface = useAuth0();

  const classes = useStyles({});

  return (
    <List>
      {routesWithPaths().map((route, idx) => {
        if (route.isInSideMenu && (!route.isPrivate || isAuthenticated)) {
          return (
            <ListItem
              key={route.path + idx}
              button
              alignItems='center'
              component={NavLinkMui(route.path)}
            >
              <ListItemText className={classes.listItemText} primary={route.pageName} />
            </ListItem>
          );
        }
      })}
    </List>
  );
};
