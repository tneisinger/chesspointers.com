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
import './globalStyles.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
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
