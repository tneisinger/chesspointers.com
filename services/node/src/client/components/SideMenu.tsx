import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import { useAuth0, Auth0ContextInterface } from "@auth0/auth0-react";
import { routes } from '../routes';

const NavLinkMui = (to: string) =>
  React.forwardRef((props, ref) => <NavLink {...props} ref={ref as any} to={to} />);

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
  }),
);

export const SideMenu: React.FunctionComponent = () => {
  const classes = useStyles({});

  const {
    isAuthenticated,
  }: Auth0ContextInterface = useAuth0();

  return (
    <Drawer
      className={classes.drawer}
      variant='permanent'
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <List>
        {routes.map((route, idx) => {
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
    </Drawer>
  );
};
