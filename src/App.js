
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
import ErrorUI from './ErrorUI'

import { addTodo } from './redux/actions'

// called every time the store state changes
const mapStateToProps = (state /*, ownProps*/) => {
  return {
    // counter: state.counter
  }
}

const mapDispatchToProps = {
  // action creators.
  //each action creator will be turned into a prop function
  // this function "dispatches" its action when called. Basically it does its worjk as expected
  // this.props.addTodo('bidule')
 addTodo
}


let App = () => {

  return  (<Router>
    <ErrorUI></ErrorUI>
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

