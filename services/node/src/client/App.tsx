import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
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
import { useWindowSize } from './hooks/useWindowSize';
import 'react-chessground/dist/styles/chessground.css';
import './page-transitions.css';
import metadata from '../shared/metadata.json';

const SCROLLBAR_BACKGROUND_COLOR = 'rgba(100, 100, 100, 1)';
const SCROLLBAR_FOREGROUND_COLOR = 'rgba(150, 150, 150, 1)';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  typography: {
    h1: {
      fontWeight: 200,
    },
    h2: {
      fontWeight: 100,
    },
    h3: {
      fontWeight: 100,
    },
    h4: {
      fontWeight: 100,
    },
    h5: {
      fontWeight: 100,
    },
    h6: {
      fontWeight: 100,
    },
  },
  sideMenuWidth: 220,
  mainMaxWidth: 1200,
  overrides: {
    MuiCssBaseline: {
      '@global': {
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
    height: (p: { windowHeight: number }) => p.windowHeight,
  },
  mainWrapper: {
    flexGrow: 1,
    width: '100vw',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.between('md', 'lg')]: {
      width: `calc(100vw - ${theme.sideMenuWidth}px)`,
      margin: 0,
      marginLeft: 'auto',
    },
  },
  main: {
    flexGrow: 1,
    width: 'inherit',
    maxWidth: theme.mainMaxWidth,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  transitionGroup: {
    flexGrow: 1,
    width: 'inherit',
    maxWidth: theme.mainMaxWidth,
  },
  appBar: {
    zIndex: 1400,
    [theme.breakpoints.up('md')]: {
      width: theme.sideMenuWidth,
      left: 0,
    },
  },
  menuButton: {
    position: 'absolute',
    left: '16px',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  siteTitleSpan: {
    margin: '0 auto',
  },
  siteTitleText: {
    color: 'white',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      fontSize: '1.2rem',
    },
  },
  siteTitleLink: {
    textDecoration: 'none',
  },
  toolbarAboveMain: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.up('md')]: {
      height: 0,
      minHeight: 0,
    },
  },
}));

function AppContent() {
  const { windowHeight } = useWindowSize();

  const classes = useStyles({ windowHeight });

  const location = useLocation();

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
              <span
                className={classes.siteTitleSpan}
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                <Typography
                  className={classes.siteTitleText}
                  variant='h6'
                  component='h1'
                  noWrap
                >
                  <Link className={classes.siteTitleLink} to={'/'}>
                    {metadata.siteTitle}
                  </Link>
                </Typography>
              </span>
            </Toolbar>
          </AppBar>
          <SideMenu
            anchorSide={theme.direction === 'rtl' ? 'right' : 'left'}
            isMobileDrawerOpen={isMobileDrawerOpen}
            handleDrawerToggle={handleDrawerToggle}
            closeDrawer={() => setIsMobileDrawerOpen(false)}
          />
          <div className={classes.toolbarAboveMain} />
          <div className={classes.mainWrapper}>
            <main className={classes.main}>
              <TransitionGroup className={classes.transitionGroup}>
                <CSSTransition
                  unmountOnExit
                  key={location.key}
                  classNames='fade'
                  timeout={400}
                >
                  <Switch location={location}>{makeRoutes()}</Switch>
                </CSSTransition>
              </TransitionGroup>
            </main>
          </div>
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
