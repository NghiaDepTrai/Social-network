import Axios from 'axios';
/**
 * 
 * @description Function takes a token and add to the header,
 * if there is no token it will delete from the 'global' headers
 * @param token
 *  
 *
 * @example This must run along with a local storage:
 *        const { token } = localStorage;
 *        if (token) setAuthToken(token);
 */
 
const setAuthToken = (token) => {
  if (token) {
    Axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete Axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
