import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Main from './pages/Main'
import Update from './pages/Update'
import { setSocket, onMessageReceived, emitEvent } from './socket';
import PrimarySearchAppBar from './components/NavBar'
export default function BasicExample() {
 
  return (
    <>    
      <PrimarySearchAppBar />
      <Router>
        <div>
          <Switch>
          <Route exact path="/">
              
              <Main />
          </Route>
          <Route path="/update/:updateID">
            <Update />
          </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}