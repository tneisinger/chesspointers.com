import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CssBaseline, makeStyles } from '@material-ui/core';
import {
  Theme,
  createMuiTheme,
  ThemeProvider,
  StylesProvider,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
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
  sideMenuWidth: 220,
  mainMaxWidth: 1200,
  overrides: {
    MuiCssBaseline: {
      '@global': {
        'html, body': {
          height: '100%',
          overflow: 'hidden',
        },
        '@media (hover: none)': {
          'a:hover': {
            textDecoration: 'none !important',
          },
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
        'header a': {
          '&:visited': {
            color: 'white',
          },
        },
      },
    },
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  appRoot: {
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
  appBar: {
    zIndex: 1400,
    [theme.breakpoints.up('lg')]: {
      width: theme.sideMenuWidth,
      left: 0,
    },
  },
  menuButton: {
    position: 'absolute',
    left: '16px',
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  siteTitleText: {
    margin: '0 auto',
    color: 'white',
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.2rem',
    },
  },
  toolbarAboveMain: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.up('lg')]: {
      height: 0,
      minHeight: 0,
    },
  },
}));

function AppContent() {
  const [windowInnerHeight, setWindowInnerHeight] = useState<number>(window.innerHeight);

  window.addEventListener('resize', () => {
    setWindowInnerHeight(window.innerHeight);
  });

  const classes = useStyles({ windowInnerHeight });

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen);
  };

  return (
    <>
      <CssBaseline />
      <StylesProvider injectFirst>
        <div className={classes.appRoot}>
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
                <span onClick={() => setIsMobileDrawerOpen(false)}>
                  <Link to={'/'}>ChessPointers.com</Link>
                </span>
              </Typography>
            </Toolbar>
          </AppBar>
          <SideMenu
            anchorSide={theme.direction === 'rtl' ? 'right' : 'left'}
            isMobileDrawerOpen={isMobileDrawerOpen}
            handleDrawerToggle={handleDrawerToggle}
            closeDrawer={() => setIsMobileDrawerOpen(false)}
          />
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
