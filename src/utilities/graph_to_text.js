const _ = require('lodash')

const PARAM = 'Parameter'
const FUNCTION = 'Function'
const FUNCTION_CALL = 'FunctionCall'
const COMMENT = 'Comment'
const OPERATION = 'Operation'
const INDEX = 'Index'


let get_tabs = (n) => {
    return _.sumBy(Array(n), o => "\t") || ""
}
// special case of the root elements
let graph_to_text = (graph_input) => {

  let textCode=""
  graph_input.forEach(element => {

    let keys = Object.keys(element)
    if(keys.length >1) throw Error(`graph_to_text: several keys for an element of the graph ${keys.join('')}`)
    let main_key = keys[0]

    let value = element[main_key]
    // set the offset
    let offset =  get_tabs(value.level)
    // let offset =  get_tabs(0)
    let line_break = '</br>' + offset
    // then add the comments
    if('comments' in value){
      element[main_key].comments.map(comment => {
          textCode += offset + SPAN("# "+comment, COMMENT) + '<br/>'
      })
    }

    if(!('formulas' in value)) throw Error('graph_to_text: "formulas" not in element')
    let formula = value.formulas
    // do something with the name of formula, the parameters
    let parameters = () => value.parameters.map(param =>  graph_to_text_aux(param, line_break, PARAM)).join(", ")
    let params_repr = value.parameters ? "("+ parameters()+ ")" : ""
    let line_break_or_not = (formula.definitions ? line_break + '    ' : "")
    textCode += offset + SPAN(element.function.name, FUNCTION) + params_repr + " = " + line_break_or_not + graph_to_text_aux(formula, line_break) + '<br/>' + '<br/>'


  })
  return textCode
}


// {"sum_on":[{".":[{"name":"owner"},{"name":"lots"}]},{"sum_on":[{".":[{"name":"budget_version"},{"name":"subbudgets"}]},{"name":"line_for","parameters":[{"name":"lot_i"},{"name":"fund_call"},{"name":"subbudget_i"}]}]}

const SPAN = (content, className) => {
 let first = className ? `<span class="${className}">` : "<span>"
 let last = "</span>"
 return first + content + last
}

// why add line break everywhere ???
let graph_to_text_aux = (graph_input, line_break, type=null) => {
  if('definitions' in graph_input){
    let definitions = graph_input.definitions
    return definitions.map(([condition, formula]) => graph_to_text_aux(condition, line_break)+" | "+graph_to_text_aux(formula, line_break)).join(line_break)
  }else {
    if('sum_on' in graph_input){
      let [iteree, formula] = graph_input.sum_on
      // sum_on(owner.lots) {
      return SPAN("sum_on",FUNCTION_CALL)+"("+ graph_to_text_aux(iteree, line_break)+")"+" { "+ graph_to_text_aux(formula, line_break) + " }"
    }else if('.' in graph_input){
        return graph_input['.'].map(sub_element => graph_to_text_aux(sub_element, line_break)).join(SPAN('.', OPERATION))
    }else if('*' in graph_input){
        return graph_input['*'].map(sub_element => graph_to_text_aux(sub_element, line_break)).join(SPAN(' * ', OPERATION))
    }else if('/' in graph_input){
        return graph_input['/'].map(sub_element => graph_to_text_aux(sub_element, line_break)).join(SPAN(' / ', OPERATION))
    }else if('-' in graph_input){
        return graph_input['-'].map(sub_element => graph_to_text_aux(sub_element, line_break)).join(SPAN(' - ', OPERATION))
    }else if('+' in graph_input){
        return graph_input['+'].map(sub_element => graph_to_text_aux(sub_element, line_break)).join(SPAN(' + ', OPERATION))
    }else if('??' in graph_input){
        return graph_input['??'].map(sub_element => graph_to_text_aux(sub_element, line_break)).join(SPAN(' ?? ', OPERATION))
    }else if('[]' in graph_input){
        return graph_to_text_aux(graph_input['[]'][0], line_break)+"["+SPAN(graph_input['[]'][1].name, INDEX)+"]"
    }else if('==' in graph_input){
        return graph_input['=='].map(sub_element => graph_to_text_aux(sub_element, line_break)).join(SPAN(' == ', OPERATION))
    }else if('!=' in graph_input){
        return graph_input['!='].map(sub_element => graph_to_text_aux(sub_element, line_break)).join(SPAN(' != ', OPERATION))
    }else if('>' in graph_input){
        return graph_input['>'].map(sub_element => graph_to_text_aux(sub_element, line_break)).join(SPAN(' > ', OPERATION))
    }else if('()' in graph_input){
        return SPAN(' ( ', OPERATION) + graph_to_text_aux(graph_input['()'], line_break) + SPAN(' ) ', OPERATION)
    }else if('||' in graph_input){
        return graph_input['||'].map(sub_element => graph_to_text_aux(sub_element, line_break)).join(SPAN(' || ', OPERATION))
    }else if('where' in graph_input){
      // it is binary operator too like +, - ...
        let element = graph_input['where']
        return "(" + graph_to_text_aux(element[0], line_break)+" where "+ graph_to_text_aux(element[1], line_break) + ")"
    }else if('name' in graph_input && !('parameters' in graph_input)) {

      let is_number = !isNaN(graph_input.name)
      let new_type = is_number ? INDEX: type
      return SPAN(graph_input.name, new_type)
    }else if('name' in graph_input && 'parameters' in graph_input) {
      let parameters = graph_input.parameters.map(param =>  graph_to_text_aux(param, line_break)).join(", ")
      return SPAN(graph_input.name, FUNCTION_CALL)+"("+parameters+")"
    }
    throw Error(`graph_to_text: we dont knwo that key word in formula: ${Object.keys(graph_input)}`)
  }
}

let htmlToTextNodes = (htmlRoot, opts={}) => {
  let copy = document.createElement('div')
  copy.innerHTML = htmlRoot
  return _.flattenDeep(htmlToTextNodesAux(copy, opts))
}

// options: keepBRTag with br->\n;
let htmlToTextNodesAux = (node, opts={}) => {
      const childNodes = Array.from(node.childNodes)
      if(childNodes.length > 1){
        return childNodes.map( node => htmlToTextNodesAux(node, opts))
      }
      if(node.tagName === "SPAN"){
        return node.id === "cursor" ? node : document.createTextNode(node.innerText)
      }else if(node.tagName === "BR"){
        return opts.keepBRTag ? node :  document.createTextNode('\n')
      }else if(!node.tagName){
        return node
      }else{
        console.log("what is this node ?", node)
        return [node]
      }
}

let htmlToTextFor = (htmlRoot, newNodes) => {
    htmlRoot.innerHTML = ""
    newNodes.forEach(node => {
      htmlRoot.appendChild(node)
    })
}

let isSimpleHash = (hash) => {
  // no more keys than 2.
  let firstCond = Object.keys(hash).length < 3
  // no vlaue that is an hash.
  let sndCond = Object.values(hash).filter(value => (typeof value === 'object') && !_.isNil(value) && Object.keys(value).length > 0 ).length === 0
  return firstCond && sndCond
}
let dataToText = (hash, offset='') => {
    if((typeof hash === 'string') ){
      return '"' + hash + '"'
    }else if(Number.isInteger(hash) || (typeof hash === "boolean")){
      return hash
    }
    let text = ''
    let isSimpleHashRes = isSimpleHash(hash)
    let jointure = isSimpleHashRes ? ', ' : ',\n'
    let content = Object.entries(hash).map(([key, value]) => {
      let key_value_text = ''
      let actualOffset = isSimpleHashRes ? '' : offset
      key_value_text = actualOffset + `${key} : `
      actualOffset = isSimpleHashRes ? '' : offset+'\t'
      key_value_text += dataToText(value, actualOffset)
      return key_value_text
    }).join(jointure)
    let carriageReturnEnd =  content.length > 0 && !isSimpleHashRes ? ('\n' + offset) : ''
    let carriageReturnStart = content.length > 0 &&  !isSimpleHashRes  ? ('\n') : ''
    text = '{' + carriageReturnStart + content + carriageReturnEnd  + '}'
    return text
  }



module.exports = {graph_to_text, dataToText, htmlToTextNodes, htmlToTextFor};
