
import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

import { connect } from 'react-redux'

import File from './File'

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    // counter: state.counter
  }
}

const mapDispatchToProps = {
 // increment, decrement, reset
}


let App = () => {

  return  (<Router>

   <Switch>
          {/*<Route path="/" children={<File/>} />*/}
          <Route path="/:filename" children={<File/>} />
  </Switch>
   </Router>
   );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

// rel="noopener noreferrer"

