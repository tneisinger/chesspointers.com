import React from 'react';
import { useLocation } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { routesWithPaths } from '../routes';
import { makeStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import LinkMui from './LinkMui';

const useStyles = makeStyles((theme: Theme) => ({
  listItemText: {
    textAlign: 'center',
    color: 'white',
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
  closeDrawer: () => void;
}

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

export default SideMenuList;
