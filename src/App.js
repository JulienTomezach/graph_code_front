import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {graph_to_text, htmlToTextNodes, htmlToTextFor} from './utilities/graph_to_text'
const axios_base = require('axios').default;

// Should I not try to use react with contentEditable ?

function App() {
    let editing = false
    const initialText = "The code is <br/> <span class='Function'>loading</span>...";
    const axios = axios_base.create({
                          baseURL: 'http://localhost:3000/',
                        });
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


   const fetchData = async () => {
    try {
      const response = await axios.get('/code');
      setCode(graph_to_text(response.data))
    } catch (error) {
      console.error(error);
    }
  }

  const fetchExample = async () => {
    try {
      const response = await axios.get('/example');
      console.log('example result',response.data.result)
      let data_context_box = document.getElementById('data_context_box')
      data_context_box.innerHTML = response.data.data_context

      let script_box = document.getElementById('script_box')
      script_box.innerHTML = response.data.script

      setExecResult(response.data.result)

    } catch (error) {
      console.error(error);
    }
  }

  const saveCode = async () => {
    let response = await axios.post('/code', {code: getTextCode()});
    // thats inneficient, better to get graph from post response
    if(response.status === 200){
      await fetchAllData()
      editing = false
      console.log('set editing at false')
    }
  }

  const saveExample = async () => {
    const dataContextBox = document.getElementById("data_context_box").innerText;
    const scriptBox = document.getElementById("script_box").innerText;
    let response = await axios.post('/example', {script: scriptBox, data_context: dataContextBox});
    if(response.status === 200){
      await fetchAllData()
    }
  }

  let toEditingMode = () => {
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
  }

  let setFocusEventsHandler= () => {
    const codeBox = document.getElementById("code_box");
    codeBox.addEventListener('input', (event) => {
      toEditingMode()
    });

  }

let fetchAllData = () => {
  fetchData();
  fetchExample();
}

let setKeyEventsHandler = () => {
  const codeBox = document.getElementById("code_box");
  codeBox.addEventListener("keydown", event => {
    if(event.key === 's' && (event.metaKey || event.ctrlKey)){
      saveCode()
      event.preventDefault()
    }else if(event.key === "Tab"){
      insertNodeAtCursor(document.createTextNode("\t"));
      toEditingMode()
      event.preventDefault()
    }
  });

  const exampleBox = document.getElementById("example_box");
  exampleBox.addEventListener("keydown", event => {
    if(event.key === 's' && (event.metaKey || event.ctrlKey)){
      saveExample()
      event.preventDefault()
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
     fetchAllData();
  }, []);

// approach:
// all the element but some are displayed. only when other are click_ed on.
// by default, none is enabled
// first just display those element, then add the turn on/off
let resultToComponent = (result) => {
  if(result === null) return
  console.log('result',result)
  let mainKey = Object.keys(result)[0]
  let hash = result[mainKey]
  if(hash.details){
    console.log('result[mainKey].value', result[mainKey].value)
    let start = <span className='Index'>  {result[mainKey].value}  </span>

    let next = resultToComponentAux(result[mainKey].details)
    return (<span>
            {start} = {next}
         </span>)
  }else{
    console.log('resultToComponent: recursion: not impplemented, probably on demand too')
    // return result[mainKey].map(elem => resultToComponent(elem))
  }
}
 // "amount_for":{"details":{"sum_on":{"details":[{"sum_on":{"details":[{"line_for":{"details":{},"value":21,"inputs":["lot1","fund_call1","sub1"]}},{"line_for":{"details":{},"value":0,"inputs":["lot1","fund_call1","sub2"]}}],"value":21}},{"sum_on":{"details":[{"line_for":{"details":{},"value":0,"inputs":["lot2","fund_call1","sub1"]}},{"line_for":{"details":{},"value":600,"inputs":["lot2","fund_call1","sub2"]}}],"value":600}}],"value":621}},"value":621,"inputs":["owner1","fund_call1","budget_version1"]}}

let resultToComponentAux = (elem) => {
  let mainKey = Object.keys(elem)[0]
  let mainElement = elem[mainKey]
  if(mainKey === 'sum_on'){
    console.log("details", mainElement.details)
    let sub_elements = mainElement.details.map(elem => resultToComponentAux(elem))
    const reducer = (accumulator, currentValue) => {
      return accumulator.concat([currentValue, <span> + </span>])
    }
    sub_elements = sub_elements.reduce(reducer, [])
    return <span> ( {sub_elements.slice(0, sub_elements.length - 1)} ) </span>
  }
  {/*return <span> {mainElement.value} <span className="InfoResult"> {mainKey}( {mainElement.inputs.join(' , ')} ) </span> </span>*/}
  return <span className="Result" title={mainKey + '(' + mainElement.inputs.join(' , ') + ')'}> {mainElement.value}</span>
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

      {/*<div className="RightScreen">*/}

          {/*<div className="Header">

          </div>*/}


          <div className="Content">
          <div id="code_box" spellCheck={false} contentEditable  className="CodeBox">

          </div>
          <div id='example_box' className="Examples">
            <h3>Examples:</h3>
            <h4>Data context:</h4>
            <div spellCheck={false} id='data_context_box' contentEditable ></div>
            <h4>Script:</h4>
            <div  spellCheck={false} id='script_box' contentEditable></div>
            <h4>Result:</h4>
            <div >{resultToComponent(execResult)}</div>
          </div>
          </div>

      {/*</div>*/}

    </div>
  );
}

export default App;

// rel="noopener noreferrer"

