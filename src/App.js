import _ from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import {dataToText, graph_to_text, htmlToTextNodes, htmlToTextFor} from './utilities/graph_to_text'
import { v4 as uuidv4 } from 'uuid';
const axios_base = require('axios').default;

// Should I not try to use react with contentEditable ?

function App() {
    let editing = false
    const initialText = "The code is <br/> <span class='Function'>loading</span>...";
    const axios = axios_base.create({
                          baseURL: 'http://localhost:3000/',
                        });
    const [execResult, setExecResult] = useState(null)
    const [resultDisplay, setResultDisplay] = useState({})

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
    // console.log('DEBUG')
    // console.log(codeBox)
    // console.log(htmlToTextNodes(codeBox))
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

// "amount_for":{"details":{"sum_on":{"details":[{"sum_on":{"details":[{"line_for":{"details":{},"value":21,"inputs":["lot1","fund_call1","sub1"]}},{"line_for":{"details":{},"value":0,"inputs":["lot1","fund_call1","sub2"]}}],"value":21}},{"sum_on":{"details":[{"line_for":{"details":{},"value":0,"inputs":["lot2","fund_call1","sub1"]}},{"line_for":{"details":{},"value":600,"inputs":["lot2","fund_call1","sub2"]}}],"value":600}}],"value":621}},"value":621,"inputs":["owner1","fund_call1","budget_version1"]}}
// details : {}
// or details: []
  let attachUUID = (hash) => {
    if('details' in hash){
      // certainly bad, thats a layer for nothing acutally.
      hash = hash.details
    }
    if(Object.keys(hash).length === 0) return
    let mainKey = Object.keys(hash)[0]
    let mainElement = hash[mainKey]
    mainElement.uuid = uuidv4();
    if(Array.isArray(mainElement.details)){
      mainElement.details.map(subHash => attachUUID(subHash))
    }else{
        attachUUID(mainElement.details)
      }
  }


  const fetchExample = async () => {
    try {
      const response = await axios.get('/example');
      let data_context_box = document.getElementById('data_context_box')
      data_context_box.innerHTML = dataToText(response.data.data_context)

      let script_box = document.getElementById('script_box')
      script_box.innerHTML = response.data.script

      let resultDetails = response.data.result
      attachUUID(resultDetails)
      setExecResult(resultDetails)
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
    }else if(event.key === "Enter"){
      toEditingMode()
      insertNodeAtCursor(document.createTextNode("\n"));
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
  let mainKey = Object.keys(result)[0]
  let hash = result[mainKey]
  if(hash.details){
    let start = <span className='Index'>  {result[mainKey].value}  </span>

    let next_content = []
    resultToComponentAux(result[mainKey].details, next_content)
    let next = <div>{next_content}</div>
    return (<span>
            {next}
         </span>)
  }else{
    console.log('resultToComponent: recursion: not impplemented, probably on demand too')
    // return result[mainKey].map(elem => resultToComponent(elem))
  }
}
 // "amount_for":{"details":{"sum_on":{"details":[{"sum_on":{"details":[{"line_for":{"details":{},"value":21,"inputs":["lot1","fund_call1","sub1"]}},{"line_for":{"details":{},"value":0,"inputs":["lot1","fund_call1","sub2"]}}],"value":21}},{"sum_on":{"details":[{"line_for":{"details":{},"value":0,"inputs":["lot2","fund_call1","sub1"]}},{"line_for":{"details":{},"value":600,"inputs":["lot2","fund_call1","sub2"]}}],"value":600}}],"value":621}},"value":621,"inputs":["owner1","fund_call1","budget_version1"]}}

let showDetail = (id_elem) => {
  setResultDisplay(state => ({...state, [id_elem]: !state[id_elem]}) )
}

let details = (displayTriggered, mainKey, mainElement) => {
  if (mainElement.inputs){
    let inputs = <span> ( {mainElement.inputs.join(' , ')} )</span>
    let retour = ( displayTriggered ? <span className="InfoResult"> {mainKey} {inputs} </span> : null )
    return retour
  }
  return null
}

let addLine = (mainElement, mainKey, sub_elements, lines) => {
  let condition = lines.length === 0 ? true : resultDisplay[mainElement.uuid]
  let subElementsDiv =  sub_elements.length > 0 ? <span> = {sub_elements.slice(0, sub_elements.length - 1)} </span> : null
  let newLine= () => {
    return condition ? (<div> {details(true, mainKey, mainElement)} {mainElement.value} {subElementsDiv} </div>) : null
  }
  lines.push(newLine())
}

let processElement = (elements, mainKey, operation, lines, mainElementArg = null) => {
  if( _.isNil(elements.details) || elements.details.filter(detail => Object.keys(detail).length === 0).length > 0){
    return addLine(mainElementArg, mainKey, [], lines)
  }
  let sub_elements = elements.details.map(elem => {
    let value = null
    let uuid = null
    if(elem.details){
        let maybe_elem = Object.values(elem.details)[0]
        if(!_.isNil(maybe_elem)){
          value =  maybe_elem.value ? maybe_elem.value : elem.value
          uuid = maybe_elem.uuid
        }else{
          value = elem.value
          uuid = elem.uuid
        }
    }else{
      elem =  Object.values(elem)[0]
      value =  elem.value
      uuid = elem.uuid
    }

    return (<span className="Result" onClick={() => showDetail(uuid)}> {value} </span>)
  })
  const reducer = (accumulator, currentValue) => {
    return accumulator.concat([currentValue, <span> {operation} </span>])
  }
  sub_elements = sub_elements.reduce(reducer, [])

  let mainElement = mainElementArg || elements
  addLine(mainElement, mainKey, sub_elements, lines)
  elements.details.forEach(detail => resultToComponentAux(detail, lines))
}
// 1 = rien
let resultToComponentAux = (elem, lines) => {
  // console.log('current elem', elem)
  let elemContent = elem
  if('details' in elem) {
    elemContent = elemContent.details
  }

  // the 1 is called_on_platform, that have details: {sum_on: {details:}}
  if(Object.keys(elemContent).length === 0) return


  let mainKey = Object.keys(elemContent)[0]
  let mainElement = elemContent[mainKey]

  if(!resultDisplay[mainElement.uuid] && lines.length > 0){
    return
  }

  if(mainKey === 'sum_on'){
    // TODO: add an on click on the value
    processElement(mainElement, mainKey, '+', lines)
  }else if(Array.isArray(mainElement.details)) {
    processElement(mainElement, mainKey, mainKey, lines)
  }else{
    // main_key is probably a function call.
    // So we dont see it, we just need to get one level below.

    // TODO: problem is here
      let operation = Object.keys(mainElement.details)[0]
      let elements = Object.values(mainElement.details)[0]
      if(elements){
          processElement(elements, mainKey, operation, lines, mainElement)
      }else{
        processElement({}, mainKey, "", lines, {...mainElement, value: elem.value})
      }
    }
  return

  // leaf
  // const id_elem = mainElement.uuid;

  // let details = () => ( resultDisplay[id_elem] ? <span className="InfoResult"> {mainKey}( {mainElement.inputs.join(' , ')} )</span> : null )
  // return <span onClick={() => showDetail(id_elem)} className="Result"> {mainElement.value}  {details()} </span>
  /*return <span className="Result" title={mainKey + '(' + mainElement.inputs.join(' , ') + ')'}> {mainElement.value}</span>*/
}

  let resultComponent = () =>  resultToComponent(execResult)

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
            <div >{resultComponent()}</div>
          </div>
          </div>

      {/*</div>*/}

    </div>
  );
}

export default App;

// rel="noopener noreferrer"

