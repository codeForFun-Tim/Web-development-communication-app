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

async function changePassword(email, newPassword) {
  return axios.post(`${api.url}/changePassword`,
  `email=${email}&&newPassword=${newPassword}`,
  {
    withCredentials: true,
  });
}

async function getUser(email) {
  return axios.get(`${api.url}/getUser`,
  `email=${email}`, {
    withCredentials: true,
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
  changePassword,
  getUser,
  checkAuth,
};