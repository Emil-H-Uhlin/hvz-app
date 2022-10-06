import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

import './App.css';

function App() {
  function LoginButton() {
    const { loginWithRedirect } = useAuth0()
    return <button onClick={loginWithRedirect}>Log in with Auth0</button>
  }

  function LogoutButton() {
    const { logout } = useAuth0()
    return <button onClick={() => logout({returnTo: window.location.origin})}>Log out</button>
  }

  function UserDisplay() {
    const { user } = useAuth0()

    return user 
      ? <>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Uid: {user.sub}</p>
        <LogoutButton/>
      </>
      : <>
        <LoginButton/>
      </>
  }

  return <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN!}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
    audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    redirectUri={window.location.origin}
    scope="openid profile email">
      
      <div className="App">
        <UserDisplay/>
      </div>
    
    </Auth0Provider>
}

export default App;
