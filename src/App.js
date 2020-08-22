import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {graph_to_text, htmlToTextNodes, htmlToTextFor} from './utilities/graph_to_text'
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
    let span = document.createElement('span');
    htmlToTextFor(span, htmlToTextNodes(codeBox));
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
            editing = true
            console.log('set editing at true')
            let cursor = document.createElement("span");
            cursor.id = "cursor"
            // cursor.setAttribute("tabindex", 0);
            // cursor.setAttribute("contentEditable", true);

            // set cursor at position
            let sel = window.getSelection();
            let range = sel.getRangeAt(0);
            range.insertNode(cursor);

            const codeBox = document.getElementById("code_box");
            htmlToTextFor(codeBox, htmlToTextNodes(codeBox, {keepBRTag: true}));

            cursor = document.getElementById("cursor");
            range = document.createRange()
            sel = window.getSelection()

            range.setStart(cursor, 0)
            range.collapse(true)

            sel.removeAllRanges()
            sel.addRange(range)
            // cursor.focus()
        }
    });

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
          <div className="ExamplesParent">
          <div className="Examples">
            <h3>Examples:</h3>
            <h4>Data context:</h4>
            <h4>Execution:</h4>
          </div>
          </div>
          </div>

      </div>

    </div>
  );
}

export default App;

// rel="noopener noreferrer"

