
import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";


import File from './File'
import ErrorUI from './ErrorUI'
import Landing from './Landing'
import Login from './Login'
import SignIn from './SignIn'
import ProfilePage from './components/ProfilePage'

let App = () => {

  return  (<Router>
    <ErrorUI></ErrorUI>
   <Switch>
    <Route path="/sign_in" children={<SignIn/>} />
    <Route path="/log_in" children={<Login/>} />
    <Route path="/landing" children={<Landing/>} />
    <Route path="/profile" children={<ProfilePage/>} />
    <Route path="/:filename" children={<File/>} />
    <Route path="/" children={<File/>} />
  </Switch>
   </Router>
   );
}

export default App;

// rel="noopener noreferrer"

