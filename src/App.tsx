import { Auth0Provider, useAuth0, User } from '@auth0/auth0-react';
import UserProvider, { UserContext } from './UserProvider'
import { useState } from 'react';

import './App.css';

import checkIfAdmin from './util/checkAdmin';
import LoginPage from "./components/login/LoginPage";

function App() {
  return <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN!}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
    audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    redirectUri={window.location.origin}
    scope="openid profile email">

      <UserProvider>
        <LoginPage/>
      </UserProvider>
    </Auth0Provider>
}

export default App;

export interface hvzUser extends User {
  isAdmin: boolean,
  token: string
}
