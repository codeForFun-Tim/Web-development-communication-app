/* globals fetch FormData */

import { api } from '../api';
import axios from 'axios';

async function register(email, username, password) { 
    console.log("api url Register: ",`${api.url}/Register`);
    return axios.post(`${api.url}/Register`, 
    `email=${email}&username=${username}&password=${password}`
    );
}

async function login(email, password) {
      return axios.post(`${api.url}/login`,
      `email=${email}&password=${password}`
      );
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

async function changePassword(email, oldPassword, newPassword) {
  return axios.post(`${api.url}/changePassword`,
  `_id=${'5fcaaf5a048342225cfc90c4'}&oldPassword=${oldPassword}&newPassword=${newPassword}`
  );
}

async function getUser(email) {
  return axios.get(`${api.url}/getUser`,
  `email=${email}`
  );
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
  changePassword,
  getUser,
  checkAuth,
};