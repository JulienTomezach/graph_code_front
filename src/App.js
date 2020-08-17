import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {graph_to_text, htmlToTextCode} from './utilities/graph_to_text'
const axios_base = require('axios').default;

// .selectionStart

function App() {
    let editing = false
    const initialText = "The code is <br/> <span class='Function'>loading</span>...";
    const axios = axios_base.create({
                          baseURL: 'http://localhost:3000/',
                        });

  let setCode = (text) =>{
    const el = document.getElementById("code_box");
    el.innerHTML = text
  }

  let getTextCode = () =>{
    const codeBox = document.getElementById("code_box");
    // return htmlToTextCode(codeBox.innerHTML)
    let span = document.createElement('span');
    span.innerHTML = htmlToTextCode(codeBox.innerHTML);
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
    let response = await axios.post('/code', {code: getTextCode()});
    // thats inneficient, better to get graph from post response
    if(response.status === 200){
      await fetcData()
      editing = false
      console.log('set editing at false')
    }
  }

  let setFocusEventsHandler= () =>{
    const codeBox = document.getElementById("code_box");
    codeBox.addEventListener('input', (event) => {
      if(!editing){
        console.log('set editing at true')
            let codeBox = document.getElementById("code_box");
            console.log('caret pos', window.getSelection())
            // remove all html except the <br>. the alternative is to go full text with the css option and turn the <br> in \n
            // that way we would be sure to not have (badly managed) html anymore
            // codeBox.innerHTML = htmlToTextCode(codeBox.innerHTML, {keepReturn: true});
            // editing = true
        }
    });

    // codeBox.addEventListener('blur', (event) => {
    //   saveCode()
    // });
}

let setKeyEventsHandler = () => {
  const codeBox = document.getElementById("code_box");
  codeBox.addEventListener("keydown", event => {
    if(event.key === 'Enter' && (event.metaKey || event.ctrlKey)){
      saveCode()
    }
  });
}

   useEffect(() => {
    setKeyEventsHandler()
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
          <div className="SaveButton">
          Save
          </div>
          </div>

      </div>

    </div>
  );
}

export default App;

// rel="noopener noreferrer"

