
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

let App = () => {

  return  (<Router>
    <ErrorUI></ErrorUI>
   <Switch>
          <Route path="/" children={<File/>} />
          <Route path="/:filename" children={<File/>} />
  </Switch>
   </Router>
   );
}

export default App;

// rel="noopener noreferrer"

