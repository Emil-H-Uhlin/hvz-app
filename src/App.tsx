import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

import './App.css';
import checkIfAdmin from './util/checkAdmin';

function App() {
  
  const [currentUser, setUser] = useState<any | null>(null)
  
  function LoginButton() {
    const { loginWithRedirect } = useAuth0()
    return <button onClick={loginWithRedirect}>Log in with Auth0</button>
  }

  function LogoutButton() {
    const { logout } = useAuth0()
    return <button onClick={() => {
      logout({returnTo: window.location.origin})
      setUser(null)
    }}>Log out</button>
  }

  function UserDisplay() {
    const { user, getAccessTokenSilently } = useAuth0()
    
    if (user && !currentUser) {
      (async function() {
        await getAccessTokenSilently().then(token => setUser({
          ...user, 
          isAdmin: checkIfAdmin(token),
          token
        })).catch(e => console.log(e))
      })()
    }
    
    return currentUser 
      ? <>
        <p>Name: {currentUser.name}</p>
        <p>Email: {currentUser.email}</p>
        <p>Uid: {currentUser.sub}</p>
        <p>Admin: {currentUser.isAdmin ? "yes" : "no"}</p>
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
