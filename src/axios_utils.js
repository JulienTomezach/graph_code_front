import { addError } from "./redux/actions";
import store from './redux/store'

const axios_base = require('axios').default;

const axios = axios_base.create({
                          baseURL: 'http://localhost:3000/',
                        });

const get = async (url) => {
  try{
  let response = await axios.get(url);
  return response
  }catch (error){
    store.dispatch(addError(`${error.response.data.error.type}: ${error.response.data.error.message}`))
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



export default {get, put, post};
