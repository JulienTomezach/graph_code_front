import { addError } from "./redux/actions";
const axios_base = require('axios').default;

const axios = axios_base.create({
                          baseURL: 'http://localhost:3000/',
                        });

const get = async (url) => {
  let response = await axios.get(url);
  if(response.status === 200) return response;

}

const put = async (url, body) => {
 let response = axios.put(url, body);
 if(response.status === 200) return response;
}

const post = async (url, body) => {
 let response = axios.post(url, body);
 if(response.status === 200) return response;
}



export default {get, put, post};
