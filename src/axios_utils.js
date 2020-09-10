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
 let response = await axios.put(url, body);
 if(response.status === 200) return response;
 // store.dispatch(addError(response.data.error))
}

const post = async (url, body) => {
 let response = await axios.post(url, body);
 if(response.status === 200) return response;
 // store.dispatch(addError(response.data.error))
}



export default {get, put, post, dispatch_error};
