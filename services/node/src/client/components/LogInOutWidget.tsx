import { makeStyles, Typography, Button } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useAuth0, Auth0ContextInterface } from "@auth0/auth0-react";

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    greeting: {
      color: 'white',
    }
  }),
);

export const LogInOutWidget = () => {
  const classes = useStyles({});

  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  }: Auth0ContextInterface = useAuth0();

  const logoutWithRedirect = () => (
    logout({ returnTo: window.location.origin })
  );

  if (isAuthenticated) {
    return (
      <>
        <Typography noWrap className={classes.greeting}>
          Hi, {user.given_name} |
        </Typography>
        <Button
          color="inherit"
          onClick={logoutWithRedirect}
        >
          Logout
        </Button>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button
        color="inherit"
        onClick={loginWithRedirect}
      >
        Login
      </Button>
    );
  }
};
