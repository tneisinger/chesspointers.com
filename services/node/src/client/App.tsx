import { CssBaseline, makeStyles } from '@material-ui/core';
import {
  createStyles,
  Theme,
  createMuiTheme,
  ThemeProvider,
  StylesProvider,
} from '@material-ui/core/styles';
import React from 'react';
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
  overrides: {
    MuiCssBaseline: {
      '@global': {
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
            color: '#d6d8de'
          },
          '&:hover': {
            textDecoration: 'underline',
          }
        }
      }
    }
  }
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    main: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

export const App = () => {
  const classes = useStyles({});

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <StylesProvider injectFirst>
            <SideMenu />
            <main className={classes.main}>
              <Switch>
                {makeRoutes()}
              </Switch>
            </main>
          </StylesProvider>
        </ThemeProvider>
      </div>
    </BrowserRouter>
  );
};
