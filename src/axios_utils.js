import { addError } from "./redux/actions";
import store from './redux/store'

const axios_base = require('axios').default;

const axios = axios_base.create({
                          baseURL: 'http://localhost:3000/',
                        });


let dispatch_error = (error) => {
    store.dispatch(addError(`${error.type}: ${error.message}`))
}

let redirection_auth = (response) => {
  console.log('response.status',response.status)
  // add a condition on path later
  if(response.status === 401){
    window.location.href = '/landing'
  } 

}

const get = async (url, config) => {
  try{
  let response = await axios.get(url, {...config,  withCredentials: true });
  return response
  }catch (error){
    redirection_auth(error.response)
    dispatch_error(error.response.data.error)
    return error.response
  }
}

const put = async (url, body) => {
  try{
   let response = await axios.put(url, body, { withCredentials: true });
   return response
  }catch (error){
    if(!error.response) return console.log('request error',error)
    dispatch_error(error.response.data.error)
    return error.response
  }
}

const post = async (url, body) => {
  try{
     let response = await axios.post(url, body, { withCredentials: true });
     return response
 }catch (error){
    dispatch_error(error.response.data.error)
    return error.response
  }
}

const del = async (url) => {
try{
   let response = await axios.delete(url, { withCredentials: true });
   return response
 }catch (error){
    dispatch_error(error.response.data.error)
    return error.response
  }
}

export default {get, put, post, dispatch_error, delete: del};
