import _ from 'lodash';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import logo from './logo.svg';
import './File.css';
import {dataToText, graph_to_text, htmlToTextNodes, htmlToTextFor} from './utilities/graph_to_text'
import { v4 as uuidv4 } from 'uuid';
import ContentEditable from 'react-contenteditable'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory
} from "react-router-dom";

import { withRouter } from "react-router";

const axios_base = require('axios').default;

// How manage state between rendering is really bad.
// basically, the html dom is my state : beeerk

function File(props) {
    let editing = false
    const initialText = "The code is <br/> <span class='Function'>loading</span>...";
    const axios = axios_base.create({
                          baseURL: 'http://localhost:3000/',
                        });
    // arbitraty choice, we use two tables for the details of the result
    // and if we have clicked for more detail or not.
    // joint key is uuid
    const [execResult, setExecResult] = useState(null)
    const [resultDisplay, setResultDisplay] = useState({})
    const [files, setFiles] = useState([])
    const [currentFile, setCurrentFile] = useState(null)

    const [addingFile, setAddingFile] = useState(false)

    const { filename } = useParams();
    const {history} = props;

    // state of cases component
    const [casesHtml, setCasesHtml] = useState('');
    const [cases, setCases] = useState(null)

    // state of data_example component
    const [dataExampleHtml, setDataExampleHtml] = useState('');
    const [dataExample, setDataExample] = useState(null);

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

  let getTextCases = () => {
    return cases;
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

  let onKeyDown= (evt) => {

  }
  // to factorise with below
  let dataExampleHandleChange = (evt) => {
    saveHandler(evt, saveDataExample)
    let span = document.createElement('span');
    span.innerHTML = evt.target.value
    console.log('dataExampleHandleChange', span.innerText, dataExample, cases)
    setDataExampleHtml(span.innerHTML)
    setDataExample(span.innerText)
  }

  let casesHandleChange = (evt) => {
    let span = document.createElement('span');
    span.innerHTML = evt.target.value
    setCasesHtml(span.innerHTML)
    setCases(span.innerText)
  }

  let setCasesComplete = (text) => {
    // const el = document.getElementById("cases_box");
    // el.innerHTML = text
    // in that case, html == data
    setCases(text)
    setCasesHtml(text)
  }

  let fetchCases = async (filename) => {
     try {
      const response = await axios.get(`files/${filename}/cases`);
      setCasesComplete(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  const defaultCode = () => {
    return [{function: {name: "foo", formulas: {'+': [{name: '1'}, {name: '1'}]}, level: 0, parameters: [],
    comments:["put your code here"]}}]
  }

   const fetchCode = async (filename) => {
    try {
      const response = await axios.get(`files/${filename}/code`);
      setCode(graph_to_text(response.data.length > 0 ? response.data : defaultCode()))
    } catch (error) {
      console.error(error);
    }
  }

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

  const setDataExampleComplete = (value) => {
    setDataExample(value)
    if(Object.keys(value).length === 0)
      setDataExampleHtml('{}')
    else setDataExampleHtml(dataToText(value))
  }


  const fetchExample = async (filename) => {
    try {
      const response = await axios.get(`files/${filename}/example`);
      // let data_context_box = document.getElementById('data_context_box')
      let script_box = document.getElementById('script_box')

      console.log("DEBUG fetchExample", response.data)
      if(Object.keys(response.data).length === 0){
        setExecResult(null)
        // data_context_box.innerHTML = ''
        setDataExampleComplete({})
        script_box.innerHTML = ''
        return
      }

      // if(Object.keys(response.data).length === 0){
      // // setExecResult(null)
      //   data_context_box.innerHTML = ''
      //   script_box.innerHTML = ''
      //   return
      // }


      // data_context_box.innerHTML = dataToText(response.data.data_context)
      setDataExampleComplete(response.data.data_context)
      script_box.innerHTML = response.data.script

      let resultDetails = response.data.result
      if(_.isNil(resultDetails)) {
        setExecResult(null)
        return
      };

      attachUUID(resultDetails)
      setExecResult(resultDetails)
    } catch (error) {
      console.error(error);
    }
  }

  const saveCases = async () => {
    let response = await axios.put(`files/${currentFile}/cases`, {cases: getTextCases()});
    if(response.status === 200){
      // so we reload the filtered code and the filtered example
      await fetchAllData(currentFile)
      editing = false
    }
  }

  const saveCode = async () => {
    let response = await axios.put(`files/${currentFile}/code`, {code: getTextCode()});
    // thats inneficient, better to get graph from post response
    if(response.status === 200){
      await fetchAllData(currentFile)
      editing = false
    }
  }
  const saveDataExample = async () => {
    console.log('saveDataExample', dataExample, dataExampleHtml)
    let response = await axios.put(`files/${currentFile}/example`, {data_context: dataExample});
    if(response.status === 200){
      await fetchAllData(currentFile)
      editing = false
    }
  }
  const saveScriptExample = async () => {
    const scriptBox = document.getElementById("script_box").innerText;
    let response = await axios.put(`files/${currentFile}/example`, {script: scriptBox});
    if(response.status === 200){
      await fetchAllData(currentFile)
      editing = false
    }
  }

  const createFile =  async (filename) => {
    if(filename.length === 0 ) return
    let response = await axios.post(`files`, {name: filename});
    if(response.status === 200){
      await fetchFiles()
      triggerAddFileModal()
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

let fetchFiles = async (filename) => {
  let response = await axios.get('files', {});
  let files = response.data.files
  setFiles(files)
  if(files.includes(filename))
    setCurrentFile(filename);
};

let fetchAllData = (file) => {
  fetchCases(file);
  fetchCode(file);
  fetchExample(file);
}

let saveHandler = (event, save) => {
  console.log("saveHandler", dataExample, dataExampleHtml, casesHtml, cases, currentFile)
  if(event.key === 's' && (event.metaKey || event.ctrlKey)){
    save()
    // must be because we dont give the functions, only the fields
    // event.preventDefault()
  }
}

let setKeyEventsHandler = () => {
  const codeBox = document.getElementById("code_box");
  // codeBox.removeEventListener("keydown")
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
      // saveScriptExample()
      event.preventDefault()
    }else if(event.key === "Tab"){
      event.preventDefault()
      insertNodeAtCursor(document.createTextNode("\t"));
    }
  });
}

   useEffect( () => {
    fetchFiles(filename);
  }, [filename]);

   useEffect( () => {
    console.log("add key events", currentFile)
    if(currentFile !== null){
          setCode(initialText)
          fetchAllData(currentFile);
          setKeyEventsHandler()
          setFocusEventsHandler()
        }
  }, [currentFile]);

// approach:
// all the element but some are displayed. only when other are click_ed on.
// by default, none is enabled
// first just display those element, then add the turn on/off
let resultToComponent = (result) => {
  if(result === null){
   return (<span></span>)
 }
  let mainKey = Object.keys(result)[0]
  let hash = result[mainKey]
  if(hash.details){
    let start = <span className='Index'>  {result[mainKey].value}  </span>

    let next_content = []
    resultToComponentAux(result[mainKey].details, next_content)
    console.log('next_content', next_content)
    let next = <div>{next_content}</div>
    return (<span>
            {next}
         </span>)
  }else{
    console.log('resultToComponent: recursion: not impplemented, probably on demand too')
    // return result[mainKey].map(elem => resultToComponent(elem))
  }
}

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
}

  let triggerAddFileModal = () => {
    setAddingFile(value => !value)
  }

  let modalGeneric = (triggered, content, trigger) =>  {
  return triggered ? (
    <div onClick = {() => trigger()} class="Modal">
      {content}
    </div>
    ) : null;
  }

  let addFileContent = () => {
    return (<div onClick = {(e) => {e.stopPropagation(); e.preventDefault();}}  className="AddFile">
      <input id="filename_input" type="text" className="Input" />
      <div className="Button" onClick={() => {createFile(document.getElementById("filename_input").value)}} > Save </div>
    </div>)
  }

  let modalAddFile = React.useMemo(() => modalGeneric(addingFile, addFileContent(), triggerAddFileModal), [addingFile])

  let resultComponent = () =>   {
    console.log("resultComponent execResult",execResult)
    return resultToComponent(execResult)
  }


  let oneExample = () => {
    // we would have liked to not display it ... but
    return (<span>
            { (_.isNil(execResult) && Object.keys(JSON.parse(cases || '{}')).length > 0 ) ? (<span> No examples for this context, remove all filters to get all examples available. </span>) :  null}
            <span id="example_box">
              <h4>Data context:</h4>
              <ContentEditable
              onChange={dataExampleHandleChange}
              html={dataExampleHtml} />
              {/*<div spellCheck={false} id='data_context_box' contentEditable={!_.isNil(execResult)} ></div>*/}
              <h4>Script:</h4>
              <div  spellCheck={false} id='script_box' contentEditable={!_.isNil(execResult)}></div>
            </span>
            <h4>Result:</h4>
            <div >{resultComponent()}</div>
        </span>)
  }

  let casesEmpty = () => {
    const el = document.getElementById("cases_box");
    // bug; the elememnt is not in the dom yet. looks related to our hybrid management
    // of state
    if(!el) return true

    return Object.keys(JSON.parse(el.innerText)).length === 0
  }

  let changeFileName = (filename) => {
    var element = document.getElementById("code_box");
    element.outerHTML = element.outerHTML;

    // element = document.getElementById("example_box");
    // element.outerHTML = element.outerHTML;

    history.push(`/${filename}`);
    // history.push(`/`);
  }

  let fileNames = (files) => {

    return files.map((filename) => {
      let className = (filename === currentFile) ? "SelectedItem" : ""
      className += " Item"
      return (<div href="#" onClick={() => changeFileName(filename)} className={className}><span className="material-icons">text_snippet</span>
              <span className="ItemText">{filename}</span>
            </div>)
    })
  }

  let mainComponent = () => {
      return currentFile !== null ? (

      <div className="App">
      {modalAddFile}
      {console.log('rendu', dataExample)}
        <div className="Sidebar">
          <div className="SidebarContent">
            <h5 className="UserName"><span className="material-icons">person</span><span className="ItemText">Julien</span></h5>
            {fileNames(files)}
          <div onClick={triggerAddFileModal} className="Button Item"> Add a File </div>
        </div>
        </div>

        {/*<div className="RightScreen">*/}

            {/*<div className="Header">

            </div>*/}


            <div className="Content">
            <div  className="CasesBoxParent">
              <div>
              <h5>Business Cases (wip, see doc) : </h5>
              {/*<span>Beta Feature: see doc</span>*/}
              </div>
            <div  className="CasesBox">

             <ContentEditable
             className="Json"
             onChange={casesHandleChange}
              html={casesHtml} />
              {/*<div id="cases_box" spellCheck={false} contentEditable className="Json"></div>*/}
              <div onClick={saveCases} className="Button"> Filter </div>
            </div>
            </div>
            <hr className="Line"></hr>
            <div id="code_box" spellCheck={false} contentEditable={casesEmpty()}  className="CodeBox">
            </div>
            <div className="Examples">
              <h3>Examples:</h3>
              {oneExample()}
            </div>
            </div>

        {/*</div>*/}

      </div>
    ): null;
  }
  return mainComponent()
}

// might be better to just send history as props
export default withRouter(File);

// rel="noopener noreferrer"

