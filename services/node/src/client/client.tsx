import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { Auth0Provider, AppState } from "@auth0/auth0-react";
import { Provider } from 'react-redux';
import store from './redux/store';
import history from "./utils/history";

const onRedirectCallback = (appState: AppState) => {
  history.push(
    appState && appState.returnTo
      ? appState.returnTo
      : window.location.pathname
  );
};

ReactDOM.render(
  <Provider store={store}>
    <Auth0Provider
      domain={process.env.AUTH0_DOMAIN}
      clientId={process.env.AUTH0_CLIENTID}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  </Provider>,
  document.getElementById('app'));
