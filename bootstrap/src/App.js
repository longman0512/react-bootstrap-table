import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Main from './pages/Main'
import Update from './pages/Update'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import { setSocket, onMessageReceived, emitEvent } from './socket';
import PrimarySearchAppBar from './components/NavBar'
export default function BasicExample() {

  return (
    <>
      <Router>
        <Switch>
          <Route path="/main">
            <PrimarySearchAppBar />
            <Main />
          </Route>
          <Route path="/signin">
            <Signin />
          </Route>
          <Route path="/update/:updateID">
            <PrimarySearchAppBar />
            <Update />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/*">
            <Redirect to="signin" />
          </Route>
        </Switch>
      </Router>
    </>
  );
}