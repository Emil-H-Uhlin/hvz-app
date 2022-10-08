import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Auth0Provider, useAuth0, User } from '@auth0/auth0-react';
import UserProvider, { UserContext } from './UserProvider'

import './App.css';

import LoginPage from "./components/login/LoginPage";
import {AdminPage} from "./components/admin/AdminPage";

function App() {
  return <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN!}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
    audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    redirectUri={window.location.origin}
    scope="openid profile email">
      <UserProvider>
          <Router>
              <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/admin" element={<AdminPage />} />
              </Routes>
          </Router>
      </UserProvider>
    </Auth0Provider>
}

export default App;

export interface hvzUser extends User {
  isAdmin: boolean,
  token: string
}
