import { addError } from "./redux/actions";
import store from './redux/store'

const axios_base = require('axios').default;

const axios = axios_base.create({
                          baseURL: 'http://localhost:3000/',
                        });


let dispatch_error = (error) => {
    store.dispatch(addError(`${error.type}: ${error.message}`))
}
const get = async (url, config) => {
  try{
  let response = await axios.get(url, config);
  return response
  }catch (error){
    dispatch_error(error.response.data.error)
    return error.response
  }
}

const put = async (url, body) => {
  try{
   let response = await axios.put(url, body);
   return response
  }catch (error){
    dispatch_error(error.response.data.error)
    return error.response
  }
}

const post = async (url, body) => {
  try{
     let response = await axios.post(url, body);
     return response
 }catch (error){
    dispatch_error(error.response.data.error)
    return error.response
  }
}

const del = async (url) => {
try{
   let response = await axios.delete(url);
   return response
 }catch (error){
    dispatch_error(error.response.data.error)
    return error.response
  }
}

export default {get, put, post, dispatch_error, delete: del};
