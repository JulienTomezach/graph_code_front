import _ from 'lodash';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import logo from './logo.svg';
import './File.css';
import './App.css';
import {dataToText, graph_to_text, htmlToTextNodes, htmlToTextFor} from './utilities/graph_to_text'
import { v4 as uuidv4 } from 'uuid';
import ContentEditable from './WrappedContentEditable'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory
} from "react-router-dom";

import { withRouter } from "react-router";

import axios from './axios_utils'

import {is_json_string} from './utilities'

function File(props) {
    const initialHtml = "The code is <br/> <span class='Function'>loading</span>...";

    // arbitraty choice, we use two tables for the details of the result
    // and if we have clicked for more detail or not.
    // joint key is uuid
    const [execResult, setExecResult] = useState(null)
    const [resultDisplay, setResultDisplay] = useState({})
    const [files, setFiles] = useState([])
    // file whose code is displayed
    const [currentFile, setCurrentFile] = useState(null)
    // file whose we want to change metaData
    const [selectedFile, setSelectedFile] = useState(null)

    const [addingFile, setAddingFile] = useState(false)
    const [updatingFile, setUpdatingFile] = useState(false)

    const {history} = props;
    const filename = _.last(history.location.pathname.split('/'))

    // for component editable
    const fileRef = React.createRef();

    // state of cases component
    const [casesHtml, setCasesHtml] = useState('');
    const [cases, setCases] = useState(null)

    // state of data_example component
    const [dataExampleHtml, setDataExampleHtml] = useState('');
    const [dataExample, setDataExample] = useState(null);
    const [dataUnsaved, setDataUnsaved] = useState(false)

    // state of script_example component
    const [scriptHtml, setScriptHtml] = useState(initialHtml);
    const [script, setScript] = useState(null);
    const [scriptUnsaved, setScriptUnsaved] = useState(false)

    const [codeHtml, setCodeHtml] = useState('');
    // const [code, setCode] = useState(null);
    const [codeEditing, setCodeEditing] = useState(false)


    // 
    const [username, setUsername] = useState('...')

   let insertNodeAtCursor = (node) => {
      let sel = window.getSelection();
      let range = sel.getRangeAt(0);
      range.insertNode(node);

      range.setStart(node, node.textContent.length)
      range.collapse(true)

      sel.removeAllRanges()
      sel.addRange(range)
   }

  let getTextCases = () => {
    if(!is_json_string(cases)){
      axios.dispatch_error({type: 'update_cases', message: 'The cases must be in format JSON'})
      return null
    }
    return cases;
  }

  let htmlToText = (html) => {
    let span = document.createElement('span');
    htmlToTextFor(span, htmlToTextNodes(html));
    return span.textContent || span.innerText;
  }

  let getTextCode = () => {
    return htmlToText(codeHtml)
  }

  let codeHandleChange = (evt) => {
    let newHtml = toEditingMode(evt.target.value)
    if(newHtml)
      setCodeHtml(newHtml)
    else
      setCodeHtml(evt.target.value)
  }

  // scriptHandleChange
  let scriptHandleChange = (evt) => {
    let span = document.createElement('span');
    span.innerHTML = evt.target.value
    setScriptHtml(span.innerHTML)
    setScript(span.innerText)
    setScriptUnsaved(true)
  }

  // to factorise with below
  let dataExampleHandleChange = (evt) => {
    let span = document.createElement('span');
    span.innerHTML = evt.target.value
    setDataExampleHtml(span.innerHTML)
    setDataExample(span.innerText)
    setDataUnsaved(true)
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
    const response = await axios.get(`files/${filename}/code`);
    if(response.data.error){
      setCodeHtml(response.data.code)
      axios.dispatch_error(response.data.error)
    }else{
        setCodeHtml(graph_to_text(response.data.length > 0 ? response.data : defaultCode()))
    }
    setCodeEditing(false)
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

  const setDataExampleComplete = (value, opts = {}) => {
    setDataExample(value)
    if(_.isNil(value)){
      setDataExampleHtml('')
      return
    }
    if(Object.keys(value).length === 0)
      setDataExampleHtml('{}')
    else {
      let new_value = !opts.noPostProcess ? dataToText(value) : value
      setDataExampleHtml(new_value)
    }
    setDataUnsaved(false)
  }

  const setScriptComplete = (value) => {
    setScript(value)
    if(_.isNil(value)){
      setScriptHtml('')
      return
    }
    if(value.length === 0)
      setScriptHtml('')
    else setScriptHtml(value)
    setScriptUnsaved(false)
  }


  // opts: noData, noScript, noResult
  const fetchExample = async (filename, opts = {}) => {
    try {
      const response = await axios.get(`files/${filename}/example`, {params: opts});

      // no example for this filter
      if(Object.keys(response.data).length === 1 && response.data.filter){
        if(!opts.noData) setDataExampleComplete(null);
        if(!opts.noScript) setScriptComplete(null)
        if(!opts.noResult) setExecResult(null)
        return
      }

      if(!opts.noData){
        if(_.isNil(response.data.data_context)){
          setDataExampleComplete({})
        }else{
          if(response.data.data_context.error){
            setDataExampleComplete(response.data.data_context.body, {noPostProcess: true})
            axios.dispatch_error(response.data.data_context.error)
          }else{
            setDataExampleComplete(response.data.data_context)
          }
        }
      }

      if(!opts.noScript) {

        if(_.isNil(response.data.script)){
          setScriptComplete('execute: 1+1')
        }else{
          setScriptComplete(response.data.script)
        }
      }

      if(!opts.noResult){

        if(Object.keys(response.data).length === 0){
          setExecResult(null)
          return
        }

        if(_.isNil(response.data.result)){
          setExecResult(null)
        }else{
          if(response.data.result.error){
            axios.dispatch_error(response.data.result.error)
          }else {
            attachUUID(response.data.result)
            setExecResult(response.data.result)
          }
        }
      }

    } catch (error) {
      console.error(error);
    }
  }

  const saveDataAndCode = async () => {
    // save what is unsaved
    let dataSaved = {}

    if(codeEditing){
     dataSaved.code = await  saveCode()
    }

    if(dataUnsaved){
      dataSaved.data = await saveDataExample()
    }

    if(scriptUnsaved){
     dataSaved.script = await saveScript()
    }

    // fetch what have changed
    let actions = {
      data: () => fetchExample(currentFile, {noScript: true, noResult: true}),
      script: () => fetchExample(currentFile, {noData: true, noResult: true}),
      code: () => fetchCode(currentFile),
    }

    // dont need to wait execution
    Object.entries(actions).forEach(([index, action]) => {
      dataSaved[index] && action()
    })

    // always fetch result details bc it necessarilly changed
    if(_.some(Object.values(dataSaved))){
      fetchExample(currentFile, {noData: true, noScript: true})
    }

  }

  const saveErrorHandler = (response, what) => {
    if(response.status !== 200){
      axios.dispatch_error({error: `Failed to save the ${what}`, type: 'save'})
      return false
    }
    return true
  }

  const saveCases = async () => {
    let casesText = getTextCases()
    if(casesText === null) return
    let response = await axios.put(`files/${currentFile}/cases`, {cases: casesText});
    if(response.status === 200){
      setDataUnsaved(false)
      // so we reload the filtered code and the filtered example
      await fetchAllData(currentFile)
    }
  }

  const saveCode = async () => {
    let response = await axios.put(`files/${currentFile}/code`, {code: getTextCode()});
    return saveErrorHandler(response, 'code')
  }

  const saveDataExample = async () => {
    let response = await axios.put(`files/${currentFile}/example`, {data_context: dataExample});
    return saveErrorHandler(response, 'data_context')
  }

  const saveScript = async () => {
  let response = await axios.put(`files/${currentFile}/example`, {script: script});
   return saveErrorHandler(response, 'script')
  }

  const createFile =  async (filename) => {
    if(filename.length === 0 ) return
    let response = await axios.post(`files`, {name: filename});
    if(response.status === 200){
      await fetchFiles()
      setAddingFile(v => !v)
    }
  }
  let removeSelectedFile = async () => {
    if(!selectedFile) return
    let response = await axios.delete(`files/${selectedFile}`);
    if(response.status === 200){
      if(selectedFile === currentFile){
        let newCurrentFile = files.filter(v => v !== selectedFile)[0]
        if(newCurrentFile) setCurrentFile(newCurrentFile)
        else{
          setCurrentFile(null)
          history.push('/')
        }
      }

      setFiles(files => {
             return files.filter((item) => item !== selectedFile );
          })
      setSelectedFile(null)
      setUpdatingFile(false)
    }
  }
  let updateFile = async (filename) => {
    if(filename.length === 0 ) return
    let response = await axios.put(`files/${selectedFile}`, {name: filename});
    if(response.status === 200){
      if(selectedFile === currentFile){
          setCurrentFile(filename)
      }
      let index = files.indexOf(selectedFile);
      if (index >= 0) {
          setFiles(files => {
             return files.map((item) => (item === selectedFile ? filename : item) );
          })
      }
      setSelectedFile(null)
      setUpdatingFile(false)
    }
  }

  let itReallyChanges = (actualCodeHtml) => {
    const textActualCodeHtml =  htmlToText(actualCodeHtml) 
    const textCodeBoxNow = htmlToText(codeHtml)
    return !(textCodeBoxNow.length === textActualCodeHtml.length && textCodeBoxNow === textActualCodeHtml); 
  }

  let toEditingMode = (actualCodeHtml) => {
    // we use the sub-func bc there is a strange change at start <br/> -> <br>, space -> &nbsp;
    if(!codeEditing && itReallyChanges(actualCodeHtml)){
            setCodeEditing(true)
            let cursor = document.createElement("span");
            cursor.id = "cursor"
            // cursor.setAttribute("tabindex", 0);
            // cursor.setAttribute("contentEditable", true);

            // set cursor at position
            let sel = window.getSelection();
            let range = sel.getRangeAt(0);
            range.insertNode(cursor);

            let span = document.createElement('span');

            //code_box
            let codeHtmlWithCursor = document.getElementById("code_box").innerHTML
            htmlToTextFor(span, htmlToTextNodes(codeHtmlWithCursor, {keepBRTag: true}));


            return span.innerHTML

            // the component editable will focus on the cursor after updating ;)

        }
  }

let fetchFiles = async () => {
  let response = await axios.get('files', {});
  let files = response.data.files
  setFiles(files)
};

let fetchAllData = (file) => {
  fetchCases(file);
  fetchCode(file);
  fetchExample(file);
}


let saveHandler = (event) => {
  if(event.key === 's' && (event.metaKey || event.ctrlKey)){
    saveDataAndCode()
    event.preventDefault()
  }
}

let keyCodeHandler = (event) => {
    saveHandler(event)
    if(event.key === "Tab"){
      insertNodeAtCursor(document.createTextNode("\t"));
      event.preventDefault()
    }else if(event.key === "Enter"){
      insertNodeAtCursor(document.createTextNode("\n"));
      event.preventDefault()
    }
}


let setKeyEventsHandler = () => {
  // useless here
  const exampleBox = document.getElementById("example_box");
  exampleBox.addEventListener("keydown", event => {
    if(event.key === "Tab"){
      event.preventDefault()
      insertNodeAtCursor(document.createTextNode("\t"));
    }
  });
}

let fetchProfile = async () => {
  let response = await axios.get('user')
  if(response.status === 200)
    setUsername(response.data.name)
}
// all the useEffects

  useEffect( ()=> {
    fetchProfile()
  }, []);

  useEffect( () => {
    fetchFiles();
  }, []);

  useEffect( () => {
    if(filename.length === 0 && _.isNil(currentFile) && files.length > 0){
      setCurrentFile(files[0])
    }
  }, [files]);

const filenameToApply= () => (filename.length > 0 && filename !== currentFile)

// keep synchornisation between, a bit odd should be able to remove currentFile
  useEffect( () => {
    if(filenameToApply() && files.includes(filename)){
          setCurrentFile(filename)
    }else if(filenameToApply() && !files.includes(filename) && files.length> 0){
          setCurrentFile(files[0])
    }
  }, [filename, files]);


useEffect( () => {
  if(!_.isNil(currentFile) && filename !== currentFile)
    history.push(`/${currentFile}`);
}, [currentFile]);

  useEffect( () => {
    if(!_.isNil(currentFile))
      fetchAllData(currentFile);
  }, [currentFile]);

//


// approach:
// all the element but some are displayed. only when other are click_ed on.
// by default, none is enabled
// first just display those element, then add the turn on/off
let resultToComponent = (result) => {
  if(result === null){
   return (<span></span>)
 }

  // if(result.details){
    let next_content = []
    resultToComponentAux(result, next_content)
    let next = <div>{next_content}</div>
    return (<span>
            {next}
         </span>)
}

let showDetail = (id_elem) => {
  setResultDisplay(state => ({...state, [id_elem]: !state[id_elem]}) )
}

let details = (displayTriggered, mainKey, mainElement) => {
  if(mainKey === 'sum_on'){
    mainElement = {...mainElement, inputs: []}
  }
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

let processElement = (elements, mainKey, operation_arg, lines, mainElementArg = null) => {
  let operation = (operation_arg=== 'sum_on') ? '+': operation_arg

  if( _.isNil(elements.details) || elements.details.filter(detail => Object.keys(detail).length === 0).length > 0){
    let keyDisplayed = (operation_arg=== 'sum_on') ? operation_arg : mainKey
    return addLine(mainElementArg, keyDisplayed, [], lines)
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
let resultToComponentAux = (elem, lines) => {
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
  // that one is not used anymore :/ apparently we go into processElement right away
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

  let modalGeneric = (triggered, content, turnOff) =>  {
  return triggered ? (
    <div onClick = {() => turnOff(false)} className="Modal">
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

  let updateFileContent = () => {
    return (<div onClick = {(e) => {e.stopPropagation(); e.preventDefault();}} className="FormModal">
      <span className="Row">
        <input className="Input" defaultValue={selectedFile} id="filename_input2" type="text"  />
        <span className="Button" onClick={() => {updateFile(document.getElementById("filename_input2").value)}} > Update </span>
      </span>
      <span className="Button Red" onClick={removeSelectedFile} > Remove </span>
    </div>)
  }

  let modalAddFile = React.useMemo(() => modalGeneric(addingFile, addFileContent(), setAddingFile), [addingFile])

  let modalUpdateFile = React.useMemo(() => modalGeneric(updatingFile, updateFileContent(), setUpdatingFile), [updatingFile])

  let resultComponent = () =>   {
    let details =  resultToComponent(execResult)
    return details
  }

  let oneExample = () => {
    // we would have liked to not display it ... but
    return (<span>
            { (_.isNil(dataExample)) ? (<span> No examples for this context, remove all filters to get all examples available. </span>) :  null}
            <span id="example_box">
              <h4 >Data context :</h4>
              <ContentEditable
              onChange={dataExampleHandleChange}
              onKeyDown={keyCodeHandler}
              html={dataExampleHtml}
              disabled={_.isNil(dataExample)}
              />
              {/*<div spellCheck={false} id='data_context_box' contentEditable={!_.isNil(execResult)} ></div>*/}
              <h4>Script :</h4>
              <ContentEditable
              onChange={scriptHandleChange}
              onKeyDown={keyCodeHandler}
              html={scriptHtml}
              disabled={_.isNil(script)}
              />
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

  let switchCurrentFileName = (filename) => {
    if(currentFile !== filename){
      setExecResult(null)
      setDataExampleHtml('')
      setScriptHtml('')
      setCodeHtml(initialHtml)
      setCurrentFile(filename)
    }
  }

  let clickUpdateFile= (filename) => {
    setSelectedFile(filename)
    setUpdatingFile(true)
  }

  let fileNames = (files) => {

    return files.map((filename) => {
      let className = (filename === currentFile) ? "SelectedItem" : ""
      className += " Item"
      return (<div className="ItemLine" href="#">
              <span className={className} onClick={() => switchCurrentFileName(filename)} >
                <span className="material-icons">text_snippet</span>
                <span className="ItemText">{filename}</span>
              </span>
              <span className="More" onClick= {()=> clickUpdateFile(filename)}>
                <span className="material-icons">more_vert</span>
              </span>
            </div>)
    })
  }

  let shortCutSave = () => {
     return navigator.platform === 'MacIntel' ? "⌘ + s": "Ctrl + s"
  }

  let saveButton = () => {
  return (dataUnsaved || scriptUnsaved || codeEditing) ? (<div onClick={saveDataAndCode} title={shortCutSave()} className="Button SaveButton">Save</div>) : null
}

  let contentPart = () => {
    return !_.isNil(currentFile) ? (
      <span>
        <div  className="CasesBoxParent">
                {saveButton()}
                <div>
                <h5>Filter Business Cases (JSON) : </h5>
                {/*<span>Beta Feature: see doc</span>*/}
                </div>
              <div  className="CasesBox">

               <ContentEditable
               className="Json"
               onChange={casesHandleChange}
               spellCheck={false}
                html={casesHtml} />
                <div onClick={saveCases} className="Button"> Filter </div>
              </div>
              </div>
              <hr className="Line"></hr>
              <ContentEditable
                id="code_box"
                className="CodeBox"
                spellCheck={false}
                onChange={codeHandleChange}
                onKeyDown={keyCodeHandler}
                html={codeHtml}
                disabled={!casesEmpty()}/>
              <div className="Examples">
                <h3>Examples:</h3>
                {oneExample()}
          </div>
        </span>
      ) : null;
  }

  let mainComponent = () => {
      return  (

      <div ref={fileRef} className="App">
      {modalAddFile}
      {modalUpdateFile}
      {console.log('rendu')}
        <div className="Sidebar">
          <div className="SidebarContent">
            <Link to="/profile" className="Link" ><h5 className="UserName">
              <span className="material-icons">person</span><span className="ItemText">{username}</span></h5>
            </Link>
            {fileNames(files)}
          <div onClick={() => setAddingFile(v => !v)} className="Button Item"> Add a File </div>
        </div>
        </div>

        {/*<div className="RightScreen">*/}

            {/*<div className="Header">

            </div>*/}


            <div className="Content">
              {contentPart()}
            </div>

        {/*</div>*/}

      </div>
    );
  }
  return mainComponent()
}

// might be better to just send history as props
export default withRouter(File);

// rel="noopener noreferrer"

