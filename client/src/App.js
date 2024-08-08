import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from 'axios';

import {
  setToken,         
  deleteToken,  
  getToken,
  initAxiosInterceptors
} from './Helpers/auth-helpers';

import Nav from './Components/Nav';
import Loading from './Components/Loading';
import Error from './Components/Error';
import Signup from './Views/Signup';
import Login from './Views/Login';
import Chatroom from './Views/Chatroom';
import Chat from './Views/Chat';
import Main from './Components/Main';
 
 

initAxiosInterceptors();

export default function App() { 

  const [user, setUser] = useState(null);  
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function cargarUsuario() {
      if (!getToken()) {
        setCargandoUsuario(false);
        return;
      }
      try {
        const { data: user } = await Axios.get('/api/users/whoami');
        setUser(user);
        setCargandoUsuario(false);
      } catch (error) {
        console.log(error);
      }
    }
    cargarUsuario();
  }, []);


  async function login(email, password) {
    const { data } = await Axios.post('/api/users/login', {
      email,
      password
    });
    setUser(data.user);
    setToken(data.token);
  }


  async function signup(user) {
    const { data } = await Axios.post('/api/users/signup', user);
    setUser(data.user);
    setToken(data.token);
  }


  function logout() {
    setUser(null);
    deleteToken();
  }
 
  function esconderError() {
    setError(null);
  }


  if (cargandoUsuario) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }
  return (
    <Router>
      <Nav user={user} logout={logout} />
      <Error mensaje={error} esconderError={esconderError} />
      {user ? (
        <LoginRoutes
          user={user}
          logout={logout}
        />
      ) : (
        <LogoutRoutes
          login={login}
          signup={signup}
         />
      )}
    </Router>
  );
}





function LoginRoutes({ user, logout }) {
  return (
    <Switch>

 


      <Route
        path="/chat/:recepientId"
        render={props => (
          <Chat
            {...props}
            user={user}
            logout={logout}
          />
        )}
      />


     <Route
        path="/"
        render={props => (
          <Chatroom {...props} user={user} logout={logout} />
        )}
        default
      />


    </Switch>
  );
}




function LogoutRoutes({ login, signup }) {
  return (
    <Switch>
      <Route
        path="/login/"
        render={props => (
          <Login {...props} login={login} />
        )}
      />
      <Route
        render={props => (
          <Signup {...props} signup={signup} />
        )}
        default
      />
    </Switch>
  );
}




