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
import LinkMui from './LinkMui';

const useStyles = makeStyles((theme: Theme) => ({
  listItemText: {
    textAlign: 'center',
    color: 'white',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: theme.sideMenuWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    [theme.breakpoints.up('md')]: {
      width: theme.sideMenuWidth,
    },
    [theme.breakpoints.down('md')]: {
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
  closeDrawer: () => void;
}

export const SideMenu: React.FC<Props> = (props) => {
  const classes = useStyles({});

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <nav className={classes.drawer}>
      <Hidden mdUp>
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
          <SideMenuList {...props} />
        </Drawer>
      </Hidden>
      {/* There is a bug in MUIv4 where all 'xxDown' options are off by one, meaning
          'smDown' is actually equivalent to 'mdDown'. That is why above we have
          <Hidden mdUp> and below we have <Hidden smDown> rather than <Hidden mdDown>.
          Learn more here:
              https://github.com/mui-org/material-ui/issues/13448
      */}
      <Hidden smDown>
        <Drawer
          variant='permanent'
          classes={{
            paper: classes.drawerPaper,
          }}
          open
        >
          <div className={classes.toolbar} />
          <SideMenuList {...props} />
        </Drawer>
      </Hidden>
    </nav>
  );
};

const SideMenuList: React.FC<Props> = ({ closeDrawer }) => {
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
              component={LinkMui(route.path, closeDrawer)}
            >
              <ListItemText className={classes.listItemText} primary={route.pageName} />
            </ListItem>
          );
        }
      })}
    </List>
  );
};
