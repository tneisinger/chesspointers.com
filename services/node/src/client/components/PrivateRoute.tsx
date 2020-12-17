import React from 'react';
import { Route } from 'react-router-dom';
import { useAuth0, Auth0ContextInterface } from "@auth0/auth0-react";
import NotFoundPage from "../pages/NotFound";

const PrivateRoute = ({component: Component, ...rest}) => {
  const { isAuthenticated }: Auth0ContextInterface = useAuth0();

  return (
    <Route {...rest} render={(props) => (
      isAuthenticated ? <Component {...props} /> : <NotFoundPage />
    )} />
  );
};

export default PrivateRoute
