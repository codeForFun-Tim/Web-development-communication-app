/* globals fetch FormData */

import { api } from '../api';
import axios from 'axios';

async function register(email, username, password) { 
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('username', username);
  return fetch(`${api.url}/Register`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
      mode: 'cors',
    });
}

async function login(email, password) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  return fetch(`${api.url}/login`,
    {
      method: 'POST',
      body: formData,
      mode: 'cors',
    });
}

async function logout() {
  return axios.post(`${api.url}/logout`,
  {
    withCredentials: true,
  });
}

async function changePassword(email, newPassword) {
  return axios.post(`${api.url}/changePassword`,
  `email=${email}&&newPassword=${newPassword}`,
  {
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
  checkAuth,
};