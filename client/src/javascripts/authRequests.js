/* globals fetch FormData */

import { api } from '../api';
import axios from 'axios';

async function register(email, username, password) { 
  try{
      console.log("api url Register: ",`${api.url}/Register`);
    await axios.post(`${api.url}/Register`,
  
    `email=${email}&username=${username}&password=${password}`
    );
  }
  catch(err){
      console.log(err);
  }
}

async function login(email, password) {
  try{
      await axios.post(`${api.url}/login`,
      `email=${email}&password=${password}`
      );
  }
  catch(err){
      console.log(err);
  }
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