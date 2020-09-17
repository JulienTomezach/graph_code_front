
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
import Login from './Login'

let App = () => {

  return  (<Router>
    <ErrorUI></ErrorUI>
   <Switch>
          <Route path="/login" children={<Login/>} />
  </Switch>
   </Router>
   );
}
          //<Route path="/" children={<File/>} />
          // <Route path="/:filename" children={<File/>} />

export default App;

// rel="noopener noreferrer"

