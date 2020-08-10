import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
const axios_base = require('axios').default;

function App() {

   const [textCode, setTextCode] = useState("The code is \nloading...");
   const axios = axios_base.create({
                          baseURL: 'http://localhost:3000/',
                        });

   useEffect(() => {
    let fetch = async () => {
    try {
      const response = await axios.get('/code');
      setTextCode(response.data)
    } catch (error) {
      console.error(error);
    }
  }
      fetch();
  });

  return (


    <div className="App">
      <div className="Sidebar">
      <div className="SidebarContent">
        <h5 className="UserName"><span className="material-icons">person</span><span className="ItemText">Julien</span></h5>
        <div href="#" className="SelectedItem"><span className="material-icons">text_snippet</span><span className="ItemText">amount_for</span></div>
      </div>
      </div>

      <div className="RightScreen">

          {/*<div className="Header">

          </div>*/}


          <div className="Content">
          <div className="CodeBoxParent">
          <div className="CodeBox">
          {textCode}
          </div>
          </div>
          </div>

      </div>

    </div>
  );
}

export default App;

// rel="noopener noreferrer"

