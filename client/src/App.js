import React, {useState, useEffect} from 'react';
import Tracker from './container/Tracker/Tracker'
import Login from './container/Login/Login'

import './App.css'

function App() {
  const [isLoggedIn, setLoginStatus] = useState(false);
  const [code, setCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const hostname = 'http://' + window.location.hostname;
  const baseUrl = hostname.indexOf('localhost') != -1 ? hostname + ':8000' : hostname + '\/';

  const data = {
    code: code,
    redirect_uri: 'http://localhost:8000/'
  }

  const requestTokens = () => {
    const url = baseUrl + '/api/get-spotify-tokens';
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error();
      }
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      alert(error);
    });
  };

  useEffect(() => {
    const localLoggedInStatus = localStorage.getItem("isLoggedIn");
    const localCode = localStorage.getItem("code");
    if (localLoggedInStatus && !isLoggedIn && localCode) {
      setLoginStatus(true);
    } else if (!isLoggedIn) {
      const parameters = window.location.search;
      const urlCode = new URLSearchParams(parameters).get('code');
      const codeIsInParameters = !!urlCode;

      if (codeIsInParameters) {
        console.log("called");
        setCode(urlCode);
        setLoginStatus(true);
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('code', urlCode);
      }
    } else {
      const localAccessToken = localStorage.getItem("accessToken");
      const localRefreshToken = localStorage.getItem("refreshToken");

      const localTokensArePresent = localAccessToken && localRefreshToken;
      const statefulTokensArePresent = accessToken && refreshToken;

      if (localTokensArePresent && !statefulTokensArePresent) {
        setAccessToken(localAccessToken);
        setRefreshToken(localRefreshToken);
      } else if (!localTokensArePresent && !statefulTokensArePresent) {
        requestTokens()
        .then(data => {
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          localStorage.setItem('accessToken', data.access_token);
          localStorage.setItem('refreshToken', data.refresh_token);
        })
      }
    }
  }, [isLoggedIn, code]);

  let container = isLoggedIn ? <Tracker accessToken={accessToken} refreshToken={refreshToken}/> : <Login/>

  return (
    <div className="App">
      {container}
    </div>
  );
}

export default App;