
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
// special case of the root elements
let graph_to_text = (graph_input) => {

  let textCode=""
  graph_input.forEach(element => {
    if('comment' in element){
        textCode +=  SPAN("# "+element.comment, COMMENT) + '<br/>'
    }else{
      let keys = Object.keys(element)
      if(keys.length >1) throw Error('graph_to_text: several keys for an element of the graph')
      let key = keys[0]
      let value = Object.values(element)[0]
      if(!('formulas' in value)) throw Error('graph_to_text: formulas not in element')
      let formula = value.formulas
    // do something with the name of formula, the parameters
    let parameters = value.parameters.map(param =>  graph_to_text_aux(param, PARAM)).join(", ")
    let line_break = formula.definitions ? "\n" : ""
    textCode += SPAN(key, FUNCTION) + "("+ parameters+ ")"+ " = " + line_break + graph_to_text_aux(formula) + '<br/>' + '<br/>'
    }
  })
  return textCode
}


// {"sum_on":[{".":[{"name":"owner"},{"name":"lots"}]},{"sum_on":[{".":[{"name":"budget_version"},{"name":"subbudgets"}]},{"name":"line_for","parameters":[{"name":"lot_i"},{"name":"fund_call"},{"name":"subbudget_i"}]}]}

const SPAN = (content, className) => {
 let first = className ? `<span class="${className}">` : "<span>"
 let last = "</span>"
 return first + content + last
}

let graph_to_text_aux = (graph_input, type=null) => {
  console.log(graph_input)
  if('definitions' in graph_input){
    let definitions = graph_input.definitions
    return definitions.map(([condition, formula]) => graph_to_text_aux(condition)+" | "+graph_to_text_aux(formula)).join('\n')
  }else {
    if('sum_on' in graph_input){
      let [iteree, formula] = graph_input.sum_on
      // sum_on(owner.lots) {
      return SPAN("sum_on",FUNCTION_CALL)+"("+ graph_to_text_aux(iteree)+")"+" { "+ graph_to_text_aux(formula) + " }"
    }else if('.' in graph_input){
        return graph_input['.'].map(sub_element => graph_to_text_aux(sub_element)).join(SPAN('.', OPERATION))
    }else if('*' in graph_input){
        return graph_input['*'].map(sub_element => graph_to_text_aux(sub_element)).join(SPAN(' * ', OPERATION))
    }else if('/' in graph_input){
        return graph_input['/'].map(sub_element => graph_to_text_aux(sub_element)).join(SPAN(' / ', OPERATION))
    }else if('-' in graph_input){
        return graph_input['-'].map(sub_element => graph_to_text_aux(sub_element)).join(SPAN(' - ', OPERATION))
    }else if('+' in graph_input){
        return graph_input['+'].map(sub_element => graph_to_text_aux(sub_element)).join(SPAN(' + ', OPERATION))
    }else if('??' in graph_input){
        return graph_input['??'].map(sub_element => graph_to_text_aux(sub_element)).join(SPAN(' ?? ', OPERATION))
    }else if('[]' in graph_input){
        return graph_to_text_aux(graph_input['[]'][0])+"["+SPAN(graph_input['[]'][1], INDEX)+"]"
    }else if('==' in graph_input){
        return graph_input['=='].map(sub_element => graph_to_text_aux(sub_element)).join(SPAN(' == ', OPERATION))
    }else if('!=' in graph_input){
        return graph_input['!='].map(sub_element => graph_to_text_aux(sub_element)).join(SPAN(' != ', OPERATION))
    }else if('where' in graph_input){
      // it is binary operator too like +, - ...
        let element = graph_input['where']
        return graph_to_text_aux(element[0])+" where "+ graph_to_text_aux(element[1])
    }else if('name' in graph_input && !('parameters' in graph_input)) {

      let is_number = !isNaN(graph_input.name)
      let new_type = is_number ? INDEX: type
      return SPAN(graph_input.name, new_type)
    }else if('name' in graph_input && 'parameters' in graph_input) {
      let parameters = graph_input.parameters.map(param =>  graph_to_text_aux(param)).join(", ")
      return SPAN(graph_input.name, FUNCTION_CALL)+"("+parameters+")"
    }
    throw Error(`graph_to_text: we dont knwo that key word in formula: ${Object.keys(graph_input)}`)
  }
}


let htmlToTextCode = (html) => {
  let regex = /<br>/g;

  let text = html.replace(regex, '\n')

  regex = /<span class="\w*">/g
  text = text.replace(regex, '')

  regex = /<span>/g
  text = text.replace(regex, '')

  regex = /<\/span>/g
  text = text.replace(regex, '')
  return
}



module.exports = {graph_to_text, htmlToTextCode};
