
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

let App = () => {

  return  (<Router>
    <ErrorUI></ErrorUI>
   <Switch>
    <Route path="/sign_in" children={<SignIn/>} />
    <Route path="/login" children={<Login/>} />
    <Route path="/landing" children={<Landing/>} />
  </Switch>
   </Router>
   );
}
          //<Route path="/" children={<File/>} />
          // <Route path="/:filename" children={<File/>} />

export default App;

// rel="noopener noreferrer"

