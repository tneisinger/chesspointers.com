import React, { useState } from 'react';
import { CssBaseline, makeStyles } from '@material-ui/core';
import {
  Theme,
  createMuiTheme,
  ThemeProvider,
  StylesProvider,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { BrowserRouter, Switch } from 'react-router-dom'; // Pages
import { SideMenu } from './components/SideMenu';
import { makeRoutes } from './routes';
import 'react-chessground/dist/styles/chessground.css';

const SCROLLBAR_BACKGROUND_COLOR = 'rgba(100, 100, 100, 1)';
const SCROLLBAR_FOREGROUND_COLOR = 'rgba(150, 150, 150, 1)';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  sideMenuWidth: 240,
  mainMaxWidth: 1200,
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          height: '100%',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${SCROLLBAR_FOREGROUND_COLOR} ${SCROLLBAR_BACKGROUND_COLOR}`,
        },
        '*::-webkit-scrollbar': {
          width: '10px',
        },
        '*::-webkit-scrollbar-track': {
          background: SCROLLBAR_BACKGROUND_COLOR,
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: SCROLLBAR_FOREGROUND_COLOR,
          borderRadius: '5px',
        },
        a: {
          color: 'white',
          textDecoration: 'none',
          '&:visited': {
            color: '#d6d8de',
          },
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: (p: { windowInnerHeight: number }) => p.windowInnerHeight,
  },
  main: {
    flexGrow: 1,
    width: '100vw',
    maxWidth: theme.mainMaxWidth,
    margin: '0 auto',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: theme.sideMenuWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: 1400,
    [theme.breakpoints.up('sm')]: {
      width: theme.sideMenuWidth,
      left: 0,
    },
  },
  menuButton: {
    position: 'absolute',
    left: '16px',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  siteTitleText: {
    margin: '0 auto',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.25rem',
    },
  },
  toolbar: {
    ...theme.mixins.toolbar,
  },
  toolbarAboveMain: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.up('sm')]: {
      height: 0,
      minHeight: 0,
    },
  },
  drawerPaper: {
    width: theme.sideMenuWidth,
  },
}));

function AppContent() {
  const [windowInnerHeight, setWindowInnerHeight] = useState<number>(window.innerHeight);

  window.addEventListener('resize', () => {
    setWindowInnerHeight(window.innerHeight);
  });

  const classes = useStyles({ windowInnerHeight });

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <>
      <CssBaseline />
      <StylesProvider injectFirst>
        <div className={classes.root}>
          <AppBar position='fixed' className={classes.appBar}>
            <Toolbar>
              <IconButton
                aria-label='open drawer'
                edge='start'
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant='h6' noWrap className={classes.siteTitleText}>
                ChessGuide.app
              </Typography>
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer}>
            <Hidden smUp implementation='css'>
              <Drawer
                container={container}
                variant='temporary'
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true,
                }}
              >
                <div className={classes.toolbar} />
                <SideMenu />
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
                <SideMenu />
              </Drawer>
            </Hidden>
          </nav>
          <div className={classes.toolbarAboveMain} />
          <main className={classes.main}>
            <Switch>{makeRoutes()}</Switch>
          </main>
        </div>
      </StylesProvider>
    </>
  );
}

export const App = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
};
