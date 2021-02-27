import React from 'react';
import { useLocation } from 'react-router-dom';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { routesWithPaths } from '../routes';
import NavLinkMui from './NavLinkMui';

const useStyles = makeStyles((theme: Theme) => ({
  listItemText: {
    textAlign: 'center',
    color: 'white',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: theme.sideMenuWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    [theme.breakpoints.up('sm')]: {
      width: theme.sideMenuWidth,
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 160,
    },
  },
  toolbar: {
    ...theme.mixins.toolbar,
  },
  currentLocationLink: {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  linksList: {
    paddingTop: 0,
  },
}));

interface Props {
  anchorSide: 'right' | 'left';
  isMobileDrawerOpen: boolean;
  handleDrawerToggle: () => void;
}

export const SideMenu: React.FC<Props> = (props) => {
  const classes = useStyles({});

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <nav className={classes.drawer}>
      <Hidden smUp implementation='css'>
        <Drawer
          container={container}
          variant='temporary'
          anchor={props.anchorSide}
          open={props.isMobileDrawerOpen}
          onClose={props.handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <div className={classes.toolbar} />
          <SideMenuList />
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation='css'>
        <Drawer
          variant='permanent'
          classes={{
            paper: classes.drawerPaper,
          }}
          open
        >
          <div className={classes.toolbar} />
          <SideMenuList />
        </Drawer>
      </Hidden>
    </nav>
  );
};

const SideMenuList: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <List className={classes.linksList}>
      {routesWithPaths().map((route, idx) => {
        if (route.isInSideMenu) {
          return (
            <ListItem
              key={route.path + idx}
              className={
                location.pathname === route.path ? classes.currentLocationLink : ''
              }
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
