import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {graph_to_text, htmlToTextNodes, htmlToTextFor} from './utilities/graph_to_text'
const axios_base = require('axios').default;

//
// problem of "connection refused" must come from contentEditable and react driven

function App() {
    let editing = false
    const initialText = "The code is <br/> <span class='Function'>loading</span>...";
    const axios = axios_base.create({
                          baseURL: 'http://localhost:3000/',
                        });
   const [script, setScript] = useState('')
   const [dataContext, setDataContext] = useState('')
   const [execResult, setExecResult] = useState(null)

   let insertNodeAtCursor = (node) => {
      let sel = window.getSelection();
      let range = sel.getRangeAt(0);
      range.insertNode(node);

      range.setStart(node, node.textContent.length)
      range.collapse(true)

      sel.removeAllRanges()
      sel.addRange(range)
   }
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

  const fetcExample = async () => {
    try {
      const response = await axios.get('/example');
      console.log('example result',response.data.result)
      setScript(response.data.script)
      setDataContext(response.data.data_context)
      setExecResult(response.data.result)
      // amount_for: {details: , value:}
      // what do we do with result ?

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

  const saveExample = async () => {
    const dataContextBox = document.getElementById("data_context_box").innerText;
    const scriptBox = document.getElementById("script_box").innerText;
    let response = await axios.post('/example', {script: scriptBox, data_context: dataContextBox});
    if(response.status === 200){
      await fetcExample()
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

// how do we display results ?
// we have it structured
// so we can display it with html, at least with <br<, then with link etc..

let setKeyEventsHandler = () => {
  const codeBox = document.getElementById("code_box");
  codeBox.addEventListener("keydown", event => {
    if(event.key === 'Enter' && (event.metaKey || event.ctrlKey)){
      saveCode()
    }
  });

  const exampleBox = document.getElementById("example_box");
  exampleBox.addEventListener("keydown", event => {
    if(event.key === 'Enter' && (event.metaKey || event.ctrlKey)){
      saveExample()
    }else if(event.key === "Tab"){
      event.preventDefault()
      insertNodeAtCursor(document.createTextNode("\t"));
    }
  });
}

   useEffect( () => {
    setKeyEventsHandler()
    setFocusEventsHandler()
    setCode(initialText)
     fetcData();
     fetcExample();
  }, []);

// take the result in, send back an html component
// {details:, value:}
let resultToComponent = (result) => {
  if(result === null) return
  console.log('result',result)
  let mainKey = Object.keys(result)[0]
  let hash = result[mainKey]
  if(hash.details){
    console.log('result[mainKey].value', result[mainKey].value)
    let start = <span className='Index'>  {result[mainKey].value}  </span>
    let end = ""
    end = Object.keys(result[mainKey].details)[0]
    return (<span>
            {start}
         </span>)
  }else{
    console.log('resultToComponent: recursion: not impplemented, probably on demand too')
    // return result[mainKey].map(elem => resultToComponent(elem))
  }
}


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
          <div id="code_box" spellCheck={false} contentEditable  className="CodeBox">

          </div>
          <div id='example_box' className="Examples">
            <h3>Examples:</h3>
            <h4>Data context:</h4>
            <div spellCheck={false} id='data_context_box' contentEditable >{dataContext}</div>
            <h4>Script:</h4>
            {<div  spellCheck={false} id='script_box' contentEditable>{script}</div>}
            <h4>Result:</h4>
            <div >{resultToComponent(execResult)}</div>
          </div>
          </div>

      </div>

    </div>
  );
}

export default App;

// rel="noopener noreferrer"

