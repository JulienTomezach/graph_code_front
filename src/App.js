import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {graph_to_text, htmlToTextCode} from './utilities/graph_to_text'
const axios_base = require('axios').default;

function App() {
    const initialText = "The code is <br/> <span class='Function'>loading</span>...";
   const axios = axios_base.create({
                          baseURL: 'http://localhost:3000/',
                        });

  let setCode = (text) =>{
    const el = document.getElementById("code_box");
    el.innerHTML = text
  }

  let getTextCode = () =>{
    const el = document.getElementById("code_box");
    // return htmlToTextCode(el.innerHTML)
    let span = document.createElement('span');
    span.innerHTML = htmlToTextCode(el.innerHTML);
    return span.textContent || span.innerText;
  }

   const fetcData = async () => {
    try {
      const response = await axios.get('/code');
      setCode(graph_to_text(response.data))
    } catch (error) {
      console.error(error);
    }
  }

  const saveCode = async () => {
    await axios.post('/code', {code: getTextCode()});
  }

  let setFocusEventsHandler= () =>{
    const codeBox = document.getElementById("code_box");
    codeBox.addEventListener('focus', (event) => {
      // replace html by text in the element
    });

    codeBox.addEventListener('blur', (event) => {
      // send save request and so
    });
}
   useEffect(() => {
    setFocusEventsHandler()
    setCode(initialText)
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

