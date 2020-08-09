import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (


    <div className="App">
      <div className="Sidebar">
      <div className="SidebarContent">
        <h5 className="UserName"><span class="material-icons">person</span><span className="ItemText">Julien</span></h5>
        <div href="#" className="SelectedItem"><span class="material-icons">text_snippet</span><span className="ItemText">amount_for</span></div>
      </div>
      </div>

      <div className="RightScreen">

          <div className="Header">
           <div >amount_for </div>
          </div>


          <div className="Content">
          <div className="CodeBoxParent">
          <div className="CodeBox">
          <h2>Sidebar Navigation Example</h2>
          <p>The sidebar with is set with "style="width:25%".</p>
          <p>The left margin of the page content is set to the same value.</p>
          </div>
          </div>
          </div>

      </div>

    </div>
  );
}

export default App;

// rel="noopener noreferrer"

