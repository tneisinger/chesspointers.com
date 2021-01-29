import React from 'react';
import { NavLink } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import { useAuth0, Auth0ContextInterface } from '@auth0/auth0-react';
import { routesWithPaths } from '../routes';

const NavLinkMui = (to: string) =>
  React.forwardRef((props, ref) => <NavLink {...props} ref={ref as any} to={to} />);

const drawerWidth = 240;

const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    siteTitle: {
      padding: '1rem 0 1rem 0',
      textAlign: 'center',
    },
  }),
);

export const SideMenu: React.FunctionComponent = () => {
  const classes = useStyles({});

  const { isAuthenticated }: Auth0ContextInterface = useAuth0();

  return (
    <Drawer
      className={classes.drawer}
      variant='permanent'
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <AppBar position='static'>
        <Typography className={classes.siteTitle} variant='h6' component='h1'>
          <NavLink to={'/'}>LearnChessTraps.com</NavLink>
        </Typography>
      </AppBar>
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
    </Drawer>
  );
};
