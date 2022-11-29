import {BrowserRouter as Router, Routes, Route, Outlet, Navigate} from 'react-router-dom'

import {Auth0Provider, User} from '@auth0/auth0-react';
import UserProvider from './UserProvider'
import {QueryClientProvider, QueryClient} from "react-query";

import AdminPage from "./components/admin/AdminPage";
import TitlePage from "./components/title/TitlePage";
import HomePage from "./components/home/HomePage";
import KillPage from "./components/home/games/KillPage";
import GamePage from "./components/home/games/GamePage";

import "./App.sass"
import ProfilePage from "./components/profile/ProfilePage";
import Navbar from "./components/nav/Navbar"

export interface HvzUser extends User {
    isAdmin: boolean,
    token: string
}

const queryClient = new QueryClient()

function App() {
  return <div className="container"><Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN!}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
    audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    redirectUri={window.location.origin}
    scope="openid profile email">

      <QueryClientProvider client={queryClient}>
          <UserProvider>
              <Router>
                  <Navbar />
                  <Routes>
                      <Route index path="/" element={<TitlePage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/admin" element={<AdminPage />} />
                      <Route path="/kill" element={<KillPage />} />
                      <Route path="/games" element={<Outlet /> }>
                          <Route path="/games/" element={<Navigate replace to="/home" /> } />
                          <Route path="/games/:id" element={<GamePage /> } />
                      </Route>
                  </Routes>
              </Router>
          </UserProvider>
      </QueryClientProvider>
  </Auth0Provider>
  </div>
}

export default App;
