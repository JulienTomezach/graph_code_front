
import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";


import File from './File'

function App() {

  return  (<Router>

   <Switch>
          {/*<Route path="/" children={<File/>} />*/}
          <Route path="/:filename" children={<File/>} />
  </Switch>
   </Router>
   );
}

export default App;

// rel="noopener noreferrer"

