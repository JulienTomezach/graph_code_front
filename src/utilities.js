// [a, b, c] -> {a:,b:,c:}
let set_to_h = (arr, default_value={}) => {
  const reducer = (accumulator, currentValue) => {
    accumulator[currentValue] = default_value
    return accumulator
  }
  return arr.reduce(reducer, {})
}
// [{a: 1}, {b: 1}] -> {a: 1, b:1 }
let dict_array_to_h = (arr) => {
const reducer = (accumulator, currentValue) => {
    accumulator = {...accumulator, ...currentValue}
    return accumulator
  }
 return arr.reduce(reducer, {})
}

// same as above actually, factorise it
// [[1, 'a'], [2, 'b'] ] -> {1: 'a', 2: 'b'}
let array_to_h = (arr) => {
  const reducer = (accumulator, currentValue) => {
    let hash = {}
    hash[currentValue[0]] = currentValue[1]
    accumulator = {...accumulator, ...hash}
    return accumulator
  }
  return arr.reduce(reducer, {})
}

let get_first_key = (hash) => {
  let keys = Object.keys(hash)
  return keys[0]
}

let is_json_string = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

module.exports = {set_to_h, dict_array_to_h, get_first_key, array_to_h, is_json_string};
