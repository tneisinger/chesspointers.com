import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import SideMenuList from './SideMenuList';

const useStyles = makeStyles((theme: Theme) => ({
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
          'smDown' is actually equivalent to what you would expect 'mdDown' to be. That is
          why above we have <Hidden mdUp> and below we have <Hidden smDown> rather than
          <Hidden mdDown>.
          Learn more here: https://github.com/mui-org/material-ui/issues/13448
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
