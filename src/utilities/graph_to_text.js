const _ = require('lodash')
// graph_input [{"amount_for":{"formulas":{"sum_on":[{".":[{"name":"owner"},{"name":"lots"}]},{"sum_on":[{".":[{"name":"budget_version"},{"name":"subbudgets"}]},{"name":"line_for","parameters":[{"name":"lot_i"},{"name":"fund_call"},{"name":"subbudget_i"}]}]}]},"parameters":[{"name":"owner"},{"name":"fund_call"},{"name":"budget_version"}]}},{"line_for":{"formulas":{"*":[{"name":"ratio","parameters":[{"name":"fund_call"},{".":[{"name":"subbudget"},{"name":"budget_version"}]}]},{"*":[{"name":"left_to_call","parameters":[{"name":"subbudget"}]},{"name":"weight","parameters":[{"name":"lot"},{".":[{"name":"subbudget"},{"name":"account"}]}]}]}]},"parameters":[{"name":"lot"},{"name":"fund_call"},{"name":"subbudget"}]}},{"ratio":{"formulas":{"/":[{".":[{"name":"fund_call"},{"name":"value"}]},{"-":[{"name":"total_amount","parameters":[{"name":"budget_version"}]},{"name":"already_called","parameters":[{".":[{"name":"budget_version"},{"name":"budget"}]}]}]}]},"parameters":[{"name":"fund_call"},{"name":"budget_version"}]}},{"already_called":{"formulas":{"definitions":[[{"name":"has_called_before"},{"+":[{"name":"called_on_platform","parameters":[{"name":"budget"}]},{"name":"called_before_platform","parameters":[{"name":"budget"}]}]}]]},"parameters":[{"name":"budget"}]}},{"called_on_platform":{"formulas":{"definitions":[[{"name":"has_several_version"},{"sum_on":[{"name":"previous_versions","parameters":[{"name":"budget"}]},{"name":"called","parameters":[{"name":"budget_version_i"}]}]}]]},"parameters":[{"name":"budget"}]}},{"called_before_platform":{"formulas":{"definitions":[[{"name":"has_called_before_platform"},{"-":[{"name":"total_amount","parameters":[{"name":"first_version","parameters":[{"name":"budget"}]}]},{"sum_on":[{".":[{"name":"first_version","parameters":[{"name":"budget"}]},{"name":"fund_calls"}]},{".":[{"name":"fund_call_i"},{"name":"value"}]}]}]}]]},"parameters":[{"name":"budget"}]}},{"left_to_call":{"formulas":{".":[{"name":"subbudget"},{"name":"value"}]},"parameters":[{"name":"subbudget"}]}},{"weight":{"formulas":{"??":[{"[]":[{"where":[{".":[{"name":"lot"},{"name":"weights"}]},{"==":[{"name":"key"},{"name":"account"}]}]},"0"]},{"name":"0"}]},"parameters":[{"name":"lot"},{"name":"account"}]}},{"previous_versions":{"formulas":{"where":[{".":[{"name":"budget"},{"name":"budget_versions"}]},{"!=":[{".":[{"name":"budget_version_i"},{"name":"expire_at"}]},{"name":"null"}]}]},"parameters":[{"name":"budget"}]}},{"comment":" meta: rely on the order that we did not defined ..."},{"first_version":{"formulas":{".":[{"name":"budget"},{"[]":[{"name":"budget_versions"},"0"]}]},"parameters":[{"name":"budget"}]}},{"comment":" meta: this field does not exist normally in db"},{"total_amount":{"formulas":{".":[{"name":"a"},{"name":"total"}]},"parameters":[{"name":"a"}]}},{"called":{"formulas":{"name":"1"},"parameters":[{"name":"budget_version"}]}}]

// amount_for(owner, fund_call, budget_version) = sum_on(owner.lots) { sum_on(budget_version.subbudgets) { line_for(lot_i, fund_call, subbudget_i) } }


// html
// <div>
// <span className="Function"> amount_for </span>(<span className="Parameter">toto</span>,<span className="Parameter">titi</span>)
// = <span className="Function">sum_on</span>(owner.lots)<span className="Bracket">[</span>
// </div>

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
    let parameters = value.parameters.map(param =>  graph_to_text_aux(param, line_break, PARAM)).join(", ")
    let line_break_or_not = (formula.definitions ? line_break + '\t' : "")
    textCode += offset + SPAN(element.function.name, FUNCTION) + "("+ parameters+ ")"+ " = " + line_break_or_not + graph_to_text_aux(formula, line_break) + '<br/>' + '<br/>'


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
        return graph_to_text_aux(graph_input['[]'][0], line_break)+"["+SPAN(graph_input['[]'][1], INDEX)+"]"
    }else if('==' in graph_input){
        return graph_input['=='].map(sub_element => graph_to_text_aux(sub_element, line_break)).join(SPAN(' == ', OPERATION))
    }else if('!=' in graph_input){
        return graph_input['!='].map(sub_element => graph_to_text_aux(sub_element, line_break)).join(SPAN(' != ', OPERATION))
    }else if('()' in graph_input){
        return SPAN(' ( ', OPERATION) + graph_to_text_aux(graph_input['()'], line_break) + SPAN(' ) ', OPERATION)
    }else if('where' in graph_input){
      // it is binary operator too like +, - ...
        let element = graph_input['where']
        return graph_to_text_aux(element[0], line_break)+" where "+ graph_to_text_aux(element[1], line_break)
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
  copy.innerHTML = htmlRoot.innerHTML
  return _.flattenDeep(htmlToTextNodesAux(copy, opts))
}

// options: keepBRTag with br->\n;
let htmlToTextNodesAux = (node, opts={}) => {
      const childNodes = Array.from(node.childNodes)
      if(childNodes.length > 1){
        console.log('childNodes', childNodes)
        return childNodes.map( node => htmlToTextNodesAux(node, opts))
      }
      if(node.tagName === "SPAN"){
        return node.id === "cursor" ? node : document.createTextNode(node.innerHTML)
      }else if(node.tagName === "BR"){
        return opts.keepBRTag ? node :  document.createTextNode('\n')
      }else if(!node.tagName){
        return node
      }else{
        console.log("what is this node ?", node)
      }
}

let htmlToTextFor = (htmlRoot, newNodes) => {
    htmlRoot.innerHTML = ""
    console.log('nodes', newNodes)
    newNodes.forEach(node => {
      console.log('node', node)
      htmlRoot.appendChild(node)
    })
}




module.exports = {graph_to_text, htmlToTextNodes, htmlToTextFor};
