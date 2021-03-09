import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Main from './Main'
import Update from './Update'
import { setSocket, onMessageReceived, emitEvent } from './socket';

export default function BasicExample() {
  return (
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
  );
}