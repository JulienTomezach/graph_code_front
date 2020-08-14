import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {graph_to_text} from './utilities/graph_to_text'
const axios_base = require('axios').default;

function App() {
    const initialText = "The code is <br/> <span class='Function'>loading</span>...";
   const axios = axios_base.create({
                          baseURL: 'http://localhost:3000/',
                        });

  let setTextCode = (text) =>{
    const el = document.getElementById("code_box");
    el.innerHTML = text
  }

  let getTextCode = () =>{
    const el = document.getElementById("code_box");
    return el.innerHTML
  }

   const fetcData = async () => {
    try {
      const response = await axios.get('/code');
      setTextCode(graph_to_text(response.data))
    } catch (error) {
      console.error(error);
    }
  }

  const saveCode = async () => {
    await axios.post('/code', {code: getTextCode()});
  }


   useEffect(() => {
    setTextCode(initialText)
    fetcData();
  });


  return (

    <div className="App">
    {console.log('rendu')}
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
          <div id="code_box" contentEditable  className="CodeBox">

          </div>
          </div>
          <div onClick={saveCode} className="SaveButton">
          Save
          </div>
          </div>

      </div>

    </div>
  );
}

export default App;

// rel="noopener noreferrer"

