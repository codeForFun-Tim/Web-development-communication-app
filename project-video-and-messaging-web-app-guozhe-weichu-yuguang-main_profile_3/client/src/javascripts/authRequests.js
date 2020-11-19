/* globals fetch FormData */

import { api } from '../api';
import axios from 'axios';

async function register(email, username, password) {
//   const formData = new FormData();
//   formData.append('email', email);
//   formData.append('username', username);
//   formData.append('password', password);
  
try{
    console.log("api url Register: ",`${api.url}/Register`);
  await axios.post(`${api.url}/Register`,
 
  `email=${email}&username=${username}&password=${password}`
  );
}
catch(err){
    console.log(err);
}
    //{
    //   method: 'POST',
    //   body: {email,username,password},
    //   credentials: 'include',
    //   mode: 'cors',
   // });
}

async function login(email, password) {
  return fetch(`${api.url}/login`,
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
      },
      credentials: 'include',
      mode: 'cors',
    });
}

async function logout() {
  return fetch(`${api.url}/logout`,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
      },
      credentials: 'include',
      mode: 'cors',
    });
}

async function checkAuth() {
  return fetch(`${api.url}/checkAuth`,
    {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
      },
      credentials: 'include',
      mode: 'cors',
    });
}

export {
  register,
  login,
  logout,
  checkAuth,
};